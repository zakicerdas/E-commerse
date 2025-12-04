export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
}

export const PRODUCTS_CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports'];

export let products: Product[] = [
  { id: 1, name: 'Laptop', price: 1500, description: 'A high-performance laptop', category: 'Electronics' },
  { id: 2, name: 'Smartphone', price: 800, description: 'A latest model smartphone', category: 'Electronics' },
  { id: 3, name: 'Novel Book', price: 20, description: 'A best-selling novel', category: 'Books' },
];