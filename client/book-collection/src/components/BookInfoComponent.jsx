import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getBooks } from '../apis/books';
import './css/BookInfo.css'
import { useParams } from 'react-router-dom';
import noImg from "../images/No_Image_Available.jpg";

function BookInfo() {
    const [ book, setBook ] = useState(null);
    const [ error, setError ] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchBook() {
            const clientData = {};
            clientData.query = "";
            clientData.params = "/" + id;
            try {
                const response = await getBooks(clientData);
                if (response.data && response.data.success) {
                    setBook(response.data.data);
                } else {
                    setError("ไม่พบข้อมูล");
                }
            } catch (error) {
                console.error(error);
                setError(("พบข้อผิดพลาด"));
            }
        }
        fetchBook();
    }, [id])

    if (!book) return <div>กำลังโหลดข้อมูล...</div>
    if (error) return <div>{error}</div>
    return (
        <div className="book-info-box">
            <div className='book-detail-box'>
                <div className='book-img'>
                    <img src={book.cover_url} alt="hero-img" onError={(e) => { e.currentTarget.src=noImg }}/>
                </div>
                <div className='book-detail'>
                    <h3>ชื่อหนังสือ</h3>
                    <p>ผู้เขียน</p>
                    <p>หมวดหมู่</p>
                </div>
            </div>
        </div>
    )
}
export default BookInfo;