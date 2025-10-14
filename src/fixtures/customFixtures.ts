import { StartPage } from "@/pages/StartPage";
import { test as base } from "@playwright/test";

type Fixtures = {
    pages: {
        startPage: StartPage;
    };
};

export const test = base.extend<Fixtures>({
    pages: async ({ page }, use) => {
        const pages = {
            startPage: new StartPage(page),
        };

        await use(pages);
    },
});
