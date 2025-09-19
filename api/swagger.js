  import swaggerJsdoc from "swagger-jsdoc";
  import swaggerUi from "swagger-ui-express";

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Books API",
        version: "1.0.0",
        description: "API สำหรับจัดการหนังสือ By AprilTwenry & Copilot AI",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
        security: [
          {
            bearerAuth: [],
          },
        ],
        servers: [
          { url: "http://localhost:4000", description: "Local server" }
        ],
      },

    apis: [
      "./swagger/*.yaml"
    ],
  };


  const swaggerSpec = swaggerJsdoc(options);

  export default (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  };