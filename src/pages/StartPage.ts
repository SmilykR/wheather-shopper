import { Locator, Page } from "@playwright/test";

export class StartPage {
    readonly page: Page;
    readonly temperatureContainer: Locator;
    readonly buyMoisturizersButton: Locator;
    readonly buySunscreensButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.temperatureContainer = this.page.locator("#temperature");
        this.buyMoisturizersButton = this.page.locator("button:has-text('Buy moisturizers')");
        this.buySunscreensButton = this.page.locator("button:has-text('Buy sunscreens')");
    }

    async open(): Promise<void> {
        await this.page.goto(`${process.env["BASE_URL"]}`);
    }

    private async getTemperature(): Promise<string> {
        return (await this.temperatureContainer.textContent()) || "";
    }

    private async clickBuyMoisturizers(): Promise<void> {
        await this.buyMoisturizersButton.click();
    }

    private async clickBuySunscreens(): Promise<void> {
        await this.buySunscreensButton.click();
    }

    async selectProductBasedOnTemperature(): Promise<void> {
        const temperatureText = await this.getTemperature();
        const temperatureMatch = temperatureText.match(/(-?\d+)/);
        const temperature = temperatureMatch ? parseInt(temperatureMatch[0], 10) : 0;

        temperature < 19 ? await this.clickBuyMoisturizers() : await this.clickBuySunscreens();
    }
}
