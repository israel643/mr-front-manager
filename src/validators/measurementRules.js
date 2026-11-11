import { required, maxLength } from '@vuelidate/validators';

export const measurementRules = {
  name: { required },
  abbreviation: { required, maxLength: maxLength(10) },
};
