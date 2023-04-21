import Chat from "./Components/Chat";
import "./App.css";
export const URL = process.env.REACT_APP_BACKEND_URL;
function App() {
  return (
    <>
      <Chat />
    </>
  );
}

export default App;
