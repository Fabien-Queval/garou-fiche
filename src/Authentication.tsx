import { lazy, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { identificationError } from './authMessages'
import { accountStorageKey, createQuestionnaireRepository, preferLocalDraft } from './cloudQuestionnaire'
import type { AnswerBag, DossierContext } from './cloudQuestionnaire'
import { QuestionnaireStorageContext } from './questionnaireStorage'
import { createSupabaseTotemRepository } from './totemRepository'
import './Authentication.css'

const App = lazy(() => import('./App'))

const previewScreens = ['attributes', 'functional', 'relational', 'cognitive', 'abilities', 'talents', 'skills', 'knowledges', 'backgrounds', 'passage']
const localPreview = import.meta.env.DEV && previewScreens.includes(new URLSearchParams(window.location.search).get('screen') ?? '')
const BASE_KEY = 'garou-questionnaire-v1'

function storedBag(key: string): AnswerBag {
    try {
        const value = JSON.parse(window.localStorage.getItem(key) ?? '{}')
        return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
    } catch { return {} }
}

function LoginScreen() {
    const [email, setEmail] = useState('')
    const [busy, setBusy] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')
    const [cooldown, setCooldown] = useState(0)
    useEffect(() => {
        if (cooldown <= 0) return
        const timer = window.setTimeout(() => setCooldown(current => current - 1), 1000)
        return () => window.clearTimeout(timer)
    }, [cooldown])
    async function requestLink() {
        if (!supabase || busy || cooldown > 0) return
        setBusy(true)
        setError('')
        try {
            const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/` } })
            if (error) { setError(identificationError(error.code)); return }
            setSent(true)
            setCooldown(60)
        } catch { setError('Le service d’identification est momentanément indisponible.') }
        finally { setBusy(false) }
    }
    return <main className="identification">
        <header><p className="eyebrow">Service de santé au travail</p><h1>Accéder à votre dossier</h1><p className="subtitle">Espace individuel — Confidentiel</p></header>
        <p className="eyebrow">Identification</p>
        <h2>{sent ? 'Consultez votre messagerie' : 'Retrouver votre dossier'}</h2>
        <p className="identification-intro">{sent ? 'Votre demande a été prise en compte. Consultez votre messagerie et ouvrez le lien reçu pour accéder à votre dossier.' : 'Identifiez-vous pour conserver vos réponses et reprendre votre parcours à tout moment.'}</p>
        <form onSubmit={event => { event.preventDefault(); void requestLink() }}>
            <label htmlFor="identification-email">Adresse email</label>
            <input id="identification-email" type="email" value={email} onChange={event => { setEmail(event.target.value); setSent(false); setError('') }} required autoComplete="email" inputMode="email" maxLength={320} disabled={busy} aria-describedby="identification-note" />
            <p className="subtitle" id="identification-note">Aucun mot de passe à créer. Votre adresse sert à vous identifier et à retrouver vos réponses.</p>
            {sent && <p className="identification-status" role="status">Vérifiez également vos courriers indésirables. Vous pourrez demander un nouveau lien si nécessaire.</p>}
            {error && <p className="identification-error" role="alert">{error}</p>}
            {!supabase && <p className="identification-error" role="status">La connexion à votre dossier sera disponible prochainement.</p>}
            <button type="submit" disabled={!supabase || !email.trim() || busy || cooldown > 0}>{busy ? 'Demande en cours…' : cooldown > 0 ? `Nouveau lien dans ${cooldown} s` : sent ? 'Renvoyer le lien' : 'Recevoir mon lien de connexion'}</button>
        </form>
        <footer>Votre dossier est individuel. Le questionnaire porte sur votre personnage fictif.</footer>
    </main>
}

type Repository = ReturnType<typeof createQuestionnaireRepository>
function DossierToolbar({ repository, storageKey, context, onContext }: { repository: Repository; storageKey: string; context: DossierContext | null; onContext: (context: DossierContext) => void }) {
    const [status, setStatus] = useState('Préparation de la sauvegarde…')
    const [reference, setReference] = useState('')
    const [joining, setJoining] = useState(false)
    const [joinError, setJoinError] = useState('')
    const [showJoin, setShowJoin] = useState(false)
    useEffect(() => {
        let timer: number | undefined
        let saving = false
        let pending = false
        let stopped = false
        const abort = new AbortController()
        async function flush() {
            if (stopped || saving) return
            saving = true
            pending = false
            setStatus('Sauvegarde en cours…')
            try {
                await repository.save(storedBag(storageKey), abort.signal)
                if (!stopped) setStatus('Réponses enregistrées')
            } catch {
                if (!stopped) setStatus('Réponses conservées sur cet appareil — connexion à réessayer')
            } finally {
                saving = false
                if (pending && !stopped) void flush()
            }
        }
        function schedule(event?: Event) {
            if (event && (event as CustomEvent).detail?.key !== storageKey) return
            pending = true
            window.clearTimeout(timer)
            timer = window.setTimeout(() => void flush(), 600)
        }
        window.addEventListener('questionnaire-answer-change', schedule)
        schedule()
        return () => { stopped = true; abort.abort(); window.clearTimeout(timer); window.removeEventListener('questionnaire-answer-change', schedule) }
    }, [repository, storageKey])
    async function join() {
        setJoining(true)
        setJoinError('')
        try { onContext(await repository.join(reference)); setShowJoin(false); setReference('') }
        catch (error) { setJoinError(error instanceof Error ? error.message : 'Le rattachement a échoué.') }
        finally { setJoining(false) }
    }
    return <div className="dossier-toolbar">
        <div className="dossier-toolbar-row"><span>Votre dossier <span className="sync-status" role="status">{status}</span></span><button type="button" onClick={() => void supabase?.auth.signOut()}>Déconnexion</button></div>
        {!context && <div className="dossier-attachment">
            <button type="button" className="attachment-toggle" onClick={() => setShowJoin(current => !current)}>Rattacher mon dossier</button>
            {showJoin && <form onSubmit={event => { event.preventDefault(); void join() }}>
                <label htmlFor="dossier-reference">Référence d’accès</label><input id="dossier-reference" value={reference} onChange={event => setReference(event.target.value)} required maxLength={200} autoComplete="off" />
                <p className="subtitle">Utilisez la référence fournie par votre organisateur.</p>
                {joinError && <p role="alert" className="identification-error">{joinError}</p>}
                <button type="submit" disabled={joining || !reference.trim()}>{joining ? 'Vérification…' : 'Rattacher le dossier'}</button>
            </form>}
        </div>}
    </div>
}

function ConnectedDossier({ session }: { session: Session }) {
    const repository = useMemo(() => createQuestionnaireRepository(supabase!, session.user.id), [session.user.id])
    const storageKey = accountStorageKey(BASE_KEY, session.user.id)
    const [ready, setReady] = useState(false)
    const [error, setError] = useState('')
    const [retry, setRetry] = useState(0)
    const [context, setContext] = useState<DossierContext | null>(null)
    const [legacy, setLegacy] = useState<AnswerBag | null>(null)
    useEffect(() => {
        let alive = true
        async function open() {
            try {
                const [cloud, currentContext] = await Promise.all([repository.load(), repository.context()])
                if (!alive) return
                const local = storedBag(storageKey)
                if (cloud && !preferLocalDraft(local, cloud)) window.localStorage.setItem(storageKey, JSON.stringify({ ...cloud.answers, _updatedAt: cloud.updatedAt }))
                setContext(currentContext)
                const old = storedBag(BASE_KEY)
                if (!cloud && Object.keys(local).length === 0 && old.started && !window.localStorage.getItem('garou-imported-draft-owner')) {
                    setLegacy(old)
                } else { setReady(true) }
            } catch (error) { if (alive) setError(error instanceof Error ? error.message : 'Votre dossier est indisponible.') }
        }
        void open()
        return () => { alive = false }
    }, [repository, storageKey, retry])
    const totemRepository = useMemo(() => context ? createSupabaseTotemRepository({
        url: import.meta.env.VITE_SUPABASE_URL, publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        campaignId: context.campaignId, groupId: context.groupId,
        getAccessToken: async () => (await supabase!.auth.getSession()).data.session?.access_token ?? '',
    }) : undefined, [context])
    if (legacy && !ready) return <main className="identification"><h1>Un brouillon existe sur cet appareil</h1><p className="identification-intro">Souhaitez-vous le reprendre dans votre dossier personnel ?</p><div className="draft-choice"><button onClick={() => { window.localStorage.setItem(storageKey, JSON.stringify(legacy)); window.localStorage.setItem('garou-imported-draft-owner', session.user.id); setReady(true) }}>Reprendre ce brouillon</button><button className="secondary" onClick={() => setReady(true)}>Commencer un nouveau dossier</button></div></main>
    if (!ready) return <main className="identification"><p className="eyebrow">Service de santé au travail</p><h1>Accéder à votre dossier</h1>{error ? <><p role="alert" className="identification-error">{error} Vos réponses sur cet appareil sont conservées.</p><button onClick={() => { setError(''); setRetry(current => current + 1) }}>Réessayer</button><button className="secondary" onClick={() => void supabase?.auth.signOut()}>Revenir à l’identification</button></> : <p role="status">Ouverture de votre dossier…</p>}</main>
    return <QuestionnaireStorageContext.Provider value={storageKey}><div className="dossier-shell"><DossierToolbar repository={repository} storageKey={storageKey} context={context} onContext={setContext} /><App totemRepository={totemRepository} /></div></QuestionnaireStorageContext.Provider>
}

export default function Authentication() {
    const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null)
    useEffect(() => {
        if (!supabase || localPreview) return
        let alive = true
        void supabase.auth.getSession().then(({ data }) => { if (alive) setSession(data.session) }).catch(() => { if (alive) setSession(null) })
        // Le callback reste synchrone ; les lectures du dossier ont leur propre effet.
        const { data } = supabase.auth.onAuthStateChange((_event, session) => { if (alive) setSession(session) })
        return () => { alive = false; data.subscription.unsubscribe() }
    }, [])
    if (localPreview) return <App />
    if (session === undefined) return <main className="identification"><h1>Accéder à votre dossier</h1><p role="status">Vérification de votre accès…</p></main>
    return session ? <ConnectedDossier key={session.user.id} session={session} /> : <LoginScreen />
}
