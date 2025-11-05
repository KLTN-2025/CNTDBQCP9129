import express from 'express'
import dotenv from 'dotenv';
import cors from "cors";
import { connectDB } from './config/db.js';
import authRouter from './router/auth.router.js'
import blogCategoryRouter from './router/blogCategory.router.js';
import blogRouter from './router/blog.router.js'
import productCategoryRouter from './router/productCategory.router.js'
import productRouter from './router/product.router.js'
import ingredientRouter from './router/ingredient.router.js'
import recipeRouter from './router/recipe.router.js'
dotenv.config()
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/blog-categories", blogCategoryRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/product-categories", productCategoryRouter);
app.use("/api/products", productRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/recipes", recipeRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
