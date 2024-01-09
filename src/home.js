import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

const Home = () => {

    const [description, setDescription] = useState('');
    const [shoppingList, setShoppingList] = useState([]);
    const location = useLocation();
    const user = location.state.user;
    const token = location.state.token;
    const navigate = useNavigate();
    //const iv = new Uint8Array(12);// Vector de inicialización

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

                doc.save(user + 'publicKey.pdf'); // Guarda el PDF
            })
            .catch(error => {
                console.error('Error al obtener llave publica', error);
            });
    };

    const getDhPublicKey = () => {

        axios.get('http://localhost:8081/getdhpublickey', {
            params: {
                token: token
            }
        })
            .then(response => {
                // Actualizar el estado con la lista de compras obtenida
                const doc = new jsPDF();
                doc.setFontSize(10);
                doc.text(response.data.dhpublickey, 10, 10, {maxWidth: 180}); // Agrega texto al PDF

                doc.save(user + 'dhPublicKey.pdf'); // Guarda el PDF
            })
            .catch(error => {
                console.error('Error al obtener llave publica', error);
            });
    };

    const getDhSecretKey = () => {
        let dhpublickey = document.getElementById('dhotherpublic').value;

        //console.log(dhpublickey);

        axios.get('http://localhost:8081/generatedhsecret', {
            params: {
                token: token,
                dhpublickey: dhpublickey
            }
        })
            .then(response => {
                // Actualizar el estado con la lista de compras obtenida
                //console.log(response.data.dhsecretkey)
                const doc = new jsPDF();
                doc.setFontSize(10);
                doc.text(response.data.dhsecretkey, 10, 10, {maxWidth: 180}); // Agrega texto al PDF

                doc.save(user + 'dhSecretKey.pdf'); // Guarda el PDF
            })
            .catch(error => {
                console.error('Error al obtener llave publica', error);
            });
    };

    //PDF Cifrado y descrifrado
    function hexStringToArrayBuffer(hexString) {
        const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
        for (let i = 0; i < hexString.length; i += 2) {
            bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return bytes.buffer;
    }
    const cipherPDF = async () => {
        const secretKey = document.getElementById('dhsecret').value;
        const fileInput = document.getElementById('fileinput');
        const file = fileInput.files[0];

        if (file) {
            const {data, iv} = await encryptPDF(file, hexStringToArrayBuffer(secretKey));
            saveEncryptedDataToFile(data, iv, 'c_' + file.name.slice(0, -4));
        } else {
            alert('Selecciona un archivo antes de intentar leerlo.');
        }

    };

    const decipherPDF = async () => {
        const secretKey = document.getElementById('dhsecret').value;
        const fileInput = document.getElementById('fileinput');
        const file = fileInput.files[0];

        if (file) {
            try {
                const fileContent = await readFileContent(file);
                const encryptedFile = JSON.parse(fileContent);

                // Obtener el IV y los datos cifrados del archivo JSON
                const iv = new Uint8Array(encryptedFile.iv);
                const encryptedData = new Uint8Array(encryptedFile.data);

                const data = await decryptPDF(encryptedData.buffer, hexStringToArrayBuffer(secretKey), iv);

                saveArrayBufferAsFile(data, 'd_' + file.name.slice(0, -5), 'application/pdf');
                // Aquí puedes utilizar el ArrayBuffer 'decryptedData' como desees (por ejemplo, convertirlo a un archivo PDF)
            } catch (error) {
                console.error('Error al leer el archivo:', error);
            }
        } else {
            alert('Selecciona un archivo antes de intentar leerlo.');
        }

    };

    // Ejemplo de cómo cifrar un mensaje (en este caso, un archivo PDF)
    async function encryptPDF(pdfFile, secretKey) {
        // Cargar el archivo PDF
        // Aquí, debes implementar cómo obtener el archivo PDF en el navegador

        // Convertir el archivo PDF a un ArrayBuffer
        const arrayBuffer = await pdfFile.arrayBuffer();

        // Crear una clave para el cifrado
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            secretKey.slice(0, 32),
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        );

        // Cifrar el archivo PDF
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encryptedData = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            cryptoKey,
            arrayBuffer
        );

        // Devolver el archivo PDF cifrado como un ArrayBuffer
        console.log(encryptedData);
        console.log(iv);
        return { data: encryptedData, iv: iv };
    }

    // Ejemplo de cómo descifrar un archivo PDF cifrado
    async function decryptPDF(encryptData, secretKey, iv) {
        // Crear una clave para el descifrado

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            secretKey.slice(0, 32),
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        );

        // Descifrar el archivo PDF
        const decryptedData = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv}, // Aquí debes proporcionar el IV usado durante el cifrado
            cryptoKey,
            encryptData
        );

        // Devolver el archivo PDF descifrado como un ArrayBuffer
        return decryptedData;
    }

    function saveArrayBufferAsFile(arrayBuffer, fileName, fileType) {
        // Crear un Blob a partir del ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: fileType });

        // Crear un enlace para descargar el archivo
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName + '.pdf';

        // Simular un clic en el enlace para iniciar la descarga del archivo
        downloadLink.click();
    }

    function saveEncryptedDataToFile(encryptedData, iv, filename) {
        const encryptedFile = {
            iv: Array.from(iv), // Convertir el IV a un array para guardarlo como JSON
            data: Array.from(new Uint8Array(encryptedData)), // Convertir los datos cifrados a un array para guardarlo como JSON
        };

        const jsonContent = JSON.stringify(encryptedFile);

        // Crear un Blob a partir del JSON
        const blob = new Blob([jsonContent], { type: 'application/json' });

        // Crear un enlace para descargar el archivo
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = filename + '.json';

        // Simular un clic en el enlace para iniciar la descarga del archivo
        downloadLink.click();
    }

    function readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsText(file);
        });
    }


    //-------------------------------------

    return (
        <div>
            <h2>Bienvenido {user}</h2>
            <button onClick={() => getPublicKey()}>Obtener Llave publica</button>
            <button onClick={() => getDhPublicKey()}>Obtener Llave publica de DH</button>
            <input type="text" id="dhotherpublic"/>
            <button onClick={() => getDhSecretKey()}>Generar Secreta</button>
            <input type="file" id="fileinput"/>
            <input type="text" id="dhsecret"/>
            <button onClick={() => cipherPDF()}>Cifrar Secreta</button>
            <button onClick={() => decipherPDF()}>Descrifrar Secreta</button>
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