import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { Application } from "express";

export function setupSwagger(app: Application): void {
    const PORT = process.env.PORT || 3001;
    const swaggerDocument = YAML.load("./swagger.yaml"); // Path to your generated file
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
}
