import { Router } from "express";
import prisma from "../app.js";
import { reviewValidation, validateId } from "../middleware/validateData.js"

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
routerReviews.get("/:reviewId", validateId("reviewId"), async (req, res) => {
    //1 access request
    //2 sql
    const findId = {
        where: { review_id: req.params.reviewId },
    };
    try {
        const result = await prisma.reviews.findUnique(findId);
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "Review not found"
            })
        }
        return res.status(200).json({
            "success": true,
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