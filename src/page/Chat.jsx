import React, {useEffect, useState} from 'react';
import {ApiUrl, DeleteMessage, getMessages, updateStatus} from '../api/chat.js';
import {MessageList} from '../components/MessageList.jsx';
import {MessageForm} from '../components/MessageForm.jsx';
import {ProfileEditModal} from "../components/ProfileEditModal.jsx";


export const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [User, setUser] = useState()
    const [onDeleteMessage, setOnDeleteMessage] = useState()

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


    useEffect(() => {
        if (username) {
            handleUpdateState(true, username)
        }
    }, [username]);


    const handleUpdateState = async (formData) => {
        try {
            const response = await updateStatus(formData, username)
            setUser(response)
        } catch (error) {
            console.log("Error al enviar el mensaje: ", error)
        }
    }

    function enviarDatosAntesDeSalir() {
        if (User.id) {
            // Crear un objeto con los datos
            const datos = JSON.stringify({state: false});

            // Crear un Blob con el tipo de contenido correcto
            const blob = new Blob([datos], {
                type: 'application/json'
            });

            // Enviar los datos usando sendBeacon
            navigator.sendBeacon(ApiUrl + "authors/" + User.id + "/state/", blob);
        }
    }

    window.addEventListener('beforeunload', enviarDatosAntesDeSalir);

    useEffect(() => {
        handleDeleteMessage()

    }, [onDeleteMessage]);

    const handleDeleteMessage = async () => {
        try {
            await DeleteMessage(onDeleteMessage)
            await fetchMessages()
        } catch (error) {
            console.log("Error al enviar el mensaje: ", error)
        }
    }

    return (
        <div className="chat-container">
            <div>Chat de {username}</div>
            <div>
                <button onClick={() => setShowProfileModal(true)}>Editar Perfil</button>
                {showProfileModal && <ProfileEditModal onClose={() => setShowProfileModal(false)} username={username}
                                                       onProfileUpdated={fetchMessages}/>}
            </div>
            {User &&  <MessageList messages={messages} username={User} onDeleteMessage={setOnDeleteMessage}/>}
            <MessageForm onMessageSent={fetchMessages}/>
        </div>
    );
};
