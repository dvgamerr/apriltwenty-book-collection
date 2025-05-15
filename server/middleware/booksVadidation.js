import { next } from "express";
export const postBookValidation = (req, res, next) => {
    const { title, description, isbn, publisher, published_year, cover_url, author_ids, category_ids } = req.body;

    if (!title) {
        return res.status(400).json({
            "success": false,
            "message": "Missing required fields: title"
        })
    }
    next();
}