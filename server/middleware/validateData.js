
//----------------------------- Data for every table--------------
export function validateId(paramName) {
    return (req, res, next) => {
        const idFromClient = req.params[paramName];
        const idInt = parseInt(idFromClient, 10)
        if (isNaN(idInt) || idInt <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "รูปแบบข้อมูล " + paramName + " ไม่ถูกต้อง"
            });
        }
        req.params[paramName] = idInt;
        next();
    }
}

export const validateQuery = (req, res, next) => {
    const { page, limit} = req.query;
    if (page === undefined && limit === undefined) {
        return next();
    }
    if (page !== undefined) {
        const pageInt = parseInt(page, 10);
        if (isNaN(pageInt) || pageInt <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "รูปแบบข้อมูล page ไม่ถูกต้อง"
            });
        }
        req.query.page = pageInt;
    }
    if (limit !== undefined) {
        const limitInt = parseInt(limit, 10);
        if (isNaN(limitInt) || limitInt <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "รูปแบบข้อมูล limite ไม่ถูกต้อง"
            });
        }
        req.query.limit = limitInt;
    }
    next();
}

//-------------------------------- books validation -----------------------------------
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
//------------------------------authors table--------------------------
export const postAuthorValidation = (req, res, next) => {
    const { name, bio } = req.body;
    if (!name) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูลที่ต้องระบุ มีไม่ครบ"
        });
    }
    if (name.length <= 3 || name.length >= 30 || typeof name !== 'string') {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูลไม่ถูกต้อง"
        });
    }
    next();
}
//----------------------------------category table--------------------
export const postCategoryValidation = (req, res, next) => {
    const { name, description, parent_category_id } = req.body;
    if (!name) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูลที่ต้องระบุ มีไม่ครบ"
        });
    }
    if (name.length < 3 || name.length > 30 || typeof name !== 'string') {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูลไม่ถูกต้อง"
        });
    }
    if (description !== undefined && description.length >= 1000) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อความ description ยาวเกินที่กำหนด 1000 ตัวอักษร"
        });
    }
    next();
}