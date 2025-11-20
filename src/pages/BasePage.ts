import { Locator, Page, Response } from "@playwright/test";
import Logger from "@logger/Logger";

export abstract class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async login(): Promise<void> {
        const baseUrl = process.env["BASE_IA_URL"] || process.env["BASE_URL"] || "http://localhost:3000";
        await this.page.goto(`${baseUrl}`);
        await this.page.waitForLoadState("domcontentloaded");
    }

    protected async pause(): Promise<void> {
        await this.page.pause();
    }

    protected async goBack(): Promise<void> {
        await this.page.goBack();
        await this.page.waitForLoadState("domcontentloaded");
    }

    protected async waitForTimeOut(miliseconds: number): Promise<void> {
        await this.page.waitForTimeout(miliseconds);
    }

    protected async waitForSpinnerToFinish(): Promise<void> {
        let spinnerVisibility = await this.page.locator("div.k-loading-mask").last().isVisible();
        while (spinnerVisibility === true) {
            this.waitForTimeOut(1000);
            spinnerVisibility = await this.page.locator("div.k-loading-mask").last().isVisible();
        }
        await this.page.waitForTimeout(2000);
    }

    protected async reloadPage(): Promise<void> {
        await this.page.reload({ timeout: 20000 });
        await this.page.waitForLoadState("domcontentloaded");
    }

    protected async downloadFile(locator: string, fileName: string) {
        const [download] = await Promise.all([
            this.page.waitForEvent("download"),
            await this.page.locator(locator).click(),
        ]);
        await download.path();
        await download.saveAs("test-results/downloads/" + fileName);
    }

    protected async selectValueFromCombobox(locator: Locator, value: string): Promise<void> {
        await locator.waitFor({ state: "visible" });
        await locator.click({ delay: 500 });
        await this.waitForTimeOut(500);
        await this.page
            .locator("ul[aria-hidden = 'false']>li[role = 'option']:text-is('" + value + "')")
            .click({ delay: 500 });
    }

    protected async chooseOptionFromDropdown(value: string): Promise<void> {
        await this.waitForTimeOut(500);
        await this.page.locator(`span[title="${value}"]`).click({ delay: 500 });
        await this.waitForTimeOut(500);
    }

    protected async clickAndGetApiResponse(locator: Locator, methodToWait: string, url: string): Promise<Response> {
        await locator.click();
        return await this.page.waitForResponse(
            response =>
                response.url().includes(url) &&
                response.request().method() === methodToWait &&
                response.status() === 200,
        );
    }

    protected async fillAndPressTab(locator: Locator, value: string) {
        await locator.fill(value);
        await this.page.keyboard.press("Tab");
    }

    protected async fillAndPressEnter(locator: Locator, value: string) {
        await locator.fill(value);
        await this.page.keyboard.press("Enter");
    }

    protected async acceptAlert(): Promise<void> {
        this.page.on("dialog", dialog => dialog.accept());
    }

    protected async waitForResponse(
        method: "POST" | "PUT" | "GET" | "DELETE",
        relatedUrl: string,
        timeout = 5000,
        throwErrorOnTimeout = false,
    ): Promise<Response | null> {
        try {
            let response = await this.page.waitForResponse(
                async response => {
                    try {
                        const isMethodMatch = response.request().method() === method;
                        const isUrlMatch = response.request().url().includes(relatedUrl);
                        const finishedResult = await response.finished();
                        const isFinished = finishedResult === null;

                        return isMethodMatch && isUrlMatch && isFinished;
                    } catch {
                        return false;
                    }
                },
                { timeout: timeout },
            );

            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            Logger.warn(`waitForResponse timeout after ${timeout}ms for ${method} ${relatedUrl}: ${errorMessage}`);
            if (throwErrorOnTimeout) {
                throw err;
            } else {
                return null;
            }
        }
    }
}
