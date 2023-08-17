import React, { useMemo, useState } from "react";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, List, ListItem, TextField } from "@material-ui/core";
import { useAuthContext } from "../Context/auth";
import Shared from "../Utils/Shared";
import bookService from "../Service/book.service";
import SearchIcon from "@material-ui/icons/Search";
import { ShoppingCart } from "@material-ui/icons";
import SearchResults from "./SearchResult";
import { useCartContext } from '../Context/cartContext';
import { toast } from "react-toastify";
import { Paths } from "../Utils/enum";

const Header = () =>{ 
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const [query, setQuery] = useState("");
  const [bookList, setBookList] = useState([]);
  const [openSearchResult, setOpenSearchResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const openMenu = () => {
    document.body.classList.toggle("open-menu");
  };

  const items = useMemo(() => {
    return Shared.NavigationItems.filter(
      (item) =>
        !item.access.length || item.access.includes(authContext.user.roleId)
    );
  }, [authContext.user]);

  const logOut = () => {
    authContext.signOut();
  };

  const searchBook = async () => {
    setLoading(true);
    try {
      const res = await bookService.searchBook(query);
      setBookList(res);
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    document.body.classList.add("search-results-open");
    searchBook();
    setOpenSearchResult(true);
  };

  const closeSearchResults = () => {
    setOpenSearchResult(false);
  };

    const addToCart = (book) => {
    if (!authContext.user.id) {
      navigate(Paths.LoginForm);
      toast.error("Please login before adding books to cart");
    } else {
      Shared.addToCart(book, authContext.user.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Item added in cart");
          cartContext.updateCart();
        }
      });
    }
  };

  return (
    <header>
      <h1 className="header-title">E-Book Seller</h1>
      <div className="header-links">
        <div className="navigate-links">
          <div className="search-bar">
            <TextField
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              variant="outlined"
              style={{ marginRight: 10, backgroundColor: "white" }}
            />
            <Button
              onClick={search}
              className="searchButton"
              style={{ backgroundColor: "blue", color: "white" }}
              disabled={loading}
            >
              <SearchIcon className="searchIcon" />
              Search
            </Button>
          </div>
          <List className="nav-list">
            <ListItem className="navlink">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </ListItem>
            {items.map((item, index) => (
              <ListItem key={index} className="nav-item">
                <Link to={item.route} title={item.name} className="nav-link">
                  {item.name}
                </Link>
              </ListItem>
            ))}
            {authContext.user.id ? (
              <>
                <List className="nav_cart-country-wrap">
                  <ListItem className="cart-link">
                    <Link to="/cart" title="Cart" className="nav_cart-button">
                     <span className="nav_cart-count">{cartContext.cartData.length}</span> 
                      <ShoppingCart className="nav_cart-icon" />
                      Cart
                    </Link>
                  </ListItem>
                </List>
                <ListItem className="nav-item">
                  <Button
                    onClick={() => logOut()}
                    color="primary"
                    variant="contained"
                    className="logout-button"
                  >
                    Log out
                  </Button>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem className="nav-item">
                  <Link to="/LoginForm" title="Login" className="nav-link">
                    Login
                  </Link>
                </ListItem>
                <ListItem className="nav-item">
                  <Link to={"/RegistrationForm"} className="nav-link">
                    Register
                  </Link>
                </ListItem>
              </>
            )}
          </List>
        </div>
      </div>
      {/* Display search results */}
      {openSearchResult && (
        <div className="search-results">
          <SearchResults
            bookList={bookList}
            loading={loading}
            onClose={closeSearchResults}
          />
          </div>
      )}
    </header>
  );
};

export default Header;
