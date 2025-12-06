export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    stock?: number;
}

export const PRODUCTS_CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports'];

export let products: Product[] = [
  { id: 1, name: 'Laptop', price: 1500, description: 'A high-performance laptop', category: 'Electronics', stock: 10 },
  { id: 2, name: 'Smartphone', price: 800, description: 'A latest model smartphone', category: 'Electronics', stock: 25 },
  { id: 3, name: 'Novel Book', price: 20, description: 'A best-selling novel', category: 'Books', stock:12 },
  { id: 4, name: 'T-Shirt', price: 15, description: 'A comfortable cotton t-shirt', category: 'Clothing', stock: 50 },
  { id: 5, name: 'Blender', price: 100, description: 'A kitchen blender', category: 'Home', stock: 8 },
  { id: 6, name: 'Football', price: 30, description: 'A professional football', category: 'Sports', stock: 20 }
];