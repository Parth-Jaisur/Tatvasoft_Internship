// SearchResults.js
import React from "react";
import { CircularProgress } from "@material-ui/core";
import { Card, CardContent, Typography, Button, Grid, Link } from "@material-ui/core";

const SearchResults = ({ bookList, loading, onClose }) => {
	
	return (
		<div className="search-results-overlay" onClick={onClose}>
			<div className="search-results-content" onClick={(e) => e.stopPropagation()}>
				{loading ? (
					 <CircularProgress /> 
				) : bookList.length === 0 ? (
					<p>No results found.</p>
				) : (
					<ul>
						{bookList.map((book) => (
							<Card variant="outlined" style={{ marginBottom: "20px" }}>
								<CardContent>
									<Grid container spacing={2}>
										<Grid item xs={4}>
											<Typography variant="h6" gutterBottom>
												{book.name}
											</Typography>
											<Typography color="textSecondary" gutterBottom>
												{book.description}
											</Typography>

										</Grid>
										<Grid item xs={4}>
										</Grid>
										<Grid item xs={4} style={{ textAlign: "right" }}>
											<Typography variant="subtitle1" gutterBottom>
												{book.price}
											</Typography>
											<Link
												component="button"
												variant="body2"
												onClick={()=>{}}
												style={{
													// display: "block",
													// marginTop: "10px",
													padding: "6px 12px",
													backgroundColor: "#007bff",
													color: "#fff",
													borderRadius: "4px",
													border: "none",
													cursor: "pointer",
													textDecoration: "none",
													textAlign: "center",
													whiteSpace: "nowrap",
													//  lineHeight: "1.5",
													transition: "background-color 0.3s ease-in-out",
												}}
											>
												Add to Cart
											</Link>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default SearchResults;
