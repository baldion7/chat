export const ApiUrl = "https://chat-backen-virid.vercel.app/chat/";

export const createMesage = async (data) => {
    try {
        const response = await fetch(ApiUrl + "create_message/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    username: data.username,
                    content: data.content,
                    image: data.image,
                    pdf: data.pdf
                }
            ),
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
        const response = await fetch(ApiUrl + "authors/" +username+"/", {
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
        const response = await fetch(ApiUrl + "authors/" + author?.id + "/profile_picture/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    profile_picture: formData
                }
            ),
        });
        return response.json();
    } catch (error) {
        console.log("Error al enviar el mensaje: ", error)
    }
}

export const updateStatus = async (formData, username) => {
    try {
        const author = await getAuthorByUsername(username)
        const response = await fetch(ApiUrl + "authors/" + author?.id + "/state/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    state: formData
                }
            ),
        });
        return response.json();
    } catch (error) {
        console.log("Error al enviar el mensaje: ", error)
    }
}

export const DeleteMessage = async (formData) => {
    try {
        const response = await fetch(ApiUrl + "delete_message/" + formData + "/", {
            method: "DELETE",

        });

        return response.json();
    } catch (error) {
        console.log("Error al enviar el mensaje: ", error)
    }
}