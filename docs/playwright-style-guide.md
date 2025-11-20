# Playwright Test Automation Style Guide

## MCP Server Instructions
**When generating Playwright code, follow these exact patterns from this project.**

## Required Architecture Patterns

### Page Object Model Structure
```typescript
// ALWAYS extend BasePage
export class PageName extends BasePage {
    private elementName: Locator;
    
    constructor(page: Page) {
        super(page);  // REQUIRED
        this.elementName = this.page.locator("selector");
    }
    
    async open(): Promise<void> {
        await this.page.goto(`${process.env["BASE_URL"]}/path`);
        await this.page.waitForLoadState("domcontentloaded");
    }
}
```

### Assertion Classes Structure
```typescript
// ALWAYS extend BaseAsserts
export class PageAssertions extends BaseAsserts {
    private readonly pageName: PageClass;

    constructor(pageName: PageClass) {
        super(pageName.getPage());  // REQUIRED
        this.pageName = pageName;
    }

    async assertElementIsVisible(): Promise<void> {
        await expect(this.pageName.element).toBeVisible();
    }
}
```

### Test Structure (MANDATORY)
```typescript
import { test } from "../fixtures/customFixtures";

test.describe("Feature Tests", () => {
    test.beforeEach(async ({ pages, requests }) => {
        await pages.examplePage.open();
    });

    test("Test Name", { tag: ["@reg"] }, async ({ pages }) => {
        await test.step("Step description", async () => {
            // Test implementation
        });
    });
});
```

## Mandatory Syntax Rules

### Environment Variables
- ✅ CORRECT: `process.env["BASE_URL"]`
- ❌ WRONG: `process.env.BASE_URL`

### Imports (REQUIRED)
```typescript
import { Locator, Page } from "@playwright/test";
import { BasePage } from "@/pages/BasePage";
import { BaseAsserts } from "@/asserts/Base.asserts";
```

### Visibility Modifiers (STRICT)
- Page property: `protected readonly page: Page`
- Elements: `private elementName: Locator`
- Public methods: `async methodName(): Promise<void>`
- Protected utilities: `protected async utilityMethod(): Promise<void>`

### Playwright API Requirements
- Locators: `this.page.locator()` ONLY
- Waits: `waitForLoadState("domcontentloaded")`
- Assertions: `expect(element).toBeVisible()` from @playwright/test
- Frame handling: `this.page.frameLocator()`
- NO jQuery syntax allowed

### Async/Await Patterns (MANDATORY)
- All page methods: `async methodName(): Promise<void>`
- All assertions: `async assertName(): Promise<void>`
- Always use `await` for page interactions

## Project-Specific Patterns

### Custom Fixtures Usage
```typescript
// Use custom fixtures - NOT default Playwright fixtures
async ({ pages, requests }) => {
    // pages.pageName is available
    // requests.apiName is available
}
```

### Logging Pattern
```typescript
import Logger from "@logger/Logger";
Logger.info("Message");
```

### Error Handling
- Use Playwright's built-in expect() assertions
- Use soft assertions: `expect.soft()`
- NO manual throw statements

### File Organization
- Pages: `src/pages/`
- Assertions: `src/asserts/`
- Tests: `src/tests/`
- Use `@/` path mapping for imports

## Code Generation Rules for MCP

1. **ALWAYS** reference existing code patterns in this project
2. **NEVER** use jQuery or non-Playwright selectors
3. **ALWAYS** extend BasePage for page objects
4. **ALWAYS** extend BaseAsserts for assertion classes
5. **ALWAYS** use custom fixtures pattern
6. **ALWAYS** use bracket notation for environment variables
7. **ALWAYS** include proper TypeScript typing
8. **ALWAYS** use async/await consistently

## Example Integration
When the assertion class is integrated into a page object:
```typescript
export class CheckoutPage extends BasePage {
    public assert: CheckoutPageAssertions;
    
    constructor(page: Page) {
        super(page);
        this.assert = new CheckoutPageAssertions(this);
    }
    
    public getPage(): Page {
        return this.page;  // Required for assertion inheritance
    }
}
```

**Follow these patterns exactly. No deviations allowed.**