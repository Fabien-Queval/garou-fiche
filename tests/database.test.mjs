import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { randomUUID, createHash } from 'node:crypto'
import { PGlite } from '@electric-sql/pglite'

test('le schéma Postgres protège les fiches et agrège seulement la meute autorisée', async t => {
    const db = new PGlite()
    t.after(() => db.close())
    await db.exec(`
        create role anon; create role authenticated;
        create schema auth;
        create table auth.users(id uuid primary key);
        create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
        grant usage on schema auth to authenticated, anon;
        grant execute on function auth.uid() to authenticated, anon;
    `)
    await db.exec(await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8'))
    const campaign = randomUUID(), otherCampaign = randomUUID(), group = randomUUID(), otherGroup = randomUUID(), thirdGroup = randomUUID()
    const a = randomUUID(), b = randomUUID(), gm = randomUUID(), outsider = randomUUID(), newcomer = randomUUID()
    for (const id of [a,b,gm,outsider,newcomer]) await db.query('insert into auth.users(id) values($1)', [id])
    for (const id of [campaign,otherCampaign]) await db.query('insert into private.garou_campaigns(id,name) values($1,$2)',[id,'Test'])
    for (const [id,cid] of [[group,campaign],[otherGroup,campaign],[thirdGroup,otherCampaign]]) await db.query('insert into private.garou_groups(id,campaign_id,name) values($1,$2,$3)',[id,cid,'Test'])
    for (const [id,gid,role] of [[a,group,'player'],[b,group,'player'],[gm,group,'gm'],[outsider,otherGroup,'player']]) await db.query('insert into private.garou_memberships(user_id,group_id,role) values($1,$2,$3)',[id,gid,role])
    const code = 'reference-test-invitation'
    await db.query("insert into private.garou_invitations(group_id,code_hash,expires_at,max_uses) values($1,$2,now()+interval '1 day',1)",[group,createHash('sha256').update(code).digest('hex')])
    await db.exec('set role authenticated')
    async function as(id) { await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]) }
    async function save(points,extra={}) { await db.query('select public.garou_save_questionnaire($1::jsonb,$2)',[JSON.stringify({ concept:'Dossier privé', ...extra }),points]) }
    await as(a); await save(2)
    await as(b); await save(3)
    await as(outsider); await save(5)

    await t.test('un joueur voit seulement sa fiche et ne peut pas modifier directement les tables',async()=>{
        await as(a)
        const { rows } = await db.query('select owner_id from public.garou_questionnaires')
        assert.deepEqual(rows.map(row=>row.owner_id),[a])
        assert.equal((await db.query('select owner_id from public.garou_questionnaires where owner_id=$1',[b])).rows.length,0)
        await assert.rejects(db.query("update public.garou_questionnaires set answers='{}'"),/permission denied/)
        await assert.rejects(db.query('select * from private.garou_memberships'),/permission denied/)
    })
    await t.test('le MJ voit les fiches de son groupe uniquement',async()=>{
        await as(gm)
        const { rows } = await db.query('select owner_id from public.garou_questionnaires')
        assert.deepEqual(new Set(rows.map(row=>row.owner_id)),new Set([a,b]))
    })
    await t.test('la somme se recharge après modification et refuse les autres groupes/campagnes',async()=>{
        await as(a)
        assert.deepEqual((await db.query('select public.garou_totem_summary($1,$2) as value',[campaign,group])).rows[0].value,{total:5,ownContribution:2})
        await as(b); await save(4); await as(a)
        assert.equal((await db.query('select public.garou_totem_summary($1,$2) as value',[campaign,group])).rows[0].value.total,6)
        for (const [cid,gid] of [[campaign,otherGroup],[otherCampaign,group],[otherCampaign,thirdGroup]]) await assert.rejects(db.query('select public.garou_totem_summary($1,$2)',[cid,gid]),/inaccessible/)
    })
    await t.test('la base contrôle le budget et retire la copie JSON de la contribution',async()=>{
        await as(a)
        await assert.rejects(save(6),/Contribution invalide/)
        await assert.rejects(save(3,{backgroundDraft:{values:{allies:3},confirmed:false}}),/Budget invalide/)
        await assert.rejects(save(0,{backgroundDraft:{values:{spiritHeritage:5},details:{},confirmed:true}}),/Type d esprits/)
        await save(2,{backgroundDraft:{values:{totemContribution:2,allies:3},confirmed:true}})
        const row=(await db.query('select answers,totem_contribution from public.garou_questionnaires')).rows[0]
        assert.equal(row.answers.backgroundDraft.values.totemContribution,undefined)
        assert.equal(row.totem_contribution,2)
    })
    await t.test('une invitation rattache le joueur sans lui donner le rôle MJ',async()=>{
        await as(newcomer)
        await assert.rejects(db.query('select public.garou_join_group($1)',['mauvaise-reference']),/invalide/)
        const joined=(await db.query('select public.garou_join_group($1) as value',[code])).rows[0].value
        assert.equal(joined.groupId,group)
        assert.equal(joined.role,'player')
        assert.equal((await db.query('select public.garou_join_group($1) as value',[code])).rows[0].value.groupId,group)
        assert.equal((await db.query('select owner_id from public.garou_questionnaires')).rows.length,0)
    })
    await t.test('une session absente et le rôle anonyme n’accèdent pas aux RPC',async()=>{
        await as('')
        await assert.rejects(save(0),/Identification requise/)
        await db.exec('set role anon')
        await assert.rejects(db.query('select public.garou_context()'),/permission denied/)
        await assert.rejects(db.query('select * from public.garou_questionnaires'),/permission denied/)
    })
})
