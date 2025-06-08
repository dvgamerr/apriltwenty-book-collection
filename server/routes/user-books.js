import { Router } from "express";
import prisma from "../app.js";
import { userBookValidation, validateId, userIdValidation, validateQuery } from "../middleware/validateData.js"

const routerUserBooks = Router();

routerUserBooks.post("/", userBookValidation, async (req, res) => {
    //1 access request
    const { book_id, user_id, status } = req.body;
    const userIdInt = parseInt(user_id, 10);
    const bookIdInt = parseInt(book_id,10);
    try {
        //2 sql
        const user = await prisma.users.findUnique({ where: { user_id: userIdInt } });
        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }
        const book = await prisma.books.findUnique({ where: { book_id: bookIdInt }});
        if (!book) {
            return res.status(404).json({
                "success": false,
                "message": "Book not found"
            });
        }
        const saveBook = {
            data: {
                book_id: bookIdInt,
                user_id: userIdInt,
                status,
                created_at: new Date(),
                updated_at: new Date()
            }
        };
        const result = await prisma.user_books.create(saveBook);
        //3 response
        return res.status(201).json({
            "success": true,
            "message": "Save book successfully",
            "data": result
        });
    } catch (error) {
                    console.error("error: " + error)
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
routerUserBooks.get("/:userBookId", validateId("userBookId"), async (req, res) => {
    //1 access request
    //2 sql
    const findId = {
        where: { user_book_id: req.params.userBookId },
    };
    try {
        const result = await prisma.user_books.findUnique(findId);
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "Storage book not found"
            });
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
routerUserBooks.get("/", validateQuery, userIdValidation,  async (req, res) => {
    //1 access requset
    const { user_id, status, page, limit } = req.query;
    const userIdInt = parseInt(user_id, 10);
    //2 sql
    let searchCondition = {};
    if (user_id || status) {
        searchCondition.AND = [];
    }
    if (user_id) {
        searchCondition.AND.push({ user_id: userIdInt });
    }
    if (status) {
        searchCondition.AND.push({ status });
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
        const result = await prisma.user_books.findMany(queryOption);
        const count = await prisma.user_books.count({ where: searchCondition });
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

export default routerUserBooks;