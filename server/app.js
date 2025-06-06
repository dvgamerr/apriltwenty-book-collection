import express from "express";
import routerBooks from "./routes/books.js";
import routerAuthors from "./routes/authors.js";
import { PrismaClient } from "@prisma/client";
import routerCategories from "./routes/categories.js";
import routerAuth from "./routes/auth.js";
import routerUsers from "./routes/users.js"
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


    app.listen(PORT, () => {
        console.log("server is running on port " + PORT);
    });
}

init();
export default prisma;