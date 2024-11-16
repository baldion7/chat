import React, { useEffect, useState } from 'react';
import { getMessages } from '../api/chat.js';
import { MessageList } from '../components/MessageList.jsx';
import { MessageForm } from '../components/MessageForm.jsx';
import {ProfileEditModal} from "../components/ProfileEditModal.jsx";

export const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");
    const [showProfileModal, setShowProfileModal] = useState(false)

    const fetchMessages = async () => {
        try {
            const response = await getMessages();
            setMessages(response);
        } catch (error) {
            console.log("Error al enviar el mensaje:", error);
        }
    };

    useEffect(() => {
        setUsername(localStorage.getItem("chatUsername"));
        fetchMessages();

        const interval = setInterval(() => {
            fetchMessages();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="chat-container">
            <div>Chat de {username}</div>
            <div>
                <button onClick={() => setShowProfileModal(true)}>Editar Perfil</button>
                {showProfileModal && <ProfileEditModal onClose={() => setShowProfileModal(false)} username={username} onProfileUpdated={fetchMessages} />}
            </div>
            <MessageList messages={messages} />
            <MessageForm onMessageSent={fetchMessages} />
        </div>
    );
};
