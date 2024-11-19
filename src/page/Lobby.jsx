import {useState} from "react";
import {useNavigate} from "react-router-dom";

export const Lobby = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        localStorage.setItem("chatUsername", username);

        navigate("/chat");
    }

    return (
        <div className={"lobby"}>
            <h1>Lobby Chat</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Escribe tu nombre de usuario"
                    required
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};
