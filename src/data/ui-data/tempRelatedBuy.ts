import { ProductSelectionCriteria } from "../Types";

export const MOISTURIZER_CRITERIA: ProductSelectionCriteria[] = [
    {
        productDescription: "Aloe",
        productPrice: "min",
    },
    {
        productDescription: "almond",
        productPrice: "min",
    },
];

export const SUNSCREEN_CRITERIA: ProductSelectionCriteria[] = [
    {
        productDescription: "SPF-50",
        productPrice: "min",
    },
    {
        productDescription: "SPF-30",
        productPrice: "min",
    },
];

export const PAYMENT_DETAILS = {
    email: "test@example.com",
    cardNumber: "4242424242424242",
    expiryDate: "12/25",
    cvc: "123",
    zipCode: "12345",
};
