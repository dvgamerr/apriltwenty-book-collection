import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({
            "success": false,
            "message": "Token has invalid format"
        });
    }
    const tokenWithoutBearer = token.split(" ")[1];
    jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({
                "success": false,
                "message": "Token is invalid"
            });
        }
        req.user = payload;
        next();
    })
};