import { Locator, Page } from "@playwright/test";

export class ExamplePage {
    protected page: Page;
    private temperatureContainer: Locator;
    private buyMoisturizersButton: Locator;
    private buySunscreensButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.temperatureContainer = this.page.locator("#temperature");
        this.buyMoisturizersButton = this.page.locator("button:has-text('')");
        this.buySunscreensButton = this.page.locator("button:has-text('')");
    }

    async open(): Promise<void> {
        await this.page.goto(`${process.env["BASE_URL"]}`);
        await this.temperatureContainer.click();
        await this.buyMoisturizersButton.click();
        await this.buySunscreensButton.click();
    }
}
