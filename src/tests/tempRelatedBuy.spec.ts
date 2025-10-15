import { test } from "../fixtures/customFixtures";
import * as ui from "../data/ui-data/tempRelatedBuy";

test.describe("Temperature-based Product Selection", () => {
    test.beforeEach(async ({ pages }) => {
        await pages.startPage.open();
    });

    test("E2E Shopping Test", { tag: ["@reg"] }, async ({ pages }) => {
        let selectedResource: string;

        await test.step("Navigate to the web and select product", async () => {
            selectedResource = await pages.startPage.selectProductBasedOnTemperature();
        });

        await test.step("Complete product selection based on temperature", async () => {
            if (selectedResource === "moisturizers") {
                await pages.productPage.selectProductsByCriteria(ui.MOISTURIZER_CRITERIA);
                await pages.productPage.goToCart();
            } else if (selectedResource === "sunscreens") {
                await pages.productPage.selectProductsByCriteria(ui.SUNSCREEN_CRITERIA);
                await pages.productPage.goToCart();
            } else {
                return;
            }
        });

        await test.step("Complete checkout process", async () => {
            if (selectedResource !== "none") {
                const expectedCriteria =
                    selectedResource === "moisturizers" ? ui.MOISTURIZER_CRITERIA : ui.SUNSCREEN_CRITERIA;
                await pages.checkoutPage.assert.cartContents(expectedCriteria);
                await pages.checkoutPage.completeCheckoutProcess(ui.PAYMENT_DETAILS);
                await pages.checkoutPage.assert.paymentIsSuccess();
            }
        });
    });
});
