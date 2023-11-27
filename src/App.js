import './App.css';
import Login from "./login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignUp from "./singup";
import Recover from "./recover";
import Home from "./home";
import MakeBill from "./makebill";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/recover" element={<Recover />} />
              <Route path="/home" element={<Home />} />
              <Route path="/makebill" element={<MakeBill />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;