import { helpers } from "@vuelidate/validators";

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export const phoneProviderRules = {
  newPhone: {
    validPhone: helpers.withMessage(
      "Debe ser un número de télefono válido",
      (value) => !value || phoneRegex.test(value)
    ),
  },
};
