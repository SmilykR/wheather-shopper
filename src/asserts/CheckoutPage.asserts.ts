import { CheckoutPage } from "@/pages/CheckoutPage";
import { ProductSelectionCriteria } from "@/data/Types";
import { expect } from "@playwright/test";
import { BaseAsserts } from "@/asserts/Base.asserts";

export class CheckoutPageAssertions extends BaseAsserts {
    private readonly checkoutPage: CheckoutPage;

    constructor(checkoutPage: CheckoutPage) {
        super(checkoutPage.getPage());
        this.checkoutPage = checkoutPage;
    }

    async cartContents(expectedCriteria: ProductSelectionCriteria[]): Promise<void> {
        console.log("=== Verifying Cart Contents ===");

        const items = await this.checkoutPage.getCartItems();
        const displayedTotal = await this.checkoutPage.getTotalAmount();
        const calculatedTotal = items.reduce((sum, item) => sum + item.price, 0);

        console.log(`Cart Items (${items.length}):`);
        items.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.name} - Rs. ${item.price}`);
        });

        // Verify cart total calculation
        expect(displayedTotal, `Cart total mismatch. Expected: ${calculatedTotal}, Got: ${displayedTotal}`).toBe(
            calculatedTotal,
        );

        // Verify expected items based on criteria
        console.log("=== Verifying Expected Items Based on Criteria ===");

        expect(items.length, `Expected ${expectedCriteria.length} items in cart, but found ${items.length}`).toBe(
            expectedCriteria.length,
        );

        // Check each criteria matches an item in the cart
        expectedCriteria.forEach(criteria => {
            const matchingItem = items.find(item =>
                item.name.toLowerCase().includes(criteria.productDescription.toLowerCase()),
            );

            expect(
                matchingItem,
                `No item found in cart matching criteria: ${criteria.productDescription}`,
            ).toBeTruthy();

            console.log(`Found expected item: ${matchingItem!.name} (matches "${criteria.productDescription}")`);
        });

        console.log("All expected items verified in cart");
    }

    async paymentIsSuccess(): Promise<void> {
        console.log("=== Verifying Payment Success ===");
        await expect(this.checkoutPage.successfulPaymentMessage).toBeVisible();
        console.log(" Payment success page verified successfully");
    }
}
