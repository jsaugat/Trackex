import { app } from "./app.js";
import connectDB from "./db/conn.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.js";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import categoryRoutes from "./routes/category.js";
import adminRoutes from "./routes/admin.js";
import topStatsRoutes from "./routes/topStats.js";

//? GLOBAL middleware
app.use("/", (req, res, next) => {
  console.log("Request Details :");
  console.table({
    time: new Date().toLocaleTimeString(),
    method: req.method,
    endpoint: req.url,
  });
  console.log("\x1b[32m%s\x1b[0m", "Request Body :");
  console.log("Type -", typeof req.body);
  console.log("Is Array -", Array.isArray(req.body))
  console.table(req.body);
  next();
});

//? ROUTES middlewares
app.use("/api", transactionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/revenue", topStatsRoutes)

//? 404 and error handler middlewares
app.use(notFoundHandler);
app.use(errorHandler);

//? MONGOOSE SETUP
const PORT = process.env.PORT || 8080;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`👁️  WATCHING PORT : http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Sorry!, Express couldn't talk to database`, error);
  });
