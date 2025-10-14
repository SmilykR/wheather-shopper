import { PlaywrightTestConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const minutesToMs = (minutes: number): number => minutes * 60 * 1000;

const getEnvNumber = (envVar: string, defaultValue: number): number => {
    return parseInt(process.env[envVar] || defaultValue.toString(), 10);
};

const config: PlaywrightTestConfig = {
    use: {
        browserName: "chromium",
        headless: true,
        trace: "retain-on-failure",
        launchOptions: {
            args: ["--start-maximized"],
            headless: true,
            timeout: minutesToMs(getEnvNumber("BROWSER_LAUNCH_TIMEOUT", 2)),
            slowMo: 100,
            downloadsPath: "./test-results/downloads",
        },
        viewport: { height: 937, width: 1920 },
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        actionTimeout: minutesToMs(getEnvNumber("ACTION_TIMEOUT", 2)),
        navigationTimeout: minutesToMs(getEnvNumber("NAVIGATION_TIMEOUT", 5)),
        screenshot: "only-on-failure",
        video: {
            mode: "retain-on-failure",
            size: { height: 937, width: 1920 },
        },
    },
    testDir: "./src/tests",
    outputDir: "./test-results/",
    retries: getEnvNumber("RETRIES", 0),
    preserveOutput: "failures-only",
    reportSlowTests: null,
    timeout: minutesToMs(getEnvNumber("TEST_TIMEOUT", 50)),
    workers: getEnvNumber("PARALLEL_THREAD", 1),
    reporter: [["html", { outputFolder: "./test-results/html", open: "never" }], ["dot"], ["list"]],
};
export default config;
