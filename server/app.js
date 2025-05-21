import express from "express";
import routerBooks from "./routes/books.js";
import routerAuthors from "./routes/authors.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//import { PrismaClient } from "./generated/prisma/index.js"

async function init() {
    const app = express();
    
    const PORT = 4000;
    //const prisma = new PrismaClient;

    app.use(express.json());
    app.use("/books", routerBooks);
    app.use("/authors", routerAuthors);


    app.listen(PORT, () => {
        console.log("server is running on port " + PORT);
    });
}

init();
export default prisma;