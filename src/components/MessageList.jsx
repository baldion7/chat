import React from 'react';


export const MessageList = ({messages}) => {
    return (
        <div className="message-list">
            {messages?.map(message => (
                <div key={message.id} className="message-item">
                    <img
                        src={message.author.profile_picture !== null ? `https://chat-backen-virid.vercel.app/${message.author.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt={message.author.name} width={50} height={50}
                        style={{borderRadius: "100%", objectFit: "cover"}}/>
                    <span><b>{message.author.name}:</b> {message.content}</span>
                </div>
            ))}
        </div>
    );
}