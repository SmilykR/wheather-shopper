/**
 * Simple Logger implementation for test automation
 * Provides info, warn, error, and debug logging capabilities
 */
export class Logger {
    private static formatMessage(level: string, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }

    static info(message: string): void {
        console.log(this.formatMessage("info", message));
    }

    static warn(message: string): void {
        console.warn(this.formatMessage("warn", message));
    }

    static error(message: string): void {
        console.error(this.formatMessage("error", message));
    }

    static debug(message: string): void {
        console.debug(this.formatMessage("debug", message));
    }
}

export default Logger;
