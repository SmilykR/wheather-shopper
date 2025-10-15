import { StartPage } from "../pages/StartPage";
import { ProductPage } from "../pages/ProductPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { test as base } from "@playwright/test";

type Fixtures = {
    pages: {
        startPage: StartPage;
        productPage: ProductPage;
        checkoutPage: CheckoutPage;
    };
};

export const test = base.extend<Fixtures>({
    pages: async ({ page }, use) => {
        const pages = {
            startPage: new StartPage(page),
            productPage: new ProductPage(page),
            checkoutPage: new CheckoutPage(page),
        };

        await use(pages);
    },
});
