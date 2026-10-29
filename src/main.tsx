import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RootScreen from './RootScreen.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<main><h1>Accéder à votre dossier</h1><p role="status">Chargement…</p></main>}><RootScreen /></Suspense>
  </StrictMode>,
)
