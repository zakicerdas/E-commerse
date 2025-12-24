import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import productRoutes from './routes/product.route';
import { errorHandler } from './middlewares/error.handler';
import categoryRoutes from './routes/category.route';
import storeRoutes from './routes/store.route';
import transactionRoutes from './routes/transaction.route'; 
import authenticateRoutes from './routes/auth.route'
import userRoutes from './routes/user.route'
import profileRoutes from './routes/profile.route';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger'; 

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/', (_req, res) => {
  res.redirect('/api-docs');
});

app.get('/', (_req, res) => {
  res.json({ message: 'Halo! Hari 5 – MVC E-Commerce + Service' });
});


app.use('/api/v1', userRoutes)
app.use('/api/v1', productRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', storeRoutes);
app.use('/api/v1', transactionRoutes);
app.use('/api/v1', authenticateRoutes);
app.use('/api/v1', profileRoutes);

// Error handler harus di paling bawah!
// Middleware error handling dengan 4 parameter (`err, req, res, next`) harus selalu 
// diletakkan PALING AKHIR di antara semua middleware dan route lainnya. 
// Ini memastikan bahwa semua error dari route atau middleware sebelumnya 
// dapat ditangkap dan diproses secara terpusat.
app.use(errorHandler);

export default app;