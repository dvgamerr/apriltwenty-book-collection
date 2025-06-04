import { Router } from "express";
import prisma from "../app";

const routerUsers = Router();

routerUsers.post("/", (req, res) => {
    //1 access request
    const { username, email, prassword } = req.body;
    //2 sql
    //3 response
    return res.status(201).json({
        "success": true,
        "message": "Create user successfully",
        "data": result
    });
})

export default routerUsers;