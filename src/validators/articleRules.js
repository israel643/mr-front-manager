import { required, helpers, url, minValue } from "@vuelidate/validators";

export const articleRules = {
    name: { required },
    description: { required },
    categoryId: { required },
    brandId: { required },
    measurementId: { required },
    purchasePrice: { required, minValue: minValue(0.01) },
    salePrice: { required, minValue: minValue(0.01) },
    stock: { required, minValue: minValue(0) },
    imageUrl: {
        url: helpers.withMessage('Debe ser una URL válida', url)
    }
}