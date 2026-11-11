import { helpers, email } from "@vuelidate/validators";

export const emailProviderRules = {
  newEmail: {
    email: helpers.withMessage("Debe ser un correo válido", email),
  },
};
