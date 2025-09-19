import express from "express";
import routerBooks from "./routes/books.js";
import routerAuthors from "./routes/authors.js";
import routerCategories from "./routes/categories.js";
import routerAuth from "./routes/auth.js";
import routerUsers from "./routes/users.js"
import routerReviews from "./routes/reviews.js";
import routerUserBooks from "./routes/user-books.js";
import routerCustomCollections from "./routes/custom-collections.js";
import routerUserProfile from "./routes/user-profile.js";
import swaggerSetup from "./swagger.js";
import cors from "cors";
import path from "path";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());
// app.use("/api/books", routerBooks);
// app.use("/api/authors", routerAuthors);
// app.use("/api/categories", routerCategories);
app.use("/api/auth", routerAuth);
// app.use("/api/users", routerUsers);
// app.use("/api/reviews", routerReviews);
// app.use("/api/userbooks", routerUserBooks);
// app.use("/api/customcollections", routerCustomCollections);
// app.use("/api/userprofile", routerUserProfile);

// Serve static files from the Vite build output
app.use(express.static("./dist"));

// Catch-all route to serve the index.html for SPA (must be after API routes)
app.get("/", (req, res) => {
    res.sendFile(path.join("./dist", "index.html"));
});

swaggerSetup(app); // เปิดใช้งาน Swagger UI

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;