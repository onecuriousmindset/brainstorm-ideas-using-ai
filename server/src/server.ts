import "dotenv/config.js";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import AIRoutes from "./routes/ai.routes";
import { setupSwagger } from './config/swagger'; // Path to swagger.ts

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
    })
);

// Routes
app.use("/api/v1/ai", AIRoutes);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.locals.error = err;
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Set up Swagger
setupSwagger(app);

app.listen(PORT, () => {
    console.log(
        `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
});

export default app;
