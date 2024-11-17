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
        const response = await fetch(ApiUrl + "authors/" + username+"/", {
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
        const author = await getAuthorByUsername(username);
        if (!author?.id) {
            throw new Error('No se pudo obtener el ID del autor');
        }

        const response = await fetch(ApiUrl + "authors/" + author.id + "/profile_picture/", {
            method: "POST",
            // Removemos el header Content-Type para que el navegador establezca el correcto con el boundary
            body: formData,
            // Agregamos credentials si es necesario para las cookies
            credentials: 'include',
        });

        if (!response.ok) {
            // Intentamos obtener el mensaje de error del servidor
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Error ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error al actualizar la foto de perfil:", error);
        throw error; // Re-lanzamos el error para manejarlo en el componente
    }
}