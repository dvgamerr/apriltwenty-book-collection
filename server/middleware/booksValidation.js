export const postBookValidation = (req, res, next) => {
    const { title, description, isbn, publisher, published_year, cover_url, author_ids, category_ids } = req.body;

    if (!title) {
        return res.status(400).json({
            "success": false,
            "message": "Missing required fields: title"
        });
    }
    if (published_year && isNaN(Number(published_year))) {
        return res.status(400).json({
            "success": false,
            "message": "published_year must be a valid number"
        });
    }
    if (cover_url && !/^https?:\/\/.+\..+/.test(cover_url)) {
        return res.status(400).json({
            "success": false,
            "message": "cover_url must be a valid URL"
        });
    }
    if (author_ids && !Array.isArray(author_ids)) {
        return res.status(400).json({
            "success": false,
            "message": "author_ids must be array"
        });
    }
    if (category_ids && !Array.isArray(category_ids)) {
        return res.status(400).json({
            "success": false,
            "message": "category_ids must be array"
        });
    }
    next();
}