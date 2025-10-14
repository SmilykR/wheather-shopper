import { test } from "../fixtures/customFixtures";

test.describe("Temperature-based Product Selection", () => {
    test.beforeEach(async ({ pages }) => {
        await pages.startPage.open();
    });

    test("E2E Shopping Test", { tag: ["@reg"] }, async ({ pages }) => {
        await test.step("Navigate to the web and select product", async () => {
            await pages.startPage.selectProductBasedOnTemperature();
        });
    });
});
