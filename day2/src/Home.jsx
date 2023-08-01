import { NavLink } from "react-router-dom";
import { Books } from "./books";

export const Home = () => {
	return (
		<h1>
			<NavLink to="/registration">Registration</NavLink><br></br>	
			<NavLink to="/login">UserLogin</NavLink> <br></br>		
			<NavLink to="/books">Books</NavLink><br></br>			

		</h1>
	);

};
