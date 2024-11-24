import {useState, useEffect, useRef} from 'react';
import {ApiUrl, createMesage, DeleteMessage, getMessages, updateStatus} from '../api/chat.js';
import {Paperclip, ImageIcon, Send, Trash2, Edit} from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    Input,
    ScrollArea
} from "../components/Componentes.tsx";
import {ProfileEditModal} from "../components/ProfileEditModal.jsx";


export const Chat = () => {
    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessage] = useState('')
    const [username, setUsername] = useState('')
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [user, setUser] = useState(null)
    const fileInputRef = useRef(null)
    const imageInputRef = useRef(null)

    const fetchMessages = async () => {
        try {
            const response = await getMessages()
            setMessages(response)
            console.log(response)
        } catch (error) {
            console.log("Error al obtener mensajes:", error)
        }
    }

    useEffect(() => {
        setUsername(localStorage.getItem("chatUsername"));

        console.log(username)

        fetchMessages()

        const interval = setInterval(() => {
            fetchMessages()
        }, 1500)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (username) {
            handleUpdateState(true, username)
        }
    }, [username])

    const handleUpdateState = async (state, username) => {
        try {
            const response = await updateStatus(state, username)
            setUser(response)
        } catch (error) {
            console.log("Error al actualizar el estado: ", error)
        }
    }

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (user?.id) {
                const data = JSON.stringify({state: false})
                navigator.sendBeacon(`${ApiUrl}authors/${user.id}/state/`, data)
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [user])

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (user?.id) {
                const data = JSON.stringify({state: false});
                navigator.sendBeacon(`${ApiUrl}authors/${user.id}/state/`, data);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [user]);


    const handleDeleteMessage = async (messageId) => {
        try {
            await DeleteMessage(messageId)
            await fetchMessages()
        } catch (error) {
            console.log("Error al eliminar el mensaje: ", error)
        }
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })
    }

    const handleSendMessage = async () => {
        if (inputMessage.trim() || fileInputRef.current.files[0] || imageInputRef.current.files[0]) {
            const formData = {
                username,
                content: inputMessage.trim(),
                image: "",
                pdf: "",
            }

            try {
                if (fileInputRef.current.files[0]) {
                    formData.pdf = await convertToBase64(fileInputRef.current.files[0])
                }

                if (imageInputRef.current.files[0]) {
                    formData.image = await convertToBase64(imageInputRef.current.files[0])
                }

                await createMesage(formData)
                setInputMessage('')
                fileInputRef.current.value = ''
                imageInputRef.current.value = ''
                fetchMessages()
            } catch (error) {
                console.error("Error al enviar el mensaje:", error)
            }
        }
    }

    const formatearFecha = (fechaISO) => {
        const fecha = new Date(fechaISO)
        return fecha.toLocaleString()
    }

    const shortenUrl = (url) => {
        const maxLength = 30
        return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
    }

    const formatMessage = (content) => {
        if (!content) return null

        const urlRegex = /(https?:\/\/[^\s]+)/g

        if (!content.match(urlRegex)) {
            return <span className="message-text">{content}</span>
        }

        const parts = content.split(urlRegex)
        const matches = content.match(urlRegex)

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
                        className="text-blue-500 underline"
                    >
                        {shortenUrl(part)}
                    </a>
                )
            }
            return <span key={i}>{part}</span>
        })}
      </span>
        )
    }

    const downloadBase64PDF = (base64Data, fileName = 'documento.pdf') => {
        try {
            const base64Clean = base64Data.replace(/^data:application\/pdf;base64,/, '')
            const byteCharacters = atob(base64Clean)
            const byteNumbers = new Array(byteCharacters.length)

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }

            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], {type: 'application/pdf'})
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setTimeout(() => {
                window.URL.revokeObjectURL(url)
            }, 100)
        } catch (error) {
            console.error('Error al descargar el PDF:', error)
            alert('Error al descargar el PDF. Por favor, intente nuevamente.')
        }
    }

    const renderMessage = (message) => {
        const isCurrentUser = message.author.id === user?.id

        return (
            <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={message.author.profile_picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                     alt={message.author.name}/>
                        <AvatarFallback>{message.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`mx-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center mb-1">
                            <span className="font-semibold mr-2">{message.author.name}</span>
                            <span
                                className={`w-2 h-2 rounded-full ${message.author.state ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </div>
                        <div className="bg-primary-foreground p-2 rounded-lg">
                            {formatMessage(message.content)}
                            {message.image && (
                                <img src={message.image} alt="Shared image" className="max-w-xs rounded mt-2"/>
                            )}
                            {message.pdf && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadBase64PDF(message.pdf, `documento_${message.id}.pdf`)}
                                    className="mt-2"
                                >
                                    Descargar PDF
                                </Button>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                                {formatearFecha(message.create_at)}
                            </div>
                        </div>
                    </div>
                    {isCurrentUser && (
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMessage(message.id)}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Chat de {username}</h2>
                <Button variant="outline" onClick={() => setShowProfileModal(true)}>
                    <Edit className="h-4 w-4 mr-2"/>
                    Editar Perfil
                </Button>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[600px] w-full pr-4">
                    {messages.map(renderMessage)}
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        style={{display: 'none'}}
                    />
                    <Button variant="outline" size="icon" onClick={() => fileInputRef.current.click()}>
                        <Paperclip className="h-4 w-4"/>
                    </Button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        style={{display: 'none'}}
                    />
                    <Button variant="outline" size="icon" onClick={() => imageInputRef.current.click()}>
                        <ImageIcon className="h-4 w-4"/>
                    </Button>
                    <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4"/>
                    </Button>
                </div>
            </CardFooter>
            {showProfileModal && (
                <ProfileEditModal
                    onClose={() => setShowProfileModal(false)}
                    username={username}
                    onProfileUpdated={fetchMessages}
                />
            )}
        </Card>
    )
}