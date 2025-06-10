import swaggerJsdoc from'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import express from "express";
import { PrismaClient } from "@prisma/client";
import routerBooks from "./routes/books.js";
import routerAuthors from "./routes/authors.js";
import routerCategories from "./routes/categories.js";
import routerAuth from "./routes/auth.js";
import routerUsers from "./routes/users.js"
import routerReviews from "./routes/reviews.js";
import routerUserBooks from "./routes/user-books.js";
import routerCustomCollections from "./routes/custom-collections.js";
import routerUserProfile from "./routes/user-profile.js";
const prisma = new PrismaClient();

async function init() {
    const app = express();
    const PORT = 4000;

    app.use(express.json());
    app.use("/books", routerBooks);
    app.use("/authors", routerAuthors);
    app.use("/categories", routerCategories);
    app.use("/auth", routerAuth);
    app.use("/users", routerUsers);
    app.use("/reviews", routerReviews);
    app.use("/userbooks", routerUserBooks);
    app.use("/customcollections", routerCustomCollections);
    app.use("/userprofile", routerUserProfile);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Book API",
      version: "1.0.0",
      description: "API สำหรับจัดการหนังสือของผู้ใช้"
    }
  },
  apis: ["./routes/*.js"] // หรือกำหนด path ไฟล์ที่มี JSDoc
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


    app.listen(PORT, () => {
        console.log("server is running on port " + PORT);
    });
}

init();
export default prisma;