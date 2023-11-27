import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import md5 from 'js-md5';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const hashedPassword = md5(password);

        // Lógica para crear una cuenta de usuario (no implementada en este ejemplo)
        axios.post('http://localhost:8081/signup', {
            username: username,
            email: email,
            password: hashedPassword
        })
            .then(res => {
                console.log(res);
                alert("Se ha enviado un correo de confirmacion a la dirreccion que proporciono, confime para poder inicar sesion")
                navigate("/")
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;