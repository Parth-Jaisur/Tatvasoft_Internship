import './Home.css'
import { BookList } from './User/BookList';
export const Home =()=>{

    return(
      <div className="home-page">
        <main>       
            <BookList/>
        </main>
      </div> 
    );
}

