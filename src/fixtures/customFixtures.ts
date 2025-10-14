import { StartPage } from "../pages/StartPage";
import { ProductPage } from "../pages/ProductPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { test as base } from "@playwright/test";
import { BaseProductActions } from "@/actions/ui-actions/BaseProductActions";

type Fixtures = {
    pages: {
        startPage: StartPage;
        productPage: ProductPage;
        checkoutPage: CheckoutPage;
    };
    actions: {
        baseProductActions: BaseProductActions;
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

    actions: async ({ page }, use) => {
        const actions = {
            baseProductActions: new BaseProductActions(page),
        };

        await use(actions);
    },
});
