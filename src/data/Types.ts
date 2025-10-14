import { Locator } from "@playwright/test";

export type ProductTypes = "moisturizers" | "sunscreens" | "none";

export type Product = {
    name: string;
    price: number;
    element: Locator;
};

export type ProductSelectionCriteria = {
    productDescription: string;
    productPrice: "min" | "max" | number;
};

export type CartItem = {
    name: string;
    price: number;
};
