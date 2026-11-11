import { required, helpers, url } from '@vuelidate/validators';

export const brandRules = {
    name: { required },
    logoUrl: {
        url: helpers.withMessage('Debe ser una URL válida', url)
    },
}