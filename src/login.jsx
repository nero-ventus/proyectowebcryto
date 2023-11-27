import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import './LoginSignup.css';

import user_icon from './Assets/person.png'
import email_icon from './Assets/email.png'
import password_icon from './Assets/password.png'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8081/signup', {
            username: username,
            password: password
        })
            .then(res => {
                console.log(res);
                alert("Se ha enviado un correo de confirmacion a la dirreccion que proporciono, confime para poder inicar sesion")
                navigate("/home")
            })
            .catch(err => console.log(err));
    };



    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className='header'>
                    <div className='text'>Iniciar Sesion</div>
                    <div className='underline'></div>
                </div>
                <div className='inputs'>

                    <div className='input'>
                        <img src={email_icon} alt="" />
                        <input
                            type='email'
                            placeholder='Correo'
                            id="username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>
                    <div className='input'>
                        <img src={password_icon} alt="" />
                        <input
                            type='password'
                            placeholder='Contraseña' id="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                </div>

                <div className='forgot-password'>
                    Olvido contraseña <span>Click aqui</span>
                </div>

                <div className='submit-container'>
                    <button className='submit' type="submit">Iniciar Sesion</button>
                </div>
            </form>
        </div>

    );
};

export default Login;