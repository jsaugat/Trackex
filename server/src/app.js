import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://trackex-client.vercel.app', process.env.BASE_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
// requests come from different sources like url, json, body/ form
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // public directory in your project will be used to serve static files like pdf, images, html, css and other assets
app.use(cookieParser()); // set access and CRUD operate on user cookies

export { app };
