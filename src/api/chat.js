const ApiUrl = "http://localhost:8000/chat/";

export const createMesage = async (username, content) => {
    console.log(username, content)
    try {
        const response = await fetch(ApiUrl+"create_message/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                content: content,
            }),
        });
        return response.json();
    }catch (error) {
        console.log("Error al enviar el mensaje: ", error)
    }
}

export const getMessages = async () => {
    try {
        const response = await fetch(ApiUrl+"get_messages/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }catch (error) {
        console.log("Error al enviar el mensaje: ", error)
    }
}