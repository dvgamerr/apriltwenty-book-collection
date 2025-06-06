import { Router } from "express";
import prisma from "../app.js";
import { validateId, validateQuery } from "../middleware/validateData.js"

const routerUsers = Router();

routerUsers.get("/:userId", validateId("userId"), async (req, res) => {
    //1 access request
    //2 sql
    const findId = {
        where: { user_id: req.params.userId }
    };
    try {
        const result = await prisma.users.findUnique(findId)
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "Category not found"
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
routerUsers.get("/", validateQuery, async (req, res) => {
    //1 access request
    const { username, page, limit } = req.query;
    //2 sql
    try {
        let searchCondition = {
            username: { contains: username, mode: "insensitive" }
        };
        let queryOption = {
            where: searchCondition
        };
        if (page !== undefined && limit !== undefined) {
            const pageInt = parseInt(page, 10);
            const limitInt = parseInt(limit, 10);
            queryOption.skip = (pageInt - 1) * limitInt;
            queryOption.take = limitInt;
        }
        const count = await prisma.users.count({ where: searchCondition });
        const result = await prisma.users.findMany(queryOption);
        //3 response
        return res.status(200).json({
            "success": true,
            "count": count,
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }
});


export default routerUsers;