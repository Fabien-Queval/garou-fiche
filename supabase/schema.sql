create schema if not exists private;

create table private.garou_campaigns (
    id uuid primary key default gen_random_uuid(),
    name text not null
);
create table private.garou_groups (
    id uuid primary key default gen_random_uuid(),
    campaign_id uuid not null references private.garou_campaigns(id),
    name text not null
);
create table private.garou_memberships (
    user_id uuid primary key references auth.users(id) on delete cascade,
    group_id uuid not null references private.garou_groups(id),
    role text not null default 'player' check (role in ('player', 'gm'))
);
create index garou_groups_campaign_idx on private.garou_groups(campaign_id);
create index garou_memberships_group_idx on private.garou_memberships(group_id);
create table private.garou_invitations (
    id uuid primary key default gen_random_uuid(),
    group_id uuid not null references private.garou_groups(id),
    code_hash text unique not null,
    expires_at timestamptz not null,
    max_uses integer not null check (max_uses > 0),
    uses integer not null default 0 check (uses >= 0)
);
create table public.garou_questionnaires (
    owner_id uuid primary key references auth.users(id) on delete cascade,
    group_id uuid references private.garou_groups(id),
    answers jsonb not null default '{}'::jsonb check (jsonb_typeof(answers) = 'object'),
    totem_contribution integer not null default 0 check (totem_contribution between 0 and 5),
    updated_at timestamptz not null default now()
);
create index garou_invitations_group_idx on private.garou_invitations(group_id);
create index garou_questionnaires_group_idx on public.garou_questionnaires(group_id);

alter table private.garou_campaigns enable row level security;
alter table private.garou_groups enable row level security;
alter table private.garou_memberships enable row level security;
alter table private.garou_invitations enable row level security;
alter table public.garou_questionnaires enable row level security;
revoke all on all tables in schema private from public, anon, authenticated;
revoke all on public.garou_questionnaires from public, anon, authenticated;
grant select on public.garou_questionnaires to authenticated;
grant usage on schema private to authenticated;

create function private.garou_is_gm(p_group_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
    select auth.uid() is not null and exists (
        select 1 from private.garou_memberships m
        where m.user_id = auth.uid() and m.group_id = p_group_id and m.role = 'gm'
    );
$$;
revoke all on function private.garou_is_gm(uuid) from public, anon;
grant execute on function private.garou_is_gm(uuid) to authenticated;
create policy garou_questionnaire_read on public.garou_questionnaires
for select to authenticated
using (owner_id = (select auth.uid()) or private.garou_is_gm(group_id));

create function private.garou_check_backgrounds(p_values jsonb, p_contribution integer, p_details jsonb, p_confirmed boolean)
returns void language plpgsql set search_path = '' as $$
declare key text; value jsonb; points integer := p_contribution;
begin
    if p_contribution is null or p_contribution < 0 or p_contribution > 5 then
        raise exception 'Contribution invalide' using errcode = '22023';
    end if;
    if p_values is null then
        if p_confirmed then raise exception 'Historiques manquants' using errcode = '22023'; end if;
        return;
    end if;
    if jsonb_typeof(p_values) <> 'object' then raise exception 'Historiques invalides' using errcode = '22023'; end if;
    for key, value in select * from jsonb_each(p_values) loop
        if key not in ('allies','ancestors','contacts','fate','fetish','kinfolk','mentor','pureBreed','resources','spiritHeritage')
           or jsonb_typeof(value) <> 'number' or value::text !~ '^[0-5]$' then
            raise exception 'Historique invalide' using errcode = '22023';
        end if;
        points := points + (value::text)::integer;
    end loop;
    if points > 5 or (p_confirmed and points <> 5) then raise exception 'Budget invalide' using errcode = '22023'; end if;
    if p_confirmed and coalesce((p_values->>'spiritHeritage')::integer, 0) > 0
       and nullif(btrim(p_details #>> '{spiritHeritage,0,spiritType}'), '') is null then
        raise exception 'Type d esprits manquant' using errcode = '22023';
    end if;
end;
$$;
revoke all on function private.garou_check_backgrounds(jsonb,integer,jsonb,boolean) from public, anon, authenticated;

create function private.garou_save_questionnaire(p_answers jsonb, p_contribution integer)
returns void language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); gid uuid; clean jsonb;
begin
    if uid is null then raise exception 'Identification requise' using errcode = '42501'; end if;
    if p_answers is null or jsonb_typeof(p_answers) <> 'object' or octet_length(p_answers::text) > 200000 then
        raise exception 'Dossier invalide' using errcode = '22023';
    end if;
    clean := p_answers #- '{backgroundDraft,values,totemContribution}';
    perform private.garou_check_backgrounds(clean #> '{backgroundDraft,values}', p_contribution,
        clean #> '{backgroundDraft,details}', coalesce((clean #>> '{backgroundDraft,confirmed}')::boolean, false));
    select m.group_id into gid from private.garou_memberships m where m.user_id = uid;
    insert into public.garou_questionnaires(owner_id,group_id,answers,totem_contribution)
    values(uid,gid,clean,p_contribution)
    on conflict(owner_id) do update set group_id=excluded.group_id, answers=excluded.answers,
        totem_contribution=excluded.totem_contribution, updated_at=clock_timestamp();
end;
$$;
revoke all on function private.garou_save_questionnaire(jsonb,integer) from public, anon;
grant execute on function private.garou_save_questionnaire(jsonb,integer) to authenticated;
create function public.garou_save_questionnaire(p_answers jsonb, p_contribution integer)
returns void language sql security invoker set search_path = '' as $$
    select private.garou_save_questionnaire(p_answers,p_contribution);
$$;
revoke all on function public.garou_save_questionnaire(jsonb,integer) from public, anon;
grant execute on function public.garou_save_questionnaire(jsonb,integer) to authenticated;

create function private.garou_context()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
    if auth.uid() is null then raise exception 'Identification requise' using errcode = '42501'; end if;
    select jsonb_build_object('campaignId',g.campaign_id,'groupId',g.id,'groupName',g.name,'role',m.role)
    into result from private.garou_memberships m join private.garou_groups g on g.id=m.group_id
    where m.user_id=auth.uid();
    return result;
end;
$$;
revoke all on function private.garou_context() from public, anon;
grant execute on function private.garou_context() to authenticated;
create function public.garou_context() returns jsonb language sql stable security invoker set search_path = '' as $$
    select private.garou_context();
$$;
revoke all on function public.garou_context() from public, anon;
grant execute on function public.garou_context() to authenticated;

create function private.garou_join_group(p_code text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); invitation private.garou_invitations; existing_group uuid;
begin
    if uid is null then raise exception 'Identification requise' using errcode = '42501'; end if;
    if p_code is null or length(p_code) > 200 then raise exception 'Reference invalide' using errcode = '22023'; end if;
    select * into invitation from private.garou_invitations
    where code_hash=encode(sha256(convert_to(btrim(p_code),'UTF8')),'hex') for update;
    if not found then
        raise exception 'Reference invalide ou expiree' using errcode = '22023';
    end if;
    select group_id into existing_group from private.garou_memberships where user_id=uid;
    if existing_group is not null then
        if existing_group=invitation.group_id then return private.garou_context(); end if;
        raise exception 'Dossier deja rattache' using errcode = '42501';
    end if;
    if invitation.expires_at < now() or invitation.uses >= invitation.max_uses then
        raise exception 'Reference invalide ou expiree' using errcode = '22023';
    end if;
    insert into private.garou_memberships(user_id,group_id,role) values(uid,invitation.group_id,'player');
    update private.garou_invitations set uses=uses+1 where id=invitation.id;
    update public.garou_questionnaires set group_id=invitation.group_id where owner_id=uid;
    return private.garou_context();
end;
$$;
revoke all on function private.garou_join_group(text) from public, anon;
grant execute on function private.garou_join_group(text) to authenticated;
create function public.garou_join_group(p_code text) returns jsonb language sql security invoker set search_path = '' as $$
    select private.garou_join_group(p_code);
$$;
revoke all on function public.garou_join_group(text) from public, anon;
grant execute on function public.garou_join_group(text) to authenticated;

create function private.garou_totem_summary(p_campaign_id uuid, p_group_id uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare total integer; own integer;
begin
    if auth.uid() is null or not exists (
        select 1 from private.garou_memberships m join private.garou_groups g on g.id=m.group_id
        where m.user_id=auth.uid() and g.id=p_group_id and g.campaign_id=p_campaign_id
    ) then raise exception 'Groupe inaccessible' using errcode='42501'; end if;
    select coalesce(sum(q.totem_contribution),0), coalesce(max(q.totem_contribution) filter(where q.owner_id=auth.uid()),0)
    into total,own from public.garou_questionnaires q join private.garou_memberships m on m.user_id=q.owner_id and m.group_id=q.group_id
    where q.group_id=p_group_id;
    return jsonb_build_object('total',total,'ownContribution',own);
end;
$$;
revoke all on function private.garou_totem_summary(uuid,uuid) from public, anon;
grant execute on function private.garou_totem_summary(uuid,uuid) to authenticated;
create function public.garou_totem_summary(p_campaign_id uuid, p_group_id uuid)
returns jsonb language sql stable security invoker set search_path = '' as $$
    select private.garou_totem_summary(p_campaign_id,p_group_id);
$$;
revoke all on function public.garou_totem_summary(uuid,uuid) from public, anon;
grant execute on function public.garou_totem_summary(uuid,uuid) to authenticated;

create function private.garou_save_backgrounds(p_campaign_id uuid, p_group_id uuid, p_contribution integer, p_backgrounds jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare answers jsonb;
begin
    perform private.garou_totem_summary(p_campaign_id,p_group_id);
    select q.answers into answers from public.garou_questionnaires q where q.owner_id=auth.uid();
    answers := jsonb_set(coalesce(answers,'{}'::jsonb),'{backgroundDraft}',p_backgrounds,true);
    perform private.garou_save_questionnaire(answers,p_contribution);
end;
$$;
revoke all on function private.garou_save_backgrounds(uuid,uuid,integer,jsonb) from public, anon;
grant execute on function private.garou_save_backgrounds(uuid,uuid,integer,jsonb) to authenticated;
create function public.garou_save_backgrounds(p_campaign_id uuid, p_group_id uuid, p_contribution integer, p_backgrounds jsonb)
returns void language sql security invoker set search_path = '' as $$
    select private.garou_save_backgrounds(p_campaign_id,p_group_id,p_contribution,p_backgrounds);
$$;
revoke all on function public.garou_save_backgrounds(uuid,uuid,integer,jsonb) from public, anon;
grant execute on function public.garou_save_backgrounds(uuid,uuid,integer,jsonb) to authenticated;
