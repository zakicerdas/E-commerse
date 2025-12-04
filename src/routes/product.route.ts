import { Router } from "express";
import { 
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
 } from "../controllers/product.controller";

import { validate, createProductValidation } from "../middlewares/product.validation";

const router = Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", validate(createProductValidation), createProduct);
router.put("/products/:id", validate(createProductValidation), updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/search", searchProducts);

export default router;