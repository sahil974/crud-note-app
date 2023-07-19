import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './component/style/login-sign.css'
import "./component/style/notes.css";
import Login from './component/Login';
import Signup from './component/Signup';
import Notes from './component/Notes'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/note' element={<Notes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
