


import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

// fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recipe App API",
      version: "1.0.0",
      description: "API documentation for Recipe App",
    },
    servers: [
      {
        url: "https://recipie-app-xue2.vercel.app",
        description: "Real Url",
      },
      {
        url: "https://untradeable-molly-metatrophic.ngrok-free.dev",
        description: "Ngrok Server",
      },
      {
        url: "http://localhost:5000",
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;


