import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./Components/Chat";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

export const URL = process.env.REACT_APP_BACKEND_URL;
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to={"/chats"} />} />
          <Route path="chats" element={<Chat />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
