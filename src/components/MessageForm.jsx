import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMesage } from "../api/chat.js";

export const MessageForm = ({ onMessageSent }) => {
    const [content, setContent] = useState("");
    const [filePdf, setFilePdf] = useState(null);
    const [fileImg, setFileImg] = useState(null);

    const navigate = useNavigate();

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convierte el archivo a Base64
            reader.onload = () => resolve(reader.result); // Resuelve con el resultado
            reader.onerror = (error) => reject(error); // Maneja errores
        });
    };

    const handlePdfChange = (e) => {
        setFilePdf(e.target.files[0]); // Guarda el archivo seleccionado
    };

    const handleImageChange = (e) => {
        setFileImg(e.target.files[0]); // Guarda el archivo seleccionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const username = localStorage.getItem("chatUsername");
        if (!username) {
            navigate("/");
            return;
        }

        // Crear el objeto de datos
        const formData = {
            username,
            content: content.trim(),
            image: "",
            pdf: "",
        };

        try {
            if (filePdf) {
                formData.pdf = await convertToBase64(filePdf);
            }

            if (fileImg) {
                formData.image = await convertToBase64(fileImg);
            }

            if (!formData.pdf || !formData.image || formData.content) {
                await createMesage(formData);
            }
            // Limpiar el formulario
            setContent("");
            setFilePdf(null);
            setFileImg(null);
            document.getElementById("filePdf").value = ""; // Limpia el input manualmente
            document.getElementById("fileImg").value = ""; // Limpia el input manualmente

            onMessageSent(); // Notificar al padre que se envió el mensaje
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
    };

    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="ESCRIBE TU MENSAJE....."
            />
            <input
                id="filePdf"
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
            />
            <input
                id="fileImg"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            <button type="submit">ENVIAR</button>
        </form>
    );
};
