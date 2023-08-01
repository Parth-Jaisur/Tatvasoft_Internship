import './App.css';
import {Home} from "./Home";
import { Login } from './Login';
import { Header } from './Header';
import { Books } from './books';
import { Footer } from './footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Registration } from './registration';
function App() {
  const firstname = "Parth";
  const books = ["book1", "book2", "book3", "book4"];
  return (
   
    <div className="App">
     <Header/> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="registration" element={<Registration firstname={firstname} />}></Route> 
          <Route path="login" element={<Login />}></Route>
          <Route path="books" element={<Books arr={books} />}></Route>
        </Routes>
      </BrowserRouter> 
     
      <Footer />
    </div>
      
  );
}

export default App;
