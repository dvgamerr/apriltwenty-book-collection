📚 TextVerse: ระบบจัดการหนังสือออนไลน์

Mini-project สำหรับจบคอร์สเรียน TechUp โดยมุ่งเน้นสร้างระบบจัดการหนังสือที่สามารถใช้งานจริงได้ในระดับหนึ่ง  
ระบบรองรับการเพิ่มข้อมูลหนังสือ แนะนำหนังสือ แชร์รีวิว และบันทึกหนังสือลงในคอลเลกชันส่วนตัวของผู้ใช้

🎯 วัตถุประสงค์
สร้างแพลตฟอร์มสำหรับคนรักการอ่าน โดยเฉพาะกลุ่มผู้ที่ชื่นชอบนิยาย เพื่อให้สามารถ:
- เพิ่ม/แชร์หนังสือของตัวเอง
- บันทึกหนังสือลงคอลเลกชัน
- แสดงรีวิวและให้คะแนนหนังสือ

---

🚀 วิธีการติดตั้งและใช้งาน

✅ ขั้นตอนการติดตั้ง

1. Backend
`bash
cd /book-collection/server
npm init -y
npm install express nodemon bcrypt jsonwebtoken dotenv cors
npm install prisma --save-dev
npm install @prisma/client
npm install swagger-jsdoc swagger-ui-express
`

🔐 ตั้งค่าไฟล์ .env
`env

สำหรับใช้งานแบบ production (Supabase)
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/postgres"
SECRETKEY="yoursecret_key"

สำหรับทดลองแบบ localhost
DATABASEURL="postgresql://postgres:<password>@localhost:5432/bookcollection?schema=public"
SECRET_KEY="testsecret"
`

`bash
npx prisma generate
npx prisma migrate dev
`

2. Frontend
`bash
cd /book-collection/client
npm install
npm install react-router-dom axios react-slick slick-carousel
`

---

🧪 การเปิดใช้งานระบบ
`bash

Backend
cd /book-collection/server
npm run start

Frontend
cd /book-collection/client
npm run dev
`

Swagger API Docs: http://localhost:4000/api-docs

---

🔧 เทคโนโลยีที่ใช้ (Tech Stack)

| Layer     | Technology                |
|-----------|---------------------------|
| Frontend  | React, Axios, CSS         |
| Backend   | Node.js, Express, Prisma  |
| Database  | PostgreSQL (via Supabase) |
| API Docs  | Swagger                   |

---

📂 โครงสร้างโปรเจกต์ (บางส่วน)

`plaintext
book-collection/
├── client/          # React frontend
│   ├── components/
│   ├── pages/
│   └── ...
├── server/          # Express backend
│   ├── routes/
│   ├── controllers/
│   ├── prisma/
│   └── .env
└── README.md
`

---

🔐 ฟีเจอร์สำคัญ

- ระบบสมัครสมาชิกและเข้าสู่ระบบ (Auth)
- แนะนำหนังสือและเพิ่มหนังสือลงระบบ
- ค้นหาและจัดหมวดหมู่หนังสือ
- การแบ่งหน้า (Pagination)
- รีวิว + ให้คะแนน

---

📡 ตัวอย่าง API

`http
POST /auth/register
{
  "username": "test1",
  "password": "testtest",
  "email": "test@test.com"
}

POST /auth/login
{
  "username": "test1",
  "password": "testtest"
}
`

---

⚠️ Known Issues & Troubleshooting

- หากเชื่อมต่อ Supabase ไม่สำเร็จ ลองใช้งาน Prisma เวอร์ชัน 6.11.1

---

🙋‍♂️ ผู้พัฒนา & ขอบคุณ

Developed by Atchariya Tongyoo

ขอบคุณแหล่งข้อมูลจาก:
- Prisma Docs
- Supabase Community
- Swagger
