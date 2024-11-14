
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Lobby} from "./page/Lobby.jsx";
import {Chat} from "./page/Chat.jsx";

function App() {

  return (
    <>
     <BrowserRouter>
       <Routes>
         <Route path="/" element={<Lobby />} />
         <Route path="/chat" element={<Chat />} />
       </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
