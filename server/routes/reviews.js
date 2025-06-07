import { Router } from "express";
import prisma from "../app.js";
import { reviewValidation } from "../middleware/validateData.js"

const routerReviews = Router();

routerReviews.post("/", reviewValidation, async (req, res) => {
    //1 access request
    const { book_id, user_id, rating, comment } = req.body;
    try {
        //2 sql
        const createReview = {
            data: {
                book_id,
                user_id,
                rating,
                comment,
                created_at: new Date()
            }
        };
        const result = await prisma.reviews.create(createReview);
        //3 response
        return res.status(201).json({
            "success": true,
            "message": "Create review successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }

});


export default routerReviews;