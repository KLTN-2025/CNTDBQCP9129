import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from './config/db.js';

import authRouter from './router/auth.router.js';
import blogCategoryRouter from './router/blogCategory.router.js';
import blogRouter from './router/blog.router.js';
import productCategoryRouter from './router/productCategory.router.js';
import productRouter from './router/product.router.js';
import ingredientRouter from './router/ingredient.router.js';
import recipeRouter from './router/recipe.router.js';
import cartRouter from './router/cart.router.js';
import orderRouter from './router/order.router.js';
import userRouter from './router/user.router.js';
import voucherRouter from './router/voucher.router.js';
import contactRouter from './router/contact.router.js';
import paymentRouter from './router/payment.router.js';
dotenv.config();

const app = express();
const server = http.createServer(app); 

// ---- Setup Socket.IO ----
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware để inject io vào req
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(cors());

// ---- Router ----
app.use("/api/auth", authRouter);
app.use("/api/blog-categories", blogCategoryRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/product-categories", productCategoryRouter);
app.use("/api/products", productRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/vouchers", voucherRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/payment", paymentRouter);


// ---- Socket.IO logic ----
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Admin join room để nhận realtime đơn hàng
  socket.on("join_admin", () => {
    socket.join("admin_room");
    console.log("Admin joined room:", socket.id);
  });

  // User join room theo userId để nhận realtime VNPAY & trạng thái đơn hàng
  socket.on("join_user", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room:`, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ---- Start server ----
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
