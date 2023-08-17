import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { useAuthContext } from "../../Context/auth";
import categoryService from "../../Service/category.service"
import bookService from "../../Service/book.service";
import "./BookList.css"
import { defaultFilter } from "../../Constant/constant";
import { useCartContext } from "../../Context/cartContext";
import Shared from "../../Utils/Shared";
import { toast } from "react-toastify";

export const BookList = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const [bookResponse, setBookResponse] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [categories, setCategories] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState(); // Declare selectedSortOption
  const [filters, setFilters] = useState(defaultFilter);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookResponse(res);
    });
  };

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  const books = useMemo(() => {
    const bookList = [...bookResponse.items];
    if (bookList) {
      bookList.forEach((element) => {
        element.category = categories.find(
          (a) => a.id === element.categoryId
        )?.name;
      });
      return bookList;
    }
    return [];
  }, [categories, bookResponse]);

  const addToCart = (book) => {
    const isBookInCart = cartContext.cartData.some((cartItem) => cartItem.book.id === book.id);

    if (isBookInCart) {
      Shared.removeFromCart(book, authContext.user.id).then((res) => {
        if (res.error) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          cartContext.updateCart();
        }
      });
    } else {
      Shared.addToCart(book, authContext.user.id).then((res) => {
        if (res.error) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          cartContext.updateCart();
        }
      });
    }
  };

const sortBooks = (e) => {
  setSelectedSortOption(e.target.value);
  const bookList = [...bookResponse.items];
  
  switch (e.target.value) {
    case "a-z":
      bookList.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "z-a":
      bookList.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-low-to-high":
      bookList.sort((a, b) => a.price - b.price);
      break;
    case "price-high-to-low":
      bookList.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }
  
  setBookResponse({ ...bookResponse, items: bookList });
};


  return (
    <div className="book-list-container">
      <div className="search-and-sort-controls">
    <div className="search-controls">
      <TextField
        label="Search Books..."
        variant="outlined"
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
      />
    </div>
    <Grid container justifyContent="flex-end">
      <div className="sorting-controls">
        <span className="sorting-label">Sort By:</span>
        <FormControl className="sorting-select">
          <Select
            value={selectedSortOption}
            onChange={sortBooks}
          >
            <MenuItem value="none">All</MenuItem>
            <MenuItem value="a-z">A - Z</MenuItem>
            <MenuItem value="z-a">Z - A</MenuItem>
            <MenuItem value="low-to-high">Price: Low to High</MenuItem>
            <MenuItem value="high-to-low">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </div>
    </Grid>
  </div>
      
    <div className="books-list">
      {books.map((book, index) => (
        <div key={index} className="book-item">
          <div className="book-image">
            <img src={book.base64image} alt="dummyimage" />
          </div>
          <div className="book-details">
            <Typography variant="h3">{book.name}</Typography>
            <span className="category">{book.category}</span>
            <p className="description">{book.description}</p>
          </div>
          <div className="book-price">
            <p className="discount-price">MRP &#8377; {book.price}</p>
          </div>
          <div className="add-to-cart-button">
              <Button
                type="submit"
                variant="contained"
                color={cartContext.cartData.some((cartItem) => cartItem.book.id === book.id) ? "secondary" : "primary"}
                disableElevation
                onClick={() => addToCart(book)}
              >
                {cartContext.cartData.some((cartItem) => cartItem.book.id === book.id)
                  ? "Remove from Cart"
                  : "Add to Cart"}
              </Button>
            </div>
        </div>
      ))}
    </div>
    <div className="pagination-wrapper">
      <Pagination
        count={bookResponse.totalPages}
        page={filters.pageIndex}
        onChange={(e, newPage) => {
          setFilters({ ...filters, pageIndex: newPage });
        }}
      />
    </div>
  </div>
  );
};
