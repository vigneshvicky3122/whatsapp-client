import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./Components/Chat";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import "./App.css";
import Otp from "./Components/Otp";
import SetProfile from "./Components/SetProfile";
export const URL = process.env.REACT_APP_BACKEND_URL;
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/chats" />} />
          <Route path="chats" element={<Chat />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="verification/otp/:id" element={<Otp />} />
          <Route path="profile/set" element={<SetProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
