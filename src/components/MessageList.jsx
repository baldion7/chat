import React from 'react';


export const MessageList = ({ messages }) => (
    <div className="message-list">
        {messages?.map(message => (
            <div key={message.id} className="message-item">
                <span><b>{message.author.name}:</b> {message.content}</span>
            </div>
        ))}
    </div>
);
