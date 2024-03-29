import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import md5 from 'js-md5';

import './LoginSignup.css';

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
        const hashedPassword = md5(password);

        axios.post('http://localhost:8081/login', {
            username: username,
            password: hashedPassword
        })
            .then(res => {
                console.log(res.data);
                alert("Ingreso exitoso")
                navigate("/home", { state: {user: res.data.user, token: res.data.token }});
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
                    Olvido contraseña  <Link to="/recover"><span>Click aqui</span></Link>
                </div>

                <div className='submit-container'>
                    <button className='submit' type="submit">Iniciar Sesion</button>
                    <Link to="/signup">
                        <button className='submit' >Registrarse</button>
                    </Link>
                </div>
            </form>
        </div>

    );
};

export default Login;