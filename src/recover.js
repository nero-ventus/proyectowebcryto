import React, { useState } from 'react';
const Recover = () => {
    const [email, setEmailname] = useState('');

    const handleEmailChange = (e) => {
        setEmailname(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Aquí podrías hacer la lógica para enviar la información de inicio de sesión a tu backend
        console.log('Email:', email);

        // Lógica para autenticar al usuario (no implementada en este ejemplo)
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