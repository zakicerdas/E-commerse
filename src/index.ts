import express, { Request, Response } from 'express';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

let products = [
  { id: 1, name: 'Laptop', price: 8000000 },
  { id: 2, name: 'Smartphone', price: 2000000 },
    { id: 3, name: 'Headphones', price: 500000 },
];

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the E-commerce API',
    hari: 3,
    status: 'success' 
  });

});

app.get('/api/products', (req: Request, res: Response) => {
  res.json({
    success: true,
    jumlah: products.length,
    data: products
  });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
});

app.get('/api/search', (req: Request, res: Response) => {
   const {name, max_price} = req.query;

   let filteredProducts = products;

   if (name) {
    filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes((name as string).toLowerCase())
    );
   }
    if (max_price) {
    filteredProducts = filteredProducts.filter(p => 
        p.price <= Number(max_price)
    );
   }
    res.json({ success: true, data: filteredProducts });
});

app.post('/api/products', (req: Request, res: Response) => {
    const { name, price } = req.body;

    const newProduct = {
        id: products.length + 1,
        name,
        price: Number(price)
    };

    products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    products[index] = {...products[index], ...req.body };

    res.json({ success: true, data: products[index], message: 'Product updated successfully' });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const deletedProduct = products.splice(index, 1);

    res.json({ success: true, data: deletedProduct[0], message: 'Product deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
