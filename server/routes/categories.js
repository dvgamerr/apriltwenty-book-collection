import { Router } from "express";
import prisma from "../app.js";
import { validateId, validateQuery } from "../middleware/validateData.js";

const routerCategories = Router();

routerCategories.get("/:categoryId", validateId("categoryId"), async (req, res) => {
    //1 access request
    //2 sql
    const findId = {
        where: { category_id: req.params.categoryId },
        include: {
            other_categories: {
                select: { category_id: true, name: true }
            }
        }
    };
    try {
        const result = await prisma.categories.findUnique(findId);
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
routerCategories.get("/", validateQuery, async (req, res) => {
    //1 access requset
    const { search, name, page, limit } = req.query;
    //2 sql
    let searchCondition = {};
    if (name) {
        searchCondition = {
            name: { contains: name, mode: "insensitive" }
        }
    }
    if (search) {
        searchCondition = {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
            ]
        }
    }
    let queryOption = { 
        where: searchCondition,
        include: {
            other_categories: {
                select: { category_id: true, name: true }
            }
        }
    };
    if (page !== undefined && limit !== undefined) {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        queryOption.skip = (pageInt - 1) * limitInt;
        queryOption.take = limitInt;
    }
    try {
        const result = await prisma.categories.findMany(queryOption);
        const count = await prisma.categories.count({ where: searchCondition });
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
export default routerCategories;
