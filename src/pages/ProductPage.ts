import { Product } from "@/data/Types";
import { Locator, Page } from "@playwright/test";

export class ProductPage {
    protected page: Page;
    protected cartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartButton = this.page.locator("#cart");
    }

    async open(path: string): Promise<void> {
        await this.page.goto(`${process.env["BASE_URL"]}${path}`);
    }

    async getAllProducts(): Promise<Product[]> {
        const productElements = this.page.locator(".text-center.col-4");
        const count = await productElements.count();

        const products: Product[] = [];

        for (let i = 0; i < count; i++) {
            const productElement = productElements.nth(i);
            const nameElement = productElement.locator(".font-weight-bold");
            const priceElement = productElement.locator("p").nth(1);

            const name = await nameElement.textContent();
            const priceText = await priceElement.textContent();

            const priceMatch = priceText!.match(/(\d+)/);
            const price = parseInt(priceMatch![0], 10);

            products.push({
                name: name!.trim(),
                price,
                element: productElement,
            });
        }

        return products;
    }

    async addProductToCart(productName: string): Promise<void> {
        const products = await this.getAllProducts();
        const product = products.find(p => p.name.includes(productName));
        const addButton = product!.element.locator("button.btn-primary");
        await addButton.click();
        console.log(`Added "${product!.name}" (Rs. ${product!.price}) to cart`);
    }

    async goToCart(): Promise<void> {
        await this.cartButton.click();
        await this.page.waitForLoadState("networkidle");
    }
}
