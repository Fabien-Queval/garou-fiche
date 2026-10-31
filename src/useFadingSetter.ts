import { useCallback, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { fadeScene } from './sceneTransition'

/** Les saisies restent immédiates ; seuls les changements d'étape déclenchent le fondu. */
export default function useFadingSetter<T>(value: T, setter: Dispatch<SetStateAction<T>>, shouldFade: (before: T, after: T) => boolean, night: boolean | ((before: T, after: T) => boolean) = false): Dispatch<SetStateAction<T>> {
    const pending = useRef(false)
    return useCallback(action => {
        const next = typeof action === 'function' ? (action as (current: T) => T)(value) : action
        if (!shouldFade(value, next)) { setter(action); return }
        if (pending.current) return
        pending.current = true
        fadeScene(() => {
            pending.current = false
            setter(action)
        }, { night: typeof night === 'function' ? night(value, next) : night })
    }, [value, setter, shouldFade, night])
}
