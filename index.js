import express from "express";
import { PrismaClient } from "@prisma/client";
import routerBooks from "./server/routes/books.js";
import routerAuthors from "./server/routes/authors.js";
import routerCategories from "./server/routes/categories.js";
import routerAuth from "./server/routes/auth.js";
import routerUsers from "./server/routes/users.js"
import routerReviews from "./server/routes/reviews.js";
import routerUserBooks from "./server/routes/user-books.js";
import routerCustomCollections from "./server/routes/custom-collections.js";
import routerUserProfile from "./server/routes/user-profile.js";
import swaggerSetup from "./server/swagger.js";
import cors from "cors";

let prisma;
if (global.prisma) {
  prisma = global.prisma;
} else {
  prisma = new PrismaClient();
  global.prisma = prisma;
}

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());
app.use("/books", routerBooks);
app.use("/authors", routerAuthors);
app.use("/categories", routerCategories);
app.use("/auth", routerAuth);
app.use("/users", routerUsers);
app.use("/reviews", routerReviews);
app.use("/userbooks", routerUserBooks);
app.use("/customcollections", routerCustomCollections);
app.use("/userprofile", routerUserProfile);

swaggerSetup(app); // เปิดใช้งาน Swagger UI


/* ปิดเพื่อ deploy ขึ้น vercel ไม่สามารถใช้ listen ได้
app.listen(PORT, () => {
    console.log("server is running on port " + PORT);
});
*/

if (import.meta.url === `file://${process.argv[1]}`) {
    app.listen(4000, () => {
        console.log('server is running on port 4000')
    })
}

export default app;