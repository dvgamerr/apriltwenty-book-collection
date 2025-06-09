import { Router } from "express";
import prisma from "../app.js";
import { userIdBodyValidation, validateId, validateQuery, userIdQueryValidation, nameBodyValidation, descriptionBodyValidation } from "../middleware/validateData.js"

const routerCustomCollections = Router();
routerCustomCollections.post("/", userIdBodyValidation, async (req, res) => {
    //1 access request
    const { user_id, name, description } = req.body;
    const userIdInt = parseInt(user_id, 10);
    try {
        //2 sql
        const user = await prisma.users.findUnique({ where: { user_id: userIdInt } });
        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }
        const collectionBook = {
            data: {
                user_id: userIdInt,
                name,
                description,
            }
        };
        const result = await prisma.custom_collections.create(collectionBook);
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
routerCustomCollections.get("/:collectionId", validateId("collectionId"), async (req, res) => {
    //1 access request
    //2 sql
    const findId = {
        where: { collection_id: req.params.collectionId },
    };
    try {
        const result = await prisma.custom_collections.findUnique(findId);
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "Collection book not found"
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
routerCustomCollections.get("/", validateQuery, userIdQueryValidation,  async (req, res) => {
    //1 access requset
    const { user_id, name, page, limit } = req.query;
    const userIdInt = parseInt(user_id, 10);
    //2 sql
    let searchCondition = {};
    if (user_id) {
        searchCondition = {
            user_id: userIdInt
        }
    }
    if (name) {
        searchCondition = {
            name: { contains: name, mode: "insensitive" }
        }
    }
    if (name && user_id) {
        searchCondition = {
            AND: [
                { user_id: userIdInt },
                { name: { contains: name, mode: "insensitive" } }
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
        const result = await prisma.custom_collections.findMany(queryOption);
        const count = await prisma.custom_collections.count({ where: searchCondition });
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
routerCustomCollections.put("/:collectionId", validateId("collectionId"), nameBodyValidation, descriptionBodyValidation, async (req, res) => {
    //1 access request
    const { name, description } = req.body;
    //extra validate
    try {
        const checkReview = await prisma.custom_collections.findUnique({
            where: { collection_id: req.params.collectionId }
        });
        if (!checkReview) {
            return res.status(404).json({
                "success": false,
                "message": "Collection book not found"
            });
        }
        const updateCollection = {
            where: { collection_id: req.params.collectionId },
            data: {
                name,
                description
            }
        }
        //2 sql
        const result = await prisma.custom_collections.update(updateCollection);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Update collection successfully",
            "data": result
        });        
    } catch(error) {
        console.error("error:" + error)
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});
export default routerCustomCollections;