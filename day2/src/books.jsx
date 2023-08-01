export const Books = ({arr}) =>{
	const books = arr;
	return(books.map((item) => {
		return (<h1>{item}</h1>);
	 }));
	
	//console.log(book);
}