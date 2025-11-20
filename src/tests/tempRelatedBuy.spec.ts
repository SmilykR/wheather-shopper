import { test } from "../fixtures/customFixtures";
import * as ui from "../data/ui-data/tempRelatedBuy";

test.describe("Example Page Tests", () => {
    test.beforeEach(async ({ pages, requests }) => {
        await pages.examplePage.open();
    });

    test("Example Test", { tag: ["@reg"] }, async ({ pages }) => {
        await test.step("Navigate to the web and select product", async () => {});

        await test.step("Complete product selection based on temperature", async () => {});

        await test.step("Complete checkout process", async () => {});
    });
});
