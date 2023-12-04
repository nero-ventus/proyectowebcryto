import React, { useState } from 'react';
import axios from "axios";
const Recover = () => {
    const [email, setEmailname] = useState('');

    const handleEmailChange = (e) => {
        setEmailname(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8081/recover', {
            email: email
        })
            .then(res => {
                console.log(res);
                alert("Correo de recuperacion enviado")
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h2>Recuperar</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>
                <button type="submit">Recuperar</button>
            </form>
        </div>
    );
};

export default Recover;