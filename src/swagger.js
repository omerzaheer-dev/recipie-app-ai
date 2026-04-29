
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
      description: "API documentation for Recipe App with support for extracting recipes from YouTube, TikTok, Instagram, and web URLs.",
    },
    servers: [
      {
        url: process.env.SWAGGER_URL || "http://localhost:5000",
        description: "Production Server",
      },
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],
    components: {
      schemas: {
        ApiError: {
          type: "object",
          properties: {
            statusCode: {
              type: "integer",
              example: 400,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        ApiSuccess: {
          type: "object",
          properties: {
            statusCode: {
              type: "integer",
              example: 200,
            },
            data: {
              type: "object",
            },
            message: {
              type: "string",
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "./routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;


