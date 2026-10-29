import { lazy } from 'react'
import Authentication from './Authentication'

// Cet aperçu reste séparé des dossiers et disparaît de la version publiée.
const UmbraPreview = import.meta.env.DEV ? lazy(() => import('./UmbraPreview')) : null

export default function RootScreen() {
    const preview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('screen') === 'umbra'
    return preview && UmbraPreview ? <UmbraPreview /> : <Authentication />
}
