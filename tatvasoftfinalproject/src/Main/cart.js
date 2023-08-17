import React, { useEffect, useState } from "react";
import { useAuthContext } from "../Context/auth";
import { toast } from "react-toastify";
import cartService from "../Service/cart.service";
import orderService from "../Service/order.service";
import Shared from "../Utils/Shared";
import { useCartContext } from "../Context/cartContext";
import { useNavigate } from "react-router-dom";
import { Typography, Link, Button, Card, CardContent, List, IconButton, ListItemText } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import "./cart.css";

const Cart = () => {
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const navigate = useNavigate();

  const [cartList, setCartList] = useState([]);
  const [itemsInCart, setItemsInCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const getTotalPrice = (itemList) => {
    let totalPrice = 0;
    itemList.forEach((item) => {
      const itemPrice = item.quantity * parseInt(item.book.price);
      totalPrice = totalPrice + itemPrice;
    });
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    setCartList(cartContext.cartData);
    setItemsInCart(cartContext.cartData.length);
    getTotalPrice(cartContext.cartData);
  }, [cartContext.cartData]);

  const removeItem = async (id) => {
    try {
      const res = await cartService.removeItem(id);
      if (res) {
        cartContext.updateCart();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const updateQuantity = async (cartItem, inc) => {
    const currentCount = cartItem.quantity;
    const quantity = inc ? currentCount + 1 : currentCount - 1;
    if (quantity === 0) {
      toast.error("Item quantity should not be zero");
      return;
    }

    try {
      const res = await cartService.updateItem({
        id: cartItem.id,
        userId: cartItem.userId,
        bookId: cartItem.book.id,
        quantity,
      });
      if (res) {
        const updatedCartList = cartList.map((item) =>
          item.id === cartItem.id ? { ...item, quantity } : item
        );
        cartContext.updateCart(updatedCartList);
        const updatedPrice =
          totalPrice +
          (inc ? parseInt(cartItem.book.price) : -parseInt(cartItem.book.price));
        setTotalPrice(updatedPrice);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const placeOrder = async () => {
    if (authContext.user.id) {
      const userCart = await cartService.getList(authContext.user.id);
      if (userCart.length) {
        try {
          let cartIds = userCart.map((element) => element.id);
          const newOrder = {
            userId: authContext.user.id,
            cartIds,
          };
          const res = await orderService.placeOrder(newOrder);
          if (res) {
            cartContext.updateCart();
            navigate("/");
            toast.success(Shared.messages.ORDER_SUCCESS);
          }
        } catch (error) {
          toast.error(`Order cannot be placed ${error}`);
        }
      } else {
        toast.error("Your cart is empty");
      }
    }
  };

  return (
    <div>
      <Typography variant="h1">Cart page</Typography>
      <div className="cart-summary">
        <Typography variant="h2">
          My Shopping Bag ({itemsInCart} Items)
        </Typography>
        <Typography variant="h5" className="cart-total">Total price: {totalPrice}</Typography>
      </div>
      <Card>
        <CardContent>
          <List>
            <div className="cart-items">
              {cartList.map((cartItem) => (
                <div className="cart-item" key={cartItem.id}>
                  <div className="item-image">
                    <Link>
                      <img src={cartItem.book.base64image} alt="dummy-pic" />
                    </Link>
                  </div>
                  <div className="cart-item-text">
                    <ListItemText
                      primary={cartItem.book.name}
                      secondary={cartItem.book.price} />
                  </div> 
                  <div className="cart-quantity-container">
                    <IconButton
                      className="cart-button"
                        onClick={() => updateQuantity(cartItem, true)}
                      >
                        <AddIcon />
                      </IconButton>
                      <div className="cart-quantity">{cartItem.quantity}</div>
                    <IconButton
                      className="cart-button"
                        onClick={() => updateQuantity(cartItem, false)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </div>
                    <div className="item-actions">
                    <IconButton
                      className="cart-button" 
                      edge="end" aria-label="delete" 
                      onClick={() => removeItem(cartItem.id)}>
                        <DeleteIcon /> 
                      </IconButton>
                    </div>
                  
                </div>
              ))}
            </div>
          </List></CardContent></Card>
      <Typography variant="h5" className="cart-total">
        Total: {totalPrice}
      </Typography>
           <Button variant="contained" color="primary" className="place-order-btn" onClick={placeOrder}>
        Place Order
      </Button>
    </div>
  );
};

export default Cart;
