import { Router } from "express";
import prisma from "../app.js";
import { postAuthorValidation, validateId, validateQuery } from "../middleware/validateData.js";
import { protect } from "../middleware/protect.js"

const routerAuthors = Router();
routerAuthors.use(protect);

/**
 * @swagger
 * /authors/{authorId}:
 *   get:
 *     summary: ดึงข้อมูลผู้แต่งตาม authorId
 *     description: ค้นหาผู้แต่งจากฐานข้อมูลโดยใช้ authorId
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของผู้แต่งที่ต้องการค้นหา
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Author'
 *       404:
 *         description: ไม่พบผู้แต่ง
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */

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

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: ดึงรายชื่อผู้แต่ง
 *     description: ค้นหาผู้แต่งตามคำค้นหา หรือดึงทั้งหมด
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: คำค้นหาที่ใช้ค้นหาผู้แต่ง
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: ค้นหาผู้แต่งตามชื่อ
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: หมายเลขหน้า
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: จำนวนรายการต่อหน้า
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */

routerAuthors.get("/", validateQuery, async (req, res) => {
    //1 access request
    const { search, name, page, limit } = req.query;

    let searchCondition = {};
    if (name) {
        searchCondition = {
            name: { contains: name, mode: "insensitive" }
        }
    } else if (search) {
        searchCondition = {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { bio: { contains: search, mode: "insensitive" } }
            ]
        }
    }
    let queryOption = { where: searchCondition };
    if (page !== undefined && limit !== undefined) {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        queryOption.skip = (pageInt -1) * limitInt;
        queryOption.take = limitInt;
    }
    //2 sql
    try {
        const result = await prisma.authors.findMany(queryOption);
        const count = await prisma.authors.count({ where: searchCondition })
        //3 response
        return res.status(200).json({
            "success": true,
            "count": count,
            "data": result
        })        
    } catch (error) {
        console.error("Error fetching authors: ", error);
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: เพิ่มข้อมูลผู้แต่งใหม่
 *     description: สร้างผู้แต่งใหม่ในระบบด้วยชื่อและคำอธิบาย
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: ชื่อของผู้แต่ง
 *                 example: "J.K. Rowling"
 *               bio:
 *                 type: string
 *                 description: ข้อมูลเกี่ยวกับผู้แต่ง
 *                 example: "นักเขียนชาวอังกฤษที่มีชื่อเสียงจากหนังสือชุด Harry Potter"
 *     responses:
 *       201:
 *         description: เพิ่มผู้แต่งสำเร็จ
 *       500:
 *         description: เกิดข้อผิดพลาดในเซิร์ฟเวอร์
 */

routerAuthors.post("/", postAuthorValidation, async (req, res) => {
    //1 access request
    const { name, bio } = req.body;
    const createAuthor = {
        data: {
            name,
            bio
        }
    };
    //2 sql
    try {
        const result = await prisma.authors.create(createAuthor);
        //3 response
        return res.status(201).json({
            "success": true,
            "message": "Add new author successfully",
            "data": result
        });
    } catch (error) {
        console.error("error on" + error);
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        });
    }
});

/**
 * @swagger
 * /authors/{authorId}:
 *   put:
 *     summary: อัปเดตข้อมูลผู้แต่ง
 *     description: แก้ไขรายละเอียดของผู้แต่งที่มีอยู่ในระบบ
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของผู้แต่ง
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: ชื่อของผู้แต่งใหม่
 *                 example: "J.K. Rowling"
 *               bio:
 *                 type: string
 *                 description: ข้อมูลของผู้แต่งใหม่
 *                 example: "นักเขียนที่ได้รับรางวัลมากมาย"
 *     responses:
 *       200:
 *         description: อัปเดตข้อมูลผู้แต่งสำเร็จ
 *       404:
 *         description: ไม่พบข้อมูลผู้แต่ง
 *       409:
 *         description: มีชื่อผู้แต่งนี้อยู่แล้วในระบบ
 *       500:
 *         description: เกิดข้อผิดพลาดในเซิร์ฟเวอร์
 */

routerAuthors.put("/:authorId", validateId("authorId"), postAuthorValidation, async (req, res) => {
    //1 access request
    const { name, bio } = req.body;
    //extra validate
    const checkAuthor = await prisma.authors.findUnique({
        where: { author_id: req.params.authorId }
    });
    if (!checkAuthor) {
        return res.status(404).json({
            "success": false,
            "message": "Author not found"
    });
    }
    const collision = await prisma.authors.findFirst({
        where: {
            name,
            NOT: { author_id: req.params.authorId }
        }
    });
    if (collision) {
        return res.status(409).json({
            "success": false,
            "message": "ชื่อ author " + collision.name + " มีอยู่ในระบบแล้ว"
        });
    }
    const updateAuthor = {
        where: { author_id: req.params.authorId },
        data: {
            name,
            bio
        }
    }
    //2 sql
    try {
        const result = await prisma.authors.update(updateAuthor);
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Update author successfully",
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

/**
 * @swagger
 * /authors/{authorId}:
 *   delete:
 *     summary: ลบผู้แต่งจากระบบ
 *     description: ลบข้อมูลผู้แต่งโดยใช้ authorId
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของผู้แต่งที่ต้องการลบ
 *     responses:
 *       200:
 *         description: ลบข้อมูลผู้แต่งสำเร็จ
 *       404:
 *         description: ไม่พบข้อมูลผู้แต่ง
 *       500:
 *         description: เกิดข้อผิดพลาดในเซิร์ฟเวอร์
 */

routerAuthors.delete("/:authorId", validateId("authorId"), async (req, res) => {
    //1 access request
    const deleteAuthor = {
        where: { author_id: req.params.authorId }
    };
    //2 sql
    const deleteTarget = await prisma.authors.findUnique(deleteAuthor);
    if (!deleteTarget) {
        return res.status(404).json({
            "success": false,
            "message": "ข้อมูล authorId ไม่ถูกต้อง"
        });
    }
    try {
        const result = await prisma.authors.delete(deleteAuthor)
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Delete author successfully",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please again later"
        });
    }
});
export default routerAuthors;