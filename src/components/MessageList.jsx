import React from 'react';

export const MessageList = ({ messages, username, onDeleteMessage }) => {
    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        const segundos = String(fecha.getSeconds()).padStart(2, '0');
        return `${dia}/${mes}/${anio}, ${horas}:${minutos}:${segundos}`;
    }

    const shortenUrl = (url) => {
        const maxLength = 30;
        return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
    };

    const formatMessage = (content) => {
        if (!content) return null;

        const urlRegex = /(https?:\/\/[^\s]+)/g;

        if (!content.match(urlRegex)) {
            return <span className="message-text">{content}</span>;
        }

        const parts = content.split(urlRegex);
        const matches = content.match(urlRegex);

        return (
            <span className="message-text">
                {parts.map((part, i) => {
                    if (matches && matches.includes(part)) {
                        return (
                            <a
                                key={i}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="message-link"
                            >
                                {shortenUrl(part)}
                            </a>
                        );
                    }
                    return <span key={i}>{part}</span>;
                })}
            </span>
        );
    };

    const downloadBase64PDF = (base64Data, fileName = 'documento.pdf') => {
        try {
            // Remover el prefijo de data URL si existe
            const base64Clean = base64Data.replace(/^data:application\/pdf;base64,/, '');

            // Convertir base64 a blob
            const byteCharacters = atob(base64Clean);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            // Crear URL del blob
            const url = window.URL.createObjectURL(blob);

            // Crear elemento <a> temporal para la descarga
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;

            // Simular click y limpiar
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Liberar el objeto URL
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Error al descargar el PDF:', error);
            alert('Error al descargar el PDF. Por favor, intente nuevamente.');
        }
    };

    const renderMedia = (message) => {
        return (
            <div className="message-media">
                {message.image && (
                    <div className="message-image-container">
                        <img
                            src={message.image}
                            alt="Message attachment"
                            className="message-image"
                        />
                    </div>
                )}
                {message.pdf && (
                    <div className="message-pdf">
                        <svg
                            className="pdf-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                        <button
                            onClick={() => downloadBase64PDF(message.pdf, `documento_${message.id}.pdf`)}
                            className="pdf-download-btn"
                        >
                            Descargar PDF
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Verificar si hay mensajes
    if (!messages || messages.length === 0) {
        return <div className="message-list">No hay mensajes para mostrar</div>;
    }

    return (
        <div className="message-list">
            <div className="message-list-container">
                {messages.map(message => {
                    // Verificar si el mensaje y el autor son válidos
                    if (!message || !message.author) {
                        return null;
                    }

                    // Verificar si el username existe y tiene un id antes de hacer la comparación
                    const isCurrentUser = username?.id && message.author.id === username.id;

                    return (
                        <div
                            key={message.id}
                            className={`message-item ${
                                isCurrentUser ? 'message-sent' : 'message-received'
                            }`}
                        >
                            <div className="message-avatar">
                                <img
                                    src={message.author.profile_picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    alt={message.author.name || "Usuario"}
                                    className="avatar-image"
                                />
                            </div>
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="message-author">{message.author.name || "Usuario"}</span>
                                    <span className={`author-status ${message.author.state ? 'status-active' : 'status-inactive'}`}/>
                                </div>
                                <div className="message-bubble">
                                    {message.content && (
                                        <div className="message-text-content">
                                            {formatMessage(message.content)}
                                        </div>
                                    )}
                                    {renderMedia(message)}
                                    <div className="message-info">
                                        <span className="message-timestamp">
                                            {formatearFecha(message.create_at)}
                                        </span>
                                        {isCurrentUser && (
                                            <button
                                                onClick={() => onDeleteMessage(message.id)}
                                                className="delete-message-btn"
                                                aria-label="Eliminar mensaje"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M3 6h18"></path>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};