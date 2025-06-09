import { Router } from "express";
import prisma from "../app.js";
import { userIdBodyValidation } from "../middleware/validateData.js"

const routerCustomCollections = Router();
routerCustomCollections.post("/", userIdBodyValidation, async (req, res) => {
    //1 access request
    const { user_id, name, description } = req.body;
    const userIdInt = parseInt(user_id, 10);
    try {
        //2 sql
        const user = await prisma.custom_collections.findUnique({ where: { user_id: userIdInt } });
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
                created_at: new Date(),
                updated_at: new Date()
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

export default routerCustomCollections;