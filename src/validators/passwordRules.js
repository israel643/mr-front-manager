import { required, sameAs, helpers } from "@vuelidate/validators";

const strongPassword = helpers.withMessage(
  "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
  (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
);

export const passwordRules = (confirmWith) => ({
  password: {
    required,
    strongPassword,
  },
  confirmPassword: {
    required,
    sameAsPassword: sameAs(confirmWith),
  },
});
