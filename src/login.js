import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
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
        <div>
            <h2>Login</h2>
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
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <Link to="/signup">Registarse</Link>
            <br/>
            <Link to="/recover">Recuperar</Link>
        </div>
    );
};

export default Login;