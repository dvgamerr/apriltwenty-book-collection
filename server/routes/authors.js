import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import { validateId } from "../middleware/validateData.js";


const routerAuthors = Router();
const prisma = new PrismaClient();

routerAuthors.get("/:authorId", validateId("authorId"), async (req, res) => {
    //1 access request
    //2 sql
    try {
        const result = await prisma.authors.findUnique({
            where: { author_id: req.params.authorId }
        });
        //3 response
        if (!result) {
            return res.status(404).json({
                "success": false,
                "message": "Author not found"
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

})


export default routerAuthors;