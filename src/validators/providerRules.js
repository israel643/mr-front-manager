import { required, } from "@vuelidate/validators";

export const providerRules = {
    name: { required },
    address: { required },
}