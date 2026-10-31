import { lazy } from 'react'
import Authentication from './Authentication'
const PrivacyPage = lazy(() => import('./PrivacyPage'))

// Cet aperçu reste séparé des dossiers et disparaît de la version publiée.
const UmbraPreview = import.meta.env.DEV ? lazy(() => import('./UmbraPreview')) : null

export default function RootScreen() {
    if (new URLSearchParams(window.location.search).get('page') === 'confidentialite') return <PrivacyPage />
    const preview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('screen') === 'umbra'
    return preview && UmbraPreview ? <UmbraPreview /> : <Authentication />
}
