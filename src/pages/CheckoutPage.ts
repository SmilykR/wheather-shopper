import { CheckoutPageAssertions } from "@/asserts/CheckoutPage.asserts";
import { CartItem } from "@/data/Types";
import { BasePage } from "@/pages/BasePage";
import { FrameLocator, Locator, Page, expect } from "@playwright/test";

export class CheckoutPage extends BasePage {
    private cartItems: Locator;
    private totalAmount: Locator;
    private payWithCardButton: Locator;
    private stripeFrame: FrameLocator;
    private emailInput: Locator;
    private cardNumberInput: Locator;
    private expiryDateInput: Locator;
    private cvcInput: Locator;
    private zipCodeInput: Locator;
    readonly successfulPaymentMessage: Locator;
    public assert: CheckoutPageAssertions;

    constructor(page: Page) {
        super(page);

        this.cartItems = this.page.locator("table.table-striped tbody tr");
        this.totalAmount = this.page.locator("#total");
        this.payWithCardButton = this.page.locator(".stripe-button-el");
        this.stripeFrame = this.page.frameLocator("iframe[name^='stripe_checkout_app']");
        this.emailInput = this.stripeFrame.locator("input[type='email']");
        this.cardNumberInput = this.stripeFrame.locator("input[placeholder*='Card number']");
        this.expiryDateInput = this.stripeFrame.locator("input[placeholder*='MM']");
        this.cvcInput = this.stripeFrame.locator("input[placeholder*='CVC']");
        this.zipCodeInput = this.stripeFrame.locator("input[placeholder*='ZIP']");
        this.successfulPaymentMessage = this.page.locator("h2:has-text('PAYMENT SUCCESS')");

        this.assert = new CheckoutPageAssertions(this);
    }

    public getPage(): Page {
        return this.page;
    }

    async open(): Promise<void> {
        await this.page.goto(`${process.env["BASE_URL"]}/cart`);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async getCartItems(): Promise<CartItem[]> {
        await expect(this.cartItems.first()).toBeVisible();
        const itemCount = await this.cartItems.count();
        expect(itemCount, "Cart should not be empty").toBeGreaterThan(0);

        const items: CartItem[] = [];

        for (let i = 0; i < itemCount; i++) {
            const row = this.cartItems.nth(i);
            const nameCell = row.locator("td").first();
            const priceCell = row.locator("td").last();

            // Ensure cells are visible before extracting content
            await expect(nameCell).toBeVisible();
            await expect(priceCell).toBeVisible();

            const name = await nameCell.textContent();
            const priceText = await priceCell.textContent();

            expect(name, "Product name should not be empty").toBeTruthy();
            expect(priceText, "Product price should not be empty").toBeTruthy();

            const priceMatch = priceText!.match(/(\d+)/);
            expect(priceMatch, `Invalid price format: ${priceText}`).toBeTruthy();
            const price = parseInt(priceMatch![0], 10);

            items.push({
                name: name!.trim(),
                price,
            });
        }

        return items;
    }

    async getTotalAmount(): Promise<number> {
        const totalText = await this.totalAmount.textContent();

        expect(totalText, "Total amount should not be empty").toBeTruthy();
        const totalMatch = totalText!.match(/(\d+)/);
        expect(totalMatch, `Invalid total format: ${totalText}`).toBeTruthy();

        return parseInt(totalMatch![0], 10);
    }

    async clickPayWithCard(): Promise<void> {
        console.log("Initiating payment process...");
        await this.payWithCardButton.click();
    }

    async fillPaymentDetails(paymentDetails: {
        email: string;
        cardNumber: string;
        expiryDate: string;
        cvc: string;
        zipCode: string;
    }): Promise<void> {
        await expect(this.page.locator("iframe[name^='stripe_checkout_app']")).toBeVisible({ timeout: 10000 });
        await this.emailInput.pressSequentially(paymentDetails.email, { delay: 100 });
        await this.cardNumberInput.pressSequentially(paymentDetails.cardNumber, { delay: 100 });
        await this.expiryDateInput.pressSequentially(paymentDetails.expiryDate, { delay: 100 });
        await this.cvcInput.pressSequentially(paymentDetails.cvc, { delay: 100 });
        await this.zipCodeInput.pressSequentially(paymentDetails.zipCode, { delay: 100 });
    }

    async submitPayment(): Promise<void> {
        console.log("Submitting payment...");
        const submitButton = this.stripeFrame.locator("#submitButton");
        await submitButton.click();
        console.log("Payment submitted successfully");
    }

    async completeCheckoutProcess(paymentDetails: {
        email: string;
        cardNumber: string;
        expiryDate: string;
        cvc: string;
        zipCode: string;
    }): Promise<void> {
        console.log("=== Starting Checkout Process ===");
        await this.clickPayWithCard();
        await this.fillPaymentDetails(paymentDetails);
        await this.submitPayment();
        console.log("=== Checkout Process Completed ===");
    }
}
