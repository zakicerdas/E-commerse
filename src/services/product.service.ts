import { Product, products } from "../models/product.model";

export class ProductService {
    static getAllProducts(): Product[] {
        return products;
    }
    static getProductById(id: number): Product | undefined {
        const product = products.find(p => p.id === id);
        if (!product) throw new Error('Product not found');
        return product;
        
    }

    static createProduct (data: {name: string; description: string; price: number; category: string; }): Product {
        const newProduct: Product = {
            id: products.length + 1,
            ...data
        };
        products.push(newProduct);
        return newProduct;
    }

    static updateProduct(id: number, data: Partial<Product>): Product {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Product not found');
        }
        products[index] = { ...products[index], ...data };
        return products[index];
    }

    static deleteProduct(id: number): void {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Product not found');
        }
        products.splice(index, 1);
    }

static searchProducts(name?: string, maxPrice?: number, category?: string): Product[] {
    let filteredProducts = products;

    if (name) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    if (maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => 
            p.price <= maxPrice 
        );
    }
    if (category) {
        filteredProducts = filteredProducts.filter(p => 
            p.category?.toLowerCase() === category.toLowerCase()
        );
    }
    return filteredProducts;
}
}