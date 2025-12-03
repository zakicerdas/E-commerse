import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

interface costumRequest extends Request {
  startTime?: number;
}

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use((req: costumRequest, res: Response, next: NextFunction) => {
     console.log(`Request masuk: ${req.method} ${req.path}`);
  req.startTime = Date.now();
  next();
});

app.use((req: costumRequest, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
   if (!apiKey){
    return res.status(401).json({ success: false, message: 'API key missing' });
   }
    if (apiKey !== '12345'){
    return res.status(403).json({ success: false, message: 'Invalid API key' });
   }
    next();
});

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

const PRODUCTS_CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports'];

let products = [
  { id: 1, name: 'Laptop', price: 1500, description: 'A high-performance laptop', category: 'Electronics' },
  { id: 2, name: 'Smartphone', price: 800, description: 'A latest model smartphone', category: 'Electronics' },
  { id: 3, name: 'Novel Book', price: 20, description: 'A best-selling novel', category: 'Books' },
];

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  errors?: Array<{
    field: string;
    message: string;
  }> | { stack?: string };
}

const successResponse = (
  res: Response,
  message: string,
  data: unknown = null,
  pagination: { page: number; limit: number; total: number } | null = null,
  statusCode: number = 200
) => {
  const response: ApiResponse = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (pagination) response.pagination = pagination;

  return res.status(statusCode).json(response);
};

const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: Array<{ field: string; message: string }> | { stack?: string } | null = null
) => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg
    }));

    return errorResponse(res, 'Validasi gagal', 400, errorList);
  };
};

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama produk wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Deskripsi wajib diisi'),
  
  body('price')
    .isNumeric().withMessage('Harga harus angka')
    .custom(value => value > 0).withMessage('Harga harus lebih dari 0')
];

const getProductByIdValidation = [
  param('id')
    .isNumeric().withMessage('ID harus angka')
];


app.get('/', ( req: costumRequest, res: Response) => {
const responseTime = Date.now() - (req.startTime || Date.now());
successResponse(res, `Welcome to the E-commerce API`, {
    hari: 3,
    status: 'success',
    responseTime: `${responseTime}ms`,
    note: 'Gunakan header X-API-Key: 12345 untuk mengakses API',
    available_categories: PRODUCTS_CATEGORIES
  }, null, 200);
});

app.get('/api/products', (req: Request, res: Response) => {
  successResponse(res, 'Products list', products);
});

app.get('/api/products/:id',validate(getProductByIdValidation), (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        throw new Error('Product not found');
    }
    successResponse(res, 'Product founded', product);
});

app.get('/api/search', (req: Request, res: Response) => {
   const {name, max_price, category} = req.query;

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
    if (category) {
    filteredProducts = filteredProducts.filter(p => 
        p.category?.toLowerCase() === (category as string).toLowerCase()
    );
   }
    successResponse(res, 'Search results', filteredProducts);
});

app.get('/api/categories/:category', (req: Request, res: Response) => {
  const categoryParam = (req.params.category || '').toLowerCase();

  const available = PRODUCTS_CATEGORIES.map(c => c.toLowerCase());
  if (!available.includes(categoryParam)) {
    return errorResponse(res, `Invalid category. Available categories: ${PRODUCTS_CATEGORIES.join(', ')}`, 400);
  }

  const categoryProducts = products.filter(p =>
    (p.category || '').toLowerCase() === categoryParam
  );

  if (categoryProducts.length === 0) {
    return errorResponse(res, `No products found in category: ${req.params.category}`, 404);
  }

  successResponse(res, `Products in category: ${req.params.category}`, categoryProducts);
});


app.post('/api/products',validate(createProductValidation), (req: Request, res: Response) => {
    const { name, price, description, category } = req.body;

    const newProduct = {
        id: products.length + 1,
        name,
        description,
        category,
        price: Number(price),
    };

    products.push(newProduct);
    successResponse(res, 'Product created successfully', newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
        return errorResponse(res, 'Product not found', 404);
    }
    if (req.body.category && !PRODUCTS_CATEGORIES.includes(req.body.category)) {
        return errorResponse(res, `Invalid category. Available categories: ${PRODUCTS_CATEGORIES.join(', ')}`, 400);
    }

    products[index] = {...products[index], ...req.body };

    successResponse(res, 'Product updated successfully', products[index]);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
        return errorResponse(res, 'Product not found', 404);
    }

    const deletedProduct = products.splice(index, 1);

    successResponse(res, 'Product deleted successfully', deletedProduct[0]);
});

const asyncErrorHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

app.use( (req: Request, res: Response) => {
  throw new Error(`Route ${req.originalUrl} not found`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('ERROR:', err.message);

  let statusCode = 500;
  if (err.message.includes('not found') || err.message.includes('Route')) {
    statusCode = 404;
  } else if (err.message.includes('Validasi')) {
    statusCode = 400;
  } else {
    statusCode = 400;
  }

  errorResponse(
    res, 
    err.message || 'Internal server error', 
    statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Untuk akses API, gunakan header: X-API-Key: 12345`);
});