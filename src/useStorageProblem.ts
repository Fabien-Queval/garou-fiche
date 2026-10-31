import { useEffect, useState } from 'react'

export default function useStorageProblem() {
    const [failed, setFailed] = useState(false)
    useEffect(() => {
        const onFailure = () => setFailed(true)
        window.addEventListener('questionnaire-storage-error', onFailure)
        return () => window.removeEventListener('questionnaire-storage-error', onFailure)
    }, [])
    return failed
}
