import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Books API",
      version: "1.0.0",
      description: "API สำหรับจัดการหนังสือ By AprilTwenry",
    },
  },
  apis: ["./routes/books.js"], // ระบุไฟล์ที่มี JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

export default (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};