import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Home from './component/Home';
import Signup from './component/Signup';
import Notes from './component/Notes'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/note' element={<Notes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
