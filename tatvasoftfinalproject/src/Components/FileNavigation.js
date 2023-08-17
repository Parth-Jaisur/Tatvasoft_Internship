import React from "react";
import { Route, Routes } from "react-router-dom";
import { Paths } from "../Utils/enum";
import { LoginForm } from "../Forms/Login/LoginForm";
import {RegistrationForm} from "../Forms/Register/RegistrationForm";
import Profile from "../Main/User/Profile";
import { Home } from "../Main/Home";
import { BookList } from "../Main/User/BookList";
import { Book } from "../Main/Seller/Book";
import { useAuthContext } from "../Context/auth";
import EditBook from "../Main/Seller/EditBook";
import { Navigate } from "react-router-dom";
import { User } from "../Main/User/User";
import EditUser from "../Main/User/EditUser";
import { Category } from "../Main/Category/Category";
import EditCategory from "../Main/Category/EditCategory";
import Cart from "../Main/cart";

export const FileNavigation = () => {
  const authContext= useAuthContext();
  const Redirect = <Navigate to={Paths.LoginForm} />;
  return (
    <Routes>
      <Route exact path={Paths.LoginForm} element={<LoginForm />} />
      <Route exact path={Paths.RegistrationForm} element={<RegistrationForm/>}/>
      <Route exact path={Paths.Profile} element={<Profile />} />
      <Route exact path={Paths.Home} element={<Home />} />
      <Route exact path={Paths.BookList} element={authContext.user.id ? <BookList /> : Redirect}/>
      <Route exact path={Paths.Book} element={authContext.user.id ? <Book /> : Redirect}/>
      <Route exact path={Paths.EditBook} element={authContext.user.id ? <EditBook /> : Redirect}/>
      <Route exact path={Paths.AddBook} element={authContext.user.id ? <EditBook/> :Redirect}/>
      <Route exact path={Paths.User} element={authContext.user.id ? <User/> :Redirect}/>
      <Route exact path={Paths.EditUser} element={authContext.user.id ? <EditUser /> : Redirect}/>
      <Route exact path={Paths.Category} element={authContext.user.id ? <Category/> :Redirect}/>
      <Route exact path={Paths.EditCategory} element={authContext.user.id ? <EditCategory/> :Redirect}/>
      <Route exact path={Paths.AddCategory} element={authContext.user.id ? <EditCategory/> :Redirect}/>
      <Route exact path={Paths.Cart} element={authContext.user.id ? <Cart/> :Redirect}/>
    </Routes>
  );
};
