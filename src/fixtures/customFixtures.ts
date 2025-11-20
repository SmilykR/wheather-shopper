import { ExamplePageAPI } from "@/actions/api-actions/individualPageCalls/examplePageAPI";
import { ExamplePage } from "../pages/ExamplePage";
import { test as base } from "@playwright/test";

type Fixtures = {
    pages: {
        examplePage: ExamplePage;
    };

    requests: {
        examplePageAPI: ExamplePageAPI;
    };
};

export const test = base.extend<Fixtures>({
    pages: async ({ page }, use) => {
        const pages = {
            examplePage: new ExamplePage(page),
        };

        await use(pages);
    },

    requests: async ({ request }, use) => {
        // const tokenInfo = await fetchAccessToken(request, 'Acterys API');
        // const token = tokenInfo.access_token || 'ADUMMYTOKEN';
        const token = "ADUMMYTOKEN";
        const requests = {
            examplePageAPI: new ExamplePageAPI(request, token),
        };

        await use(requests);
    },
});
