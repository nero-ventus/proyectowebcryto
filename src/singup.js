import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import md5 from 'js-md5';

import './LoginSignup.css';

import user_icon from './Assets/person.png'
import email_icon from './Assets/email.png'
import password_icon from './Assets/password.png'

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            alert("Las contraseñas no coinciden");
        }
        else {
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
        }
    };

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>Registrarse</div>
                <div className='underline'></div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='inputs'>
                    <div className='input'>
                        <img src={user_icon} alt="" />
                        <input
                            type='text'
                            placeholder='Nombre'
                            id="username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>
                    <div className='input'>
                        <img src={email_icon} alt="" />
                        <input
                            type='email'
                            placeholder='Correo'
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className='input'>
                        <img src={password_icon} alt="" />
                        <input
                            type='password'
                            placeholder='Contraseña'
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className='input'>
                        <img src={password_icon} alt="" />
                        <input
                            type='password'
                            placeholder='Confirmar contraseña'
                            id='confirmPassword'
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}/>
                    </div>
                </div>

                <div className='submit-container'>
                    <button className="submit" type="submit">Registrarse</button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;