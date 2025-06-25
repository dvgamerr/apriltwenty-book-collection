import React, { useState } from "react";
import { register } from "../apis/register";

function RegisterComponent() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ error, setError ] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault;
        if (password !== confirmPassword) {
            return setError("รหัสผ่านไม่ตรงกัน")
        }
        const clientData = {}
        clientData.body = {
            "username": username,
            "password": password,
            "email": email
        }
        try {
            const response = register(clientData);
            
        } catch (error) {
            console.error(error);
            setError("เกิดข้อผิดพลาดในการลงทะเบียน")
        }
    }
        
    
    
    return (
        
        <div className="register-contrainer">
            <form onSubmit={handleRegister}>
                <div className="input-box">
                    <label>Username:</label>
                    <div className="input">
                        <input 
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>
                </div>
                <div className="input-box">
                    <label>Password:</label>
                    <div className="input">
                        <input 
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                </div>
                <div className="input-box">
                    <label>Confirm password:</label>
                    <div className="input">
                        <input 
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                    </div>
                    {error==="รหัสผ่านไม่ตรงกัน" && (
                        <p>{error}</p>
                    )}
                </div>
                <div className="input-box">
                    <label>Email:</label>
                    <div className="input">
                        <input 
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default RegisterComponent;