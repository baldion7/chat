
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Lobby} from "./page/Lobby.jsx";
import {Chat} from "./page/Chat.jsx";
import {ChatLost} from "./page/ChatLost.jsx";

function App() {

  return (
    <>
     <BrowserRouter>
       <Routes>
         <Route path="/" element={<Lobby />} />
         <Route path="/chat" element={<Chat />} />
           <Route path="/chatlost" element={<ChatLost />} />
       </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
