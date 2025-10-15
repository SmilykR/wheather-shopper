import { Product, ProductSelectionCriteria } from "@/data/Types";
import { Locator, Page } from "@playwright/test";

export class ProductPage {
    protected page: Page;
    protected cartButton: Locator;
    protected productSection: Locator;
    protected nameSection: Locator;
    protected priceSection: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartButton = this.page.locator("#cart");
        this.productSection = this.page.locator(".text-center.col-4");
        this.nameSection = this.productSection.locator(".font-weight-bold");
        this.priceSection = this.productSection.locator("p").nth(1);
    }

    async open(path: string): Promise<void> {
        await this.page.goto(`${process.env["BASE_URL"]}${path}`);
    }

    async getAllProducts(): Promise<Product[]> {
        const productElements = await this.productSection.all();
        const products = await Promise.all(
            productElements.map(async productElement => {
                const nameElement = productElement.locator(".font-weight-bold");
                const priceElement = productElement.locator("p").nth(1);

                const [name, priceText] = await Promise.all([nameElement.textContent(), priceElement.textContent()]);

                const priceMatch = priceText?.match(/(\d+)/);
                const price = priceMatch ? parseInt(priceMatch[0], 10) : 0;

                return {
                    name: name?.trim() || "",
                    price,
                    element: productElement,
                };
            }),
        );

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

    async selectProductsByCriteria(productCriteria: ProductSelectionCriteria[]): Promise<void> {
        for (const criteria of productCriteria) {
            const product = await this.selectProductByCriteria(criteria);
            await this.addProductToCart(product.name);
        }
    }

    private async selectProductByCriteria(criteria: ProductSelectionCriteria): Promise<Product> {
        const allProducts = await this.getAllProducts();

        const matchingProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(criteria.productDescription.toLowerCase()),
        );

        const candidates = matchingProducts.length > 0 ? matchingProducts : allProducts;

        const selectedProduct = this.selectByPriceStrategy(candidates, criteria.productPrice);

        console.log(
            `Selected ${criteria.productPrice} priced product: ${selectedProduct.name} (Rs. ${selectedProduct.price})`,
        );
        return selectedProduct;
    }

    private selectByPriceStrategy(products: Product[], priceStrategy: string | number): Product {
        if (products.length === 0) return products[0]!;

        switch (priceStrategy) {
            case "min":
                return products.reduce((min, current) => (current.price < min.price ? current : min));

            case "max":
                return products.reduce((max, current) => (current.price > max.price ? current : max));

            default:
                if (typeof priceStrategy === "number") {
                    return products.reduce((closest, current) => {
                        const closestDiff = Math.abs(closest.price - priceStrategy);
                        const currentDiff = Math.abs(current.price - priceStrategy);
                        return currentDiff < closestDiff ? current : closest;
                    });
                }
                return products[0]!;
        }
    }
}
