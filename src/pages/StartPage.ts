import { ProductTypes } from "../data/Types";
import { Locator, Page } from "@playwright/test";

export class StartPage {
    protected page: Page;
    private temperatureContainer: Locator;
    private buyMoisturizersButton: Locator;
    private buySunscreensButton: Locator;

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

    async selectProductBasedOnTemperature(): Promise<ProductTypes> {
        const temperatureText = await this.getTemperature();
        const temperatureMatch = temperatureText.match(/(-?\d+)/);
        const temperature = temperatureMatch ? parseInt(temperatureMatch[0], 10) : 0;

        if (temperature < 19) {
            console.log(`Temperature is ${temperature}°C - Shopping for moisturizers`);
            await this.clickBuyMoisturizers();
            await this.page.waitForLoadState("networkidle");
            return "moisturizers";
        } else if (temperature > 34) {
            console.log(`Temperature is ${temperature}°C - Shopping for sunscreens`);
            await this.clickBuySunscreens();
            await this.page.waitForLoadState("networkidle");
            return "sunscreens";
        } else {
            console.log(
                `Temperature is ${temperature}°C - Neither moisturizers nor sunscreens needed (temperature is between 19-34°C)`,
            );
            return "none";
        }
    }
}
