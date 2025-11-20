import { APIRequestContext, APIRequest, expect } from "@playwright/test";
import { BaseAPI } from "../Base.api";

export class ExamplePageAPI extends BaseAPI {
    constructor(request: APIRequestContext, token: string) {
        super(request, token);
    }

    async addEntity(data: any): Promise<APIRequest> {
        console.log(`Creating "Entity" request body:`, data);
        const fullUrl = `${process.env["API_URL"]}/api/`;
        const response = await this.post(fullUrl);
        const responseBody = await response.text();
        console.log(`Creating "Entity" response body:`, responseBody);
        console.log("Response:", response);
        expect(response.status()).toBe(201);
        return response;
    }
}
