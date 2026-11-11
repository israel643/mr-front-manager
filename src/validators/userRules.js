import { required, email } from "@vuelidate/validators";

export const userRules = {
  name: { required },
  lastName: { required },
  email: { required, email },
  roleId: { required },
};
