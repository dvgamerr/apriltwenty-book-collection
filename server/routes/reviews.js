import { Router } from "express";
import prisma from "../app.js";
import { reviewValidation, validateId, validateQuery } from "../middleware/validateData.js"

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
routerReviews.get("/", validateQuery, async (req, res) => {
    //1 access requset
    const { user_id, book_id, page, limit } = req.query;
    //2 sql
    let searchCondition = {};
    if (user_id) {
        searchCondition = {
            user_id: user_id
        }
    }
    if (book_id) {
        searchCondition = {
            OR: [
                { user_id: user_id },
                { book_id: book_id }
            ]
        }
    }
    let queryOption = { 
        where: searchCondition,
    };
    if (page !== undefined && limit !== undefined) {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        queryOption.skip = (pageInt - 1) * limitInt;
        queryOption.take = limitInt;
    }
    try {
        const result = await prisma.reviews.findMany(queryOption);
        const count = await prisma.reviews.count({ where: searchCondition });
        //3 response
        return res.status(200).json({
            "success": true,
            "count": count,
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again"
        });
    }
});
export default routerReviews;