import express from "express";

async function init() {
    const app = express();
    const PORT = 4000;

    app.use(express.json());

    app.listen(PORT, () => {
        console.log("server is running on port " + PORT);
    });
}

init();