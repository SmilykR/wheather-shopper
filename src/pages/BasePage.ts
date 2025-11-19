import { Locator, Page, Response } from "@playwright/test";
import xlsxFile from "read-excel-file/node";
import Logger from "@logger/Logger";
import { CommonTimeouts } from "@data/Constants";

export abstract class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async login(): Promise<void> {
        const baseUrl = process.env["BASE_IA_URL"] || process.env["BASE_URL"] || "http://localhost:3000";
        await this.page.goto(`${baseUrl}/k2?_=dashboard`);
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

    protected async getRowCountFromExcel(fileName: string): Promise<number> {
        const rowCount = xlsxFile("test-results/downloads/" + fileName).then(async (rows: any) => {
            let rowLength = rows.length;
            return rowLength;
        });
        return rowCount;
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

    protected async clickAndGetEventId(locator: Locator): Promise<any> {
        const [response] = await Promise.all([
            this.page.waitForResponse(
                res =>
                    res.body().then(b => {
                        return b.includes("eventId");
                    }),
                { timeout: CommonTimeouts.MediumRefresh },
            ),
            locator.click(),
        ]);
        let eventId = await response.json().then(data => {
            return data.value.eventId ? data.value.eventId : data.value.responses[0].value.data.eventId;
        });
        Logger.info(`The Event Id is: ${eventId}`);
        return await eventId;
    }

    protected async clickIteratively(locator: Locator): Promise<void> {
        for (let i = 0; i < 3; i++) {
            await locator.click();
            await this.page.waitForTimeout(500);
            if (!(await locator.isVisible())) {
                break;
            }
        }
    }

    protected async fillAndPressTab(locator: Locator, value: string) {
        await locator.fill(value);
        await this.page.keyboard.press("Tab");
    }

    protected async clearFillAndPressTab(locator: Locator, value: string) {
        await locator.clear();
        await locator.fill(value);
        await this.page.keyboard.press("Tab");
    }

    protected async clearFillAndPressEnter(locator: Locator, value: string) {
        await locator.clear();
        await locator.fill(value);
        await this.page.keyboard.press("Enter");
    }

    protected async clickAndPressTab(locator: Locator) {
        await locator.click({ delay: 50 });
        await this.page.keyboard.press("Tab");
    }

    protected async typeAndPressTab(locator: Locator, value: string, delay = 100) {
        await locator.pressSequentially(value, { delay: delay });
        await this.page.keyboard.press("Tab");
    }

    protected async clickTypeAndPressTab(locator: Locator, value: string, delay = 150) {
        await locator.click();
        await locator.pressSequentially(value, { delay: delay });
        await this.page.keyboard.press("Tab");
    }

    protected async clickAndType(locator: Locator, value: string, delay = 100) {
        await locator.click();
        await locator.pressSequentially(value, { delay: delay });
    }

    protected async typeAndPressEnter(locator: Locator, value: string, delay = 100) {
        await locator.pressSequentially(value, { delay: delay });
        await this.page.keyboard.press("Enter");
    }
    protected async typeAndPressEnterAndTab(locator: Locator, value: string, delay = 100) {
        await locator.pressSequentially(value, { delay: delay });
        await this.page.keyboard.press("Enter");
        await this.page.keyboard.press("Tab");
    }

    protected async typeAndSelectTheBelowValue(locator: Locator, value: string, delay = 100) {
        await locator.pressSequentially(value, { delay: delay });
        await this.page.keyboard.press("Enter");
    }

    protected async fillAndPressEnter(locator: Locator, value: string) {
        await locator.fill(value);
        await this.page.keyboard.press("Enter");
    }

    protected async clearTypeAndPressTab(locator: Locator, value: string, delay = 100) {
        await locator.clear();
        await locator.pressSequentially(value, { delay: delay });
        await this.page.keyboard.press("Tab");
    }
    protected async clearFillAndPressTabManually(locator: Locator, value: string) {
        await locator.click();
        await this.page.keyboard.press("Control+A");
        await this.page.keyboard.press("Backspace");
        await locator.pressSequentially(value);
        await this.page.keyboard.press("Tab");
    }

    protected async keyboardTypeAndPressTab(value: string) {
        await this.page.keyboard.type(value);
        await this.page.keyboard.press("Tab");
    }

    protected async typeClearFill(locator: Locator, value: string, delay = 100) {
        await locator.focus();
        await this.page.keyboard.press("Backspace");
        await locator.pressSequentially(value, { delay: delay });
        await this.page.keyboard.press("Tab");
    }

    protected async clearAndPressTab(locator: Locator) {
        await locator.fill("");
        await this.page.keyboard.press("Tab");
    }

    protected async acceptAlert(): Promise<void> {
        this.page.on("dialog", dialog => dialog.accept());
    }

    protected async uncheckIfChecked(locator: Locator): Promise<any> {
        const attribute = (await locator.locator("i").getAttribute("class"))?.trim() || "";
        if (attribute === "k2-checkbox-proxy k2-checkbox-proxy-checked") {
            await locator.click();
        } else {
            Logger.info(`The element is not checked`);
        }
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

    protected async uncheckAllButFirst(checkboxLocator: Locator): Promise<void> {
        const count = await checkboxLocator.count();
        for (let i = 1; i < count; i++) {
            if (await checkboxLocator.nth(i).isVisible()) {
                await checkboxLocator.nth(i).click({ delay: 500 });
            }
        }
    }
}
