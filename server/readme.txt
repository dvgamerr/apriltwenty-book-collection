ขั้นตอนการติดตั้ง
1 สร้าง database ชื่อ book_collection ใช้ sql-statment จากไฟล์ sql-statment.txt ใส่ใน pgadmin เพื่อสร้างตารางและข้อมูลตัวอย่าง
2 clone จาก github https://github.com/AprilTwenty/book-collection.git
3 ติดตั้ง npm ที่ต้องใช้ npm express nodemon bcrypt jsonwebtoken dotenv prisma (pg //ไม่ใช้แล้ว เปลี่ยนมาใช้ prismaORM แต่อาจติดตั้งไว้ ใช้ทดสอบง่ายกว่า)
    ติดตั้งตามนี้

npm init -y
npm install express
npm install nodemon
npm install pg //ไม่ใช้แล้ว เปลี่ยนมาใช้ prismaORG แต่อาจติดตั้งไว้ ใช้ทดสอบง่ายกว่า
npm install bcrypt
npm install jsonwebtoken
npm install dotenv
npm install prisma --save-dev
npm install @prisma/client

4 สร้างไฟล์ .env ใส่ข้อมูล database และ secret key ตัวอย่างที่ใช้ทดลอง ดังนั้

DATABASE_URL="postgresql://postgres:unknow88B@localhost:5432/book_collection?schema=public"
SECRET_KEY = lTY7AOgyQ8+ViEIAjijB/3BDlmsoKxQzcaWK9nSMzkCRxMujN3vr6B+d1hAWh/RgXSSoVFvc5aTdIakWq0XQBKr30G6YLLLMWQj2rRj1BpYw54b3WupGzGM98SCYuB4WhcbuNMMj/49GYzHei/15vVVq908WLwTbWj3wGZeB7pjcS4oKYh2P+bOHSPIWWKtN/PdyvPVQYKggoNcvunQr0lLWl8X7U614B4aMQItCc4hcygK+Gtw+SuO+3eSyFbo2d3N5GQ6TPC3qqKhrmqCc/EqSa5lB0Th4yGb5y/vzOv64zZ+UcsFad37EoEpGdYnx1iQ4sRquWyEE0HWPk2LjAQ==


5 รัน npx prisma generate และหากมีการแก้ไขข้อมูล เกี่ยวกับ database หรือ prisma ให้รัน อีกครั้ง
6 เปิดการทำงาน server ด้วย npm run start