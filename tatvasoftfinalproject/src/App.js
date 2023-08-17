import "./App.css";
import { AuthWrapper } from "./Context/auth";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";
import { FileNavigation } from "./Components/FileNavigation";
import Header from "./pageComponent/Header";
import Footer from "./pageComponent/Footer";
import { CartWrapper } from "./Context/cartContext";
function App() {
  return (
    <BrowserRouter>
    <AuthWrapper>
    <CartWrapper>
       <ThemeProvider>
        <CssBaseline /> 
        <Header/>
        <div className="App">
          <FileNavigation/>
          
          <ToastContainer />
        </div>
        <Footer/>
      </ThemeProvider>
      </CartWrapper>
      </AuthWrapper>
   
    </BrowserRouter>
  );
}

export default App;
