import React from 'react';
import jsPDF from 'jspdf';

const MakeBill = () => {
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Hello, this is a PDF!', 10, 10); // Agrega texto al PDF

        // Guarda el archivo PDF con el nombre 'generated.pdf'
        doc.save('generated.pdf');
    };

    return (
        <div>
            <h2>Generador documentos</h2>
            <button onClick={generatePDF}>Generar Factura</button>
        </div>
    );
};

export default MakeBill;