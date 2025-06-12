import { Router } from "express";
import { postBookValidation } from "../middleware/validateData.js";
import prisma from "../app.js";

const routerBooks = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         book_id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         isbn:
 *           type: string
 *         publisher:
 *           type: string
 *         published_year:
 *           type: integer
 *         cover_url:
 *           type: string
 *         author:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     summary: ดึงข้อมูลหนังสือตาม bookId
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */

routerBooks.get("/:bookId", async (req, res) => {
    //1 access body and req
    const bookIdFromClient = req.params.bookId;
    const bookIdFromClientInt = parseInt(bookIdFromClient, 10);
    if (isNaN(bookIdFromClientInt)) {
        return res.status(400).json({
            "success": false,
            "message": "ข้อมูล book_id ไม่ถูกต้อง"
        });
    }
    //2 sql statment
    try {
    const result = await prisma.books.findUnique({
        where: {book_id: bookIdFromClientInt},
        include: { 
            book_authors: {include: { authors: true }},
            book_categories: {include: { categories: true }}
         }
    });
    //3 res section
    if (!result) {
        return res.status(404).json({
            "success": false,
            "message": "Book not found"
        });
    }
    const simpleResult = {
        "book_id": result.book_id,
        "title": result.title,
        "description": result.description,
        "isbn": result.isbn,
        "publisher": result.publisher,
        "published_year": result.published_year,
        "cover_url": result.cover_url,
        "author": result.book_authors.map((arr_author) => {
            return arr_author.authors.name}),
        "category": result.book_categories.map((arr_category) => {
            return arr_category.categories.name})
    }
    return res.status(200).json({
        "success": true,
        "data": simpleResult
    })
    } catch (error) {
        console.error("[Error retrieving book]:", error);
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }
});

/**
 * @swagger
 * /books:
 *   get:
 *     summary: ดึงข้อมูลหนังสือทั้งหมดตามตัวกรอง
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

routerBooks.get("/", async(req, res) => {
    //1 access req
    const { name, category, author } = req.query;
    let filters = {};
    if (name) {
        filters.title = { contains: name, mode: "insensitive" }
    };
    if (author) {
        filters.book_authors = {
            some: {
                authors: { name: { contains : author, mode: "insensitive" }}
            }
        }
    }
    if (category) {
        filters.book_categories = {
            some: {
                categories: {  name: { contains: category, mode: "insensitive" }}
            }
        }
    }
    //2 sql
    try {
        const result = await prisma.books.findMany({
            where: filters,
            include: {
                book_authors: { include: { authors: true }},
                book_categories: { include: { categories: true }}
            }
        })
        //3 res
        const simpleResult = result.map((data) => {
            return {
            "book_id": data.book_id,
            "title": data.title,
            "description": data.description,
            "isbn": data.isbn,
            "publisher": data.publisher,
            "published_year": data.published_year,
            "cover_url": data.cover_url,
            "author": data.book_authors.map((arr_author) => {
                return arr_author.authors.name}),
            "category": data.book_categories.map((arr_category) => {
                return arr_category.categories.name})
        }
        });
        return res.status(200).json({
            "success": true,
            "data": simpleResult
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        });
    }

});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: สร้างหนังสือใหม่
 *     description: เพิ่มหนังสือใหม่ด้วยข้อมูลที่ระบุใน request body
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: ชื่อหนังสือ
 *                 example: "ชื่อหนังสือ"
 *               description:
 *                 type: string
 *                 description: รายละเอียดหนังสือ
 *                 example: "รายละเอียดหนังสือ"
 *               isbn:
 *                 type: string
 *                 description: ISBN ของหนังสือ
 *                 example: "978-3-16-148410-0"
 *               publisher:
 *                 type: string
 *                 description: สำนักพิมพ์ของหนังสือ
 *                 example: "สำนักพิมพ์ตัวอย่าง"
 *               published_year:
 *                 type: integer
 *                 format: int32
 *                 description: ปีที่พิมพ์หนังสือ
 *                 example: 2020
 *               cover_url:
 *                 type: string
 *                 description: URL รูปปกของหนังสือ
 *                 example: "http://example.com/cover.jpg"
 *               author_ids:
 *                 type: array
 *                 description: รายการ ID หรือชื่อของผู้แต่ง
 *                 items:
 *                   oneOf:
 *                     - type: integer
 *                     - type: string
 *                 example: [1, "ผู้แต่งตัวอย่าง"]
 *               category_ids:
 *                 type: array
 *                 description: รายการ ID หรือชื่อของประเภทหนังสือ
 *                 items:
 *                   oneOf:
 *                     - type: integer
 *                     - type: string
 *                 example: [1, "นิยาย"]
 *     responses:
 *       201:
 *         description: เพิ่มหนังสือใหม่สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Add new book successfully"
 *                 newbook:
 *                   $ref: '#/components/schemas/Book'
 *       500:
 *         description: มีข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้งในภายหลัง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error. Please try again later."
 */

routerBooks.post("/", postBookValidation, async (req, res) => {
    //1 access req and body
    const { 
        title, 
        description, 
        isbn, 
        publisher, 
        published_year, 
        cover_url, 
        author_ids, 
        category_ids 
    } = req.body;
    try {
        //2 sql statment
        const result = await prisma.books.create(
            {
                data: {
                    title,
                    description,
                    isbn,
                    publisher,
                    published_year,
                    cover_url,
                    created_at: new Date(),
                    updated_at: new Date(),
                    // connect to book_author
                    book_authors: {
                        create: author_ids?.map((authorFromClient) => {
                            if (typeof authorFromClient === "number") {
                                return {
                                    authors: {
                                        connect: { author_id: authorFromClient }
                                    }
                                };
                            } else if (typeof authorFromClient === "string") {
                                return {
                                    authors: {
                                        connectOrCreate: {
                                            where: { name: authorFromClient },
                                            create: { name: authorFromClient }
                                        }
                                    }
                                };
                            }                           
                        }).filter(Boolean) || [],
                    },
                    book_categories: {
                        create: category_ids?.map((categoryFromClient) => {
                            if (typeof categoryFromClient === "number") {
                                return {
                                    categories: {
                                        connect: { category_id: categoryFromClient }
                                    }
                                };
                            } else if (typeof categoryFromClient === "string") {
                                return {
                                    categories: {
                                        connectOrCreate: {
                                            where: { name: categoryFromClient },
                                            create: { name: categoryFromClient }
                                        }
                                    }
                                };
                            }
                        }).filter(Boolean) || [],
                    }
                },
                include: {
                    book_authors: { include: { authors: true } },
                    book_categories: { include: { categories: true } }
                }
            }
        )
        //3 res section
        return res.status(201).json({
            "success": true,
            "message": "Add new book successfully",
            "newbook": result
        })
    } catch (error) {
        console.error("Error in POST /books:", error)
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later."
        })
    }

});

/**
 * @swagger
 * /books/{bookId}:
 *   put:
 *     summary: อัปเดตข้อมูลหนังสือ
 *     description: แก้ไขรายละเอียดหนังสือที่มีอยู่ตาม bookId
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของหนังสือที่ต้องการอัปเดต
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: ชื่อหนังสือ
 *                 example: "ชื่อหนังสือที่แก้ไข"
 *               description:
 *                 type: string
 *                 description: รายละเอียดของหนังสือ
 *                 example: "รายละเอียดใหม่"
 *               isbn:
 *                 type: string
 *                 description: ISBN ของหนังสือ
 *                 example: "978-3-16-148410-0"
 *               publisher:
 *                 type: string
 *                 description: สำนักพิมพ์ของหนังสือ
 *                 example: "สำนักพิมพ์ใหม่"
 *               published_year:
 *                 type: integer
 *                 format: int32
 *                 description: ปีที่พิมพ์หนังสือ
 *                 example: 2021
 *               cover_url:
 *                 type: string
 *                 description: URL รูปปกของหนังสือ
 *                 example: "http://example.com/new-cover.jpg"
 *               author_ids:
 *                 type: array
 *                 description: รายการ ID หรือชื่อของผู้แต่ง
 *                 items:
 *                   oneOf:
 *                     - type: integer
 *                     - type: string
 *                 example: [2, "ผู้แต่งใหม่"]
 *               category_ids:
 *                 type: array
 *                 description: รายการ ID หรือชื่อของประเภทหนังสือ
 *                 items:
 *                   oneOf:
 *                     - type: integer
 *                     - type: string
 *                 example: [3, "วรรณกรรม"]
 *     responses:
 *       200:
 *         description: อัปเดตข้อมูลหนังสือสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Update book data successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: รูปแบบข้อมูล bookId ไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "รูปแบบข้อมูล bookId ไม่ถูกต้อง"
 *       404:
 *         description: ไม่พบหนังสือที่ต้องการแก้ไข
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Book not found"
 *       500:
 *         description: เกิดข้อผิดพลาดในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error. Please try again later."
 */


routerBooks.put("/:bookId", postBookValidation, async (req, res) => {
    //1 access req
    const bookIdFromClient = req.params.bookId;
    const bookIdFromClientInt = parseInt(bookIdFromClient, 10);
    if (isNaN(bookIdFromClientInt)){
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูล bookId ไม่ถูกต้อง"
        });
    }
    const { 
        title, 
        description, 
        isbn, 
        publisher, 
        published_year, 
        cover_url, 
        author_ids, 
        category_ids 
    } = req.body;
    //2 sql
    try {
        const [ deleteAuthor, deleteCategory, updateBook ] = await prisma.$transaction([
            prisma.book_authors.deleteMany({
                where: { book_id: bookIdFromClientInt }
            }),
            prisma.book_categories.deleteMany({
                where: { book_id: bookIdFromClientInt }
            }),

            prisma.books.update({
                where: { book_id: bookIdFromClientInt },
                data: {
                    title,
                    description,
                    isbn,
                    publisher,
                    published_year,
                    cover_url,
                    updated_at: new Date(),
                    book_authors: {
                        create: author_ids?.map((authorFromClient) => {
                            if (typeof authorFromClient === "number") {
                                return {
                                    authors: {
                                        connect: { author_id: authorFromClient }
                                    }
                                }
                            } else if (typeof authorFromClient === "string") {
                                return {
                                    authors: {
                                        connectOrCreate: {
                                            where: { name: authorFromClient },
                                            create: { name: authorFromClient}
                                        }
                                    }
                                }
                            }
                        }).filter(Boolean) || [],
                    },
                    book_categories: {
                        create: category_ids?.map((categoryFromClient) => {
                            if (typeof categoryFromClient === "number") {
                                return {
                                    categories: {
                                        connect: { category_id: categoryFromClient }
                                    }
                                }
                            } else if (typeof categoryFromClient === "string") {
                                return {
                                    categories: {
                                        connectOrCreate: {
                                            where: { name: categoryFromClient },
                                            create: { name: categoryFromClient }
                                        }
                                    }
                                }
                            }
                        }).filter(Boolean) || [],
                    }
                },
                include: { 
                    book_authors: { include: { authors: true }},
                    book_categories: { include: { categories: true }}
                }
            })
        ])

        //3 res
            if (!updateBook) {
                return res.status(404).json({
                    "success": false,
                    "message": "Book not found"
                });
            }
        return res.status(200).json({
            "success": true,
            "message": "update book data successfully",
            "data": updateBook
        });
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Internal server error. Please try again later"
        })
    }
});

/**
 * @swagger
 * /books/{bookId}:
 *   delete:
 *     summary: ลบหนังสือตาม bookId
 *     description: ลบข้อมูลหนังสือที่มีอยู่โดยใช้ bookId
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของหนังสือที่ต้องการลบ
 *     responses:
 *       200:
 *         description: ลบหนังสือสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Delete book id: 1 successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: รูปแบบข้อมูล bookId ไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "รูปแบบข้อมูล book id ไม่ถูกต้อง"
 *       404:
 *         description: ไม่พบหนังสือที่ต้องการลบ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "ข้อมูล bookId ไม่ถูกต้อง"
 *       500:
 *         description: เกิดข้อผิดพลาดในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error. Please try again later."
 */

routerBooks.delete("/:bookId", async (req, res) => {
    //1 access request
    const bookIdFromClient = req.params.bookId;
    const bookIdFromClientInt = parseInt(bookIdFromClient, 10);
    if (isNaN(bookIdFromClientInt)) {
        return res.status(400).json({
            "success": false,
            "message": "รูปแบบข้อมูล book id ไม่ถูกต้อง"
        });
    }
    //2 sql
    try {
        const deleteTarget = await prisma.books.findUnique({
            where: { book_id: bookIdFromClientInt }
        });
        if (!deleteTarget) {
            return res.status(404).json({
                "success": false,
                "message": "ข้อมูล bookId ไม่ถูกต้อง"
            });
        }
        const result = await prisma.books.delete({
            where: { book_id: bookIdFromClientInt },
            include: {
                book_authors: true,
                book_categories: true 
            }
        });
        //3 response
        return res.status(200).json({
            "success": true,
            "message": "Delete book id: " + bookIdFromClientInt + " successfully",
            "data": result
        })
        } catch (error) {
            return res.status(500).json({
                "success": false,
                "message": " Internal server error. Please try again later"
            })
        }
});

/*เปลี่ยน method delete เป็นอีกแบบ ช้ากว่า แต่เข้าใจง่ายกว่า
routerBooks.delete("/:bookId", async (req, res) => {
    //1 access request
    const bookIdFromClient = req.params.bookId;
    const bookIdFromClientInt = parseInt(bookIdFromClient, 10);
    //2 sql
    try {
        const result = await prisma.books.delete({
            where: { book_id: bookIdFromClientInt },
            include: {
                book_authors: { where: { book_id: bookIdFromClientInt }},
                book_categories: { where: { book_id: bookIdFromClientInt }}
            }
    });
    //3 response
    console.log(result);
        return res.status(200).json({
            "success": true,
            "message": "Book at id " + bookIdFromClientInt + " is deleted"
    })
    } catch (error) {
        console.error(error)
        if (error.code == "P2025") {
            return res.status(404).json({
                "success": false,
                "message": "ข้อมูล bookId ไม่ถูกต้อง"
            })
        }
        return res.status(500).json({
            "success": false,
            "mesage": "Internal server error. Please try again later."
        })
    }
});
*/


export default routerBooks;