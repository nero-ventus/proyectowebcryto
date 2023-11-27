
import React, { useState } from 'react';
import './LoginSignup.css';

import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

export const Signup = () => {

	return (
		<div className='container'>
			<div className='header'>
				<div className='text'>Registrarse</div>
				<div className='underline'></div>
			</div>
			<div className='inputs'>
				<div className='input'>
					<img src={user_icon} alt="" />
					<input type='text' placeholder='Nombre' />
				</div>
				<div className='input'>
					<img src={email_icon} alt="" />
					<input type='email' placeholder='Correo' />
				</div>
				<div className='input'>
					<img src={password_icon} alt="" />
					<input type='password' placeholder='Contraseña' />
				</div>
                <div className='input'>
					<img src={password_icon} alt="" />
					<input type='password' placeholder='Confirmar contraseña' />
				</div>
			</div>
			

			<div className='submit-container'>
				<div className="submit">Registrase</div>
				
			</div>
		</div>
	);
}