export function identificationError(code?: string): string {
    if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') return 'Veuillez patienter un instant avant de demander un nouveau lien.'
    if (code === 'email_address_invalid') return 'Vérifiez votre adresse email.'
    if (code === 'email_address_not_authorized' || code === 'unexpected_failure') return 'Le service d’identification doit encore être configuré. Contactez l’organisateur.'
    return 'Le lien de connexion n’a pas pu être envoyé. Réessayez dans un instant.'
}
