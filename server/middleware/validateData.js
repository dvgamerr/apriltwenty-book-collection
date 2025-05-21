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
    const { page, limite} = req.query;
    if (page === undefined && limite === undefined) {
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
    if (limite !== undefined) {
        const limiteInt = parseInt(limite, 10);
        if (inNaN(limiteInt) || limiteInt <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "รูปแบบข้อมูล limite ไม่ถูกต้อง"
            });
        }
        req.query.limite = limiteInt;
    }
    next();
}