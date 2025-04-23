import React, { useEffect, useState, useRef } from 'react';
import { useChannel } from 'ably/react';

export default function DisplayAbly() {
    const inputBox = useRef<HTMLTextAreaElement | null>(null);
    const messageEnd = useRef<HTMLDivElement | null>(null);
    const [messageText, setMessageText] = useState('');
    const [receivedMessages, setMessages] = useState<any[]>([]);
    const messageTextIsEmpty : any = messageText.trim().length === 0;

    const { channel, ably } = useChannel('test-ably', (message) => {
        console.warn("CHANNEL : " , channel)
        console.log("CLIENT : " , ably)
        console.warn("Client ID:", ably.auth.clientId); // Affiche l'ID du client
        console.warn("Connection ID:", ably.connection.id); // Affiche l'ID de la connexion
        const history = receivedMessages.slice(-199);
        setMessages([...history, message]);
      });

    const sendChatMessage = (messageText: string) => {
        channel.publish({ name: 'chat-message', data: messageText });
        setMessageText('');
    };

    const handleFormSubmission = (event: any) => {
        event.preventDefault();
        sendChatMessage(messageText);
    };

    const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? 'me' : 'other';
    return (
        <span key={index} data-author={author}>
        {message.data}
        </span>
    );
    });

    return(
        <>
        <div>
            {messages}
            <div ref={messageEnd}></div>
            <form onSubmit={handleFormSubmission}>
                <textarea
                ref={inputBox}
                value={messageText}
                placeholder="Type a message..."
                onChange={(e) => setMessageText(e.target.value)}
                ></textarea>
                <button type="submit" disabled={messageTextIsEmpty}>
                Send
                </button>
            </form>
        </div>
        </>
    )
}