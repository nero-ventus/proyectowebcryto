import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

const Home = () => {

    const [description, setDescription] = useState('');
    const [shoppingList, setShoppingList] = useState([]);
    const location = useLocation();
    const user = location.state.user;
    const token = location.state.token;
    const navigate = useNavigate();

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8081/buy', {
            token: token,
            description: description,
            username: user
        })
            .then(res => {
                alert("Compra exitosa")
                navigate("/home", { state: {user: user, token: token }});
                fetchShoppingList();
            })
            .catch(err => console.log(err));
    };

    // Función para obtener la lista de compras desde el servidor
    const fetchShoppingList = () => {
        axios.get('http://localhost:8081/shoppinglist', {
            params: {
                token: token
            }
        })
            .then(response => {
                // Actualizar el estado con la lista de compras obtenida
                setShoppingList(response.data.shoppingList);
            })
            .catch(error => {
                console.error('Error al obtener la lista de compras', error);
            });
    };

    useEffect(() => {
        // Llamar a la función para obtener la lista de compras al cargar el componente
        fetchShoppingList();
    }, []); // El segundo argumento vacío asegura que esta solicitud solo se realice una vez al montar el componente

    const generatePDF = (billId) => {

        axios.get('http://localhost:8081/getOneBill', {
            params: {
                token: billId
            }
        })
            .then(response => {
                // Actualizar el estado con la lista de compras obtenida
                const doc = new jsPDF();
                doc.text('Usuario: ' + response.data[0].username +
                    '\nFecha: ' + response.data[0].date +
                    '\nDescripcion: ' + response.data[0].description +
                    '\nFirma: ' + response.data[0].signature , 10, 10); // Agrega texto al PDF

                // Genera el código QR utilizando el billtoken
                const qrCodeData = 'http://localhost:8081/validatebill1?token=' + response.data[0].billtoken;
                const qrCodeImage = new Image();
                qrCodeImage.src = 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(qrCodeData);

                qrCodeImage.onload = function() {
                    // Inserta el código QR como imagen en el PDF
                    doc.addImage(qrCodeImage, 'PNG', 10, 50, 100, 100); // Cambia los valores según tu diseño
                    doc.save('generated.pdf'); // Guarda el PDF
                };
            })
            .catch(error => {
                console.error('Error al obtener la compra', error);
            });
    };

    const getPublicKey = () => {

        axios.get('http://localhost:8081/getpublickey', {
            params: {
                token: token
            }
        })
            .then(response => {
                // Actualizar el estado con la lista de compras obtenida
                const doc = new jsPDF();
                doc.setFontSize(10);
                doc.text(response.data.publickey, 10, 10); // Agrega texto al PDF

                doc.save('generated.pdf'); // Guarda el PDF
            })
            .catch(error => {
                console.error('Error al obtener llave publica', error);
            });
    };

    return (
        <div>
            <h2>Bienvenido {user}</h2>
            <button onClick={() => getPublicKey()}>Obtener Llave publica</button>
            <form onSubmit={handleSubmit} method="post">
                <div className='header'>
                    <div className='text'>Registrar compra</div>
                    <div className='underline'></div>
                </div>
                <div className='inputs'>
                    <div className='input'>
                        <input
                            type='text'
                            placeholder='Descripcion de compra'
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </div>
                </div>

                <div className='submit-container'>
                    <button className='submit' type="submit">Comprar</button>
                </div>
            </form>

            <h3>Lista de compras:</h3>
            <ul>
                {shoppingList.map((item, index) => (
                    <li key={index}>
                        Fecha: {item[0]} Descripcion: {item[1]}
                        <button onClick={() => generatePDF(item[2])}>Generar Factura</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;