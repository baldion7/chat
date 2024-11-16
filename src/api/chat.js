const ApiUrl = "https://chat-backen-virid.vercel.app/chat/";

export const createMesage = async (username, content) => {
    console.log(username, content)
    try {
        const response = await fetch(ApiUrl + "create_message/", {
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
    } catch (error) {
        console.log("Error al enviar el mensaje: ", error)
    }
}

export const getMessages = async () => {
    try {
        const response = await fetch(ApiUrl + "get_messages/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    } catch (error) {
        console.log("Error al enviar el mensaje: ", error)
    }
}

export const getAuthorByUsername = async (username) => {
    try {
        const response = await fetch(ApiUrl + "authors/" + username, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    } catch (error) {
        console.log("Error al enviar el mensaje: ", error)
    }
}

export const updateProfilePictore = async (formData, username) => {
    try {
        const author = await getAuthorByUsername(username)
        const response = await fetch(ApiUrl + "authors/" + author?.id + "/profile_picture", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: formData
        });
        return response.json();
    } catch (error) {
        console.log("Error al enviar el mensaje: ", error)
    }
}