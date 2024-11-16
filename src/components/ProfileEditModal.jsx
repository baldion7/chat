import {useState} from "react";
import {updateProfilePictore} from "../api/chat.js";

export const ProfileEditModal = ({onClose,username,onProfileUpdated}) => {
    const [profilePicture, setProfilePicture] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("profile_picture", profilePicture);
        try {
           const response = await updateProfilePictore(formData,username);
           if (response.status === 200) {
               onProfileUpdated();
               onClose();
           }

        }catch (error) {
            console.log("Error al actualizar el perfil: ", error)
        }

    };

    const hadleFileChange = async (e) => {
        setProfilePicture(e.target.files[0])
    };

    return (
        <>
            <div className={"modal"}>
                <div className={"modal-content"}>
                    <h2>Editar Perfil</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="profilePicture">Subir Foto de Perfil:</label>
                        <input type="file" style={{marginTop: "10px"}} id="profilePicture" onChange={hadleFileChange} name={"profile_picture"} accept={"image/*"} required/>
                        <button type="submit" style={{marginTop: "20px", marginBottom: "20px"}}>Guardar</button>
                        <button type="button">Cancelar</button>
                    </form>
                    <div/>
                </div>
            </div>
        </>
    )
}