import { APIRequestContext } from "@playwright/test";

export class BaseAPI {
    protected request: APIRequestContext;
    token: any;
    private headers: any;

    constructor(request: APIRequestContext, token?: string) {
        this.request = request;
        this.token = token;

        this.headers = {
            accept: "*/*",
            "content-type": "application/json",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            Authorization: `Bearer ${this.token}`,
        };
    }

    async post(url: string, data?: any, form?: any): Promise<any> {
        const response = await this.request.post(url, {
            data: data,
            headers: this.headers,
            form: form,
        });
        return response;
    }

    async put(url: string, data?: any, form?: any): Promise<any> {
        const response = await this.request.put(url, {
            data: data,
            headers: this.headers,
            form: form,
        });
        return response;
    }

    async get(url: string, data?: any, form?: any): Promise<any> {
        console.log("API GET request URL:", url);
        const response = await this.request.get(url, {
            data: data,
            headers: this.headers,
            form: form,
        });
        return response;
    }

    async delete(url: string, data?: any): Promise<any> {
        const response = await this.request.delete(url, {
            headers: this.headers,
            data: data,
        });
        return response;
    }
}
