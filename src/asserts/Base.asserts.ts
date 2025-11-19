import { Locator, Page, expect } from "@playwright/test";
import * as fs from "fs";

export class BaseAsserts {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async assertValueIsEqual(actualValue: any, expectedValue: any, message?: string): Promise<void> {
        expect(actualValue, message).toBe(expectedValue);
    }

    async assertElementIsVisible(
        element: Locator,
        message = "Assert element is visible",
        timeout: number = 10_000,
    ): Promise<void> {
        await expect(element, message).toBeVisible({ timeout });
    }

    async assertElementIsNotVisible(element: Locator, message = "Assert element is not visible"): Promise<void> {
        await expect(element, message).not.toBeVisible();
    }

    async assertElementHasInputValue(
        element: Locator,
        value: string,
        message = `Assert element has value`,
    ): Promise<void> {
        await expect(element, message).toHaveValue(value);
    }

    async assertElementHasNotNullValue(
        element: Locator,
        message = `Assert element is not empty`,
        timeout?: number,
    ): Promise<void> {
        if (timeout) {
            await expect(async () => {
                let value = await element.inputValue();
                expect(value, message).not.toEqual("");
            }).toPass({
                intervals: [500],
                timeout: timeout,
            });
        } else {
            let value = await element.inputValue();
            expect(value, message).not.toEqual("");
        }
    }

    async assertElementHasNotNullText(
        element: Locator,
        message = `Assert element is not empty`,
        timeout?: number,
    ): Promise<void> {
        if (timeout) {
            await expect(async () => {
                let value = await element.innerText();
                expect(value, message).not.toEqual("");
            }).toPass({
                intervals: [500],
                timeout: timeout,
            });
        } else {
            let value = await element.innerText();
            expect(value, message).not.toEqual("");
        }
    }

    async assertElementHasAttribute(
        element: Locator,
        attribute: string,
        value: string,
        message = `Assert element has attribute with value`,
    ): Promise<void> {
        await expect(element, message).toHaveAttribute(attribute, value);
    }

    async assertElementHasClass(
        element: Locator,
        className: string | RegExp,
        message = `Assert element has ${className} class`,
    ): Promise<void> {
        await expect(element, message).toHaveClass(className);
    }

    async assertElementDoesNotHaveClass(
        element: Locator,
        className: string | RegExp,
        message = `Assert element does not have ${className} class`,
    ): Promise<void> {
        await expect(element, message).not.toHaveClass(className);
    }

    async assertInputCheckIsChecked(element: Locator, message = `Assert input check is checked`): Promise<void> {
        await expect(element.locator("svg"), message).toBeVisible();
    }

    async assertInputCheckIsNotChecked(element: Locator, message = `Assert input check is not checked`): Promise<void> {
        await expect(element.locator("svg"), message).not.toBeVisible();
    }

    async assertElementHasText(
        element: Locator,
        text: string,
        message = `Assert element has text`,
        timeout?: number,
    ): Promise<void> {
        await expect(element, message).toHaveText(text, timeout ? { timeout } : {});
    }

    async assertElementMatchesRegex(
        element: Locator,
        template: RegExp,
        message = `Assert element matches template`,
    ): Promise<void> {
        const summaryHeader = await element.textContent();
        expect(summaryHeader, message).toMatch(template);
    }

    async assertElementContainsText(
        element: Locator,
        text: string,
        message = `Assert element contains text`,
    ): Promise<void> {
        await expect(element, message).toContainText(text);
    }

    async cassertCountItems(elements: Locator, quantity: number, message = `Assert count of elements`): Promise<void> {
        await expect(elements, message).toHaveCount(quantity);
    }

    async assertElementsHaveEqualValues(actualValue: string, expectedValue: string, softAssert = false): Promise<void> {
        const message = `Expected '${expectedValue}' should be EQUAL to Actual '${actualValue}'`;

        if (softAssert) {
            expect.soft(actualValue, message).toEqual(expectedValue);
        } else {
            expect(actualValue, message).toEqual(expectedValue);
        }
    }

    async assertElementsHaveGreaterOrEqualValues(
        actualValue: string,
        expectedValue: string,
        softAssert = false,
    ): Promise<void> {
        const firstValue = parseFloat(actualValue.replace(/\,/gi, ""));
        const secondValue = parseFloat(expectedValue.replace(/\,/gi, ""));
        const message = `Expected '${expectedValue}' should be GREATER or EQUALS to Actual '${actualValue}'`;

        if (softAssert) {
            expect.soft(firstValue, message).toBeGreaterThanOrEqual(secondValue);
        } else {
            expect(firstValue, message).toBeGreaterThanOrEqual(secondValue);
        }
    }

    async assertElementsHaveNotEqualValues(
        actualValue: string,
        unExpectedValue: string,
        softAssert = false,
    ): Promise<void> {
        const message = `Expected '${unExpectedValue}' should be not be EQUAL to Actual '${actualValue}'`;

        if (softAssert) {
            expect.soft(actualValue, message).not.toBe(unExpectedValue);
        } else {
            expect(actualValue, message).not.toBe(unExpectedValue);
        }
    }

    async assertValueIsGreaterOrEquals(locator: Locator, value2: number, softAssert = false): Promise<void> {
        const value = await locator.inputValue();
        const valueParsed = parseFloat(value.replace(/,/g, ""));
        const message = `'${valueParsed}' is expected to be greater or equal to '${value2}'`;

        if (softAssert) {
            expect.soft(valueParsed, message).toBeGreaterThanOrEqual(value2);
        } else {
            expect(valueParsed, message).toBeGreaterThanOrEqual(value2);
        }
    }

    async assertFileIsDownloadable(downloadElement: Locator) {
        const [download] = await Promise.all([this.page.waitForEvent("download"), downloadElement.click()]);
        const suggestedFileName = download.suggestedFilename();
        const filePath = "test-results/downloads/" + suggestedFileName;
        await download.saveAs(filePath);
        expect(fs.existsSync(filePath)).toBeTruthy();
        return suggestedFileName;
    }

    async assertArraysAreEqual(arrayLocator: Locator, expectedArray: string[] | number[]): Promise<void> {
        let actualArrayValues: any[] = [];
        if (expectedArray.every(value => typeof value === "number")) {
            actualArrayValues = (
                await arrayLocator.evaluateAll((elements: any) =>
                    elements.map((element: any) => parseFloat(element.value.replace(/,/g, ""))),
                )
            ).sort();
        } else {
            actualArrayValues = (
                await arrayLocator.evaluateAll((elements: any) => elements.map((element: any) => element.value))
            ).sort();
        }
        expect(actualArrayValues, `Assert arrays are equal: \n${actualArrayValues}\n${expectedArray}`).toEqual(
            expectedArray.sort(),
        );
    }

    async assertArrayValuesAreEqual(locator: Locator, expectedValue: string): Promise<void> {
        const actualArray = await locator.allInnerTexts();
        for (let value of actualArray) {
            expect(value, `Assert Actual value: ${value} is equal to Expected value: ${expectedValue}`).toBe(
                expectedValue,
            );
        }
    }

    async assertArrayTextContentsAreEqual(locator: Locator, expectedArray: string[] | number[]) {
        let actualArrayValues: any[] = [];
        if (expectedArray.every(value => typeof value === "number")) {
            actualArrayValues = (await locator.allTextContents())
                .map(text => parseFloat(text.replace(/,/g, "")))
                .sort();
        } else {
            actualArrayValues = (await locator.allTextContents()).sort();
        }
        expect(actualArrayValues, `Assert arrays are equal: \n${actualArrayValues}\n${expectedArray}`).toEqual(
            expectedArray.sort(),
        );
    }

    async assertArrayElementsAreNotNull(locator: Locator) {
        (await locator.allTextContents()).map(text => expect(text, `Asserted actual value ${text}`).toBeTruthy());
    }

    async assertBooleanCondition(
        condition: boolean,
        message: string = "Assert boolean condition is true",
    ): Promise<void> {
        expect(condition, message).toBe(true);
    }
}
