import { useState } from "react";
import { updateProfilePictore } from "../api/chat.js";

export const ProfileEditModal = ({ onClose, username, onProfileUpdated }) => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Validaciones básicas
            if (!profilePicture) {
                throw new Error('Por favor selecciona una imagen');
            }

            // Validar el tipo de archivo
            if (!profilePicture.type.startsWith('image/')) {
                throw new Error('El archivo debe ser una imagen');
            }

            // Validar el tamaño del archivo (por ejemplo, máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (profilePicture.size > maxSize) {
                throw new Error('La imagen no debe superar los 5MB');
            }

            const formData = new FormData();
            formData.append("profile_picture", profilePicture);

            const response = await updateProfilePictore(formData, username);

            if (response) {
                onProfileUpdated();
                onClose();
            }
        } catch (error) {
            setError(error.message || 'Error al actualizar el perfil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        setError(null); // Limpiar errores previos
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Editar Perfil</h2>
                {error && (
                    <div className="error-message" style={{
                        color: 'red',
                        marginBottom: '10px'
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="profilePicture">Subir Foto de Perfil:</label>
                    <input
                        type="file"
                        id="profilePicture"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                        disabled={isLoading}
                        style={{ marginTop: "10px" }}
                    />
                    {profilePicture && (
                        <div style={{ marginTop: "10px" }}>
                            <img
                                src={URL.createObjectURL(profilePicture)}
                                alt="Vista previa"
                                style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px"
                                }}
                            />
                        </div>
                    )}
                    <div style={{ marginTop: "20px" }}>
                        <button
                            type="submit"
                            disabled={isLoading || !profilePicture}
                            style={{ marginRight: "10px" }}
                        >
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};