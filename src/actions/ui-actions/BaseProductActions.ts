import { Page, expect } from "@playwright/test";
import { ProductPage } from "../../pages/ProductPage";
import { Product, ProductSelectionCriteria } from "@/data/Types";

export class BaseProductActions {
    protected productPage: ProductPage;

    constructor(page: Page) {
        this.productPage = new ProductPage(page);
    }

    async selectProductsByCriteria(productCriteria: ProductSelectionCriteria[]): Promise<Product[]> {
        const selectedProducts: Product[] = [];

        for (const criteria of productCriteria) {
            const product = await this.selectProductByCriteria(criteria);
            await this.productPage.addProductToCart(product.name);
            selectedProducts.push(product);
            console.log(
                `Added: ${product.name} (Rs. ${product.price}) - Criteria: ${criteria.productDescription}, Price: ${criteria.productPrice}`,
            );
        }

        return selectedProducts;
    }

    private async selectProductByCriteria(criteria: ProductSelectionCriteria): Promise<Product> {
        const allProducts = await this.productPage.getAllProducts();

        const matchingProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(criteria.productDescription.toLowerCase()),
        );

        expect(
            matchingProducts.length,
            `No products found matching description: ${criteria.productDescription}`,
        ).toBeGreaterThan(0);

        let selectedProduct: Product;

        if (criteria.productPrice === "min") {
            selectedProduct = matchingProducts.reduce((prev, current) => (prev.price < current.price ? prev : current));
        } else if (criteria.productPrice === "max") {
            selectedProduct = matchingProducts.reduce((prev, current) => (prev.price > current.price ? prev : current));
        } else if (typeof criteria.productPrice === "number") {
            const targetPrice = criteria.productPrice as number;
            selectedProduct = matchingProducts.reduce((prev, current) => {
                const prevDiff = Math.abs(prev.price - targetPrice);
                const currentDiff = Math.abs(current.price - targetPrice);
                return currentDiff < prevDiff ? current : prev;
            });
        } else {
            expect(false, `Invalid price criteria: ${criteria.productPrice}`).toBe(true);
            throw new Error(`Invalid price criteria: ${criteria.productPrice}`);
        }

        console.log(
            `Selected ${criteria.productPrice} priced product: ${selectedProduct.name} (Rs. ${selectedProduct.price})`,
        );
        return selectedProduct;
    }

    async goToCart(): Promise<void> {
        await this.productPage.goToCart();
    }
}
