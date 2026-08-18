import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/config";
import "./Checkout.css";

function Checkout({
  cart,
  clearCart
}) {

  const navigate = useNavigate();

  const { token } = useAuth();

  const [loading, setLoading] =
    useState(false);


  // =========================
  // CALCULATE TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.food.price) *
      Number(item.quantity),
    0
  );


  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async () => {

    if (cart.length === 0) {

      alert("Your cart is empty");

      return;

    }


    if (!token) {

      alert("Please login first");

      navigate("/login");

      return;

    }


    setLoading(true);


    try {

      // =========================
      // CONVERT CART
      // =========================

      const items = cart.map(
        (item) => ({

          foodId: item.food.id,

          quantity:
            Number(item.quantity)

        })
      );


      console.log(
        "Sending order:",
        items
      );


      // =========================
      // SEND ORDER
      // =========================

      const response =
        await fetch(
  `${API_URL}/orders`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`

            },

            body: JSON.stringify({
              items: items
            })

          }
        );


      const data =
        await response.json();


      console.log(
        "Order response:",
        data
      );


      // =========================
      // ERROR
      // =========================

      if (!response.ok) {

        alert(
          data.message ||
          "Failed to create order"
        );

        return;

      }


      // =========================
      // SUCCESS
      // =========================

      clearCart();


      navigate(
        "/order-success"
      );


    } catch (error) {

      console.error(
        "Place order error:",
        error
      );

      alert(
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {

    return (

      <div className="checkout">

        <h1>
          Checkout
        </h1>

        <p>
          Your cart is empty.
        </p>

        <button
          onClick={() =>
            navigate("/menu")
          }
        >
          Go to Menu
        </button>

      </div>

    );

  }


  // =========================
  // PAGE
  // =========================

  return (

    <div className="checkout">

      <h1>
        Checkout
      </h1>


      {/* =====================
          ORDER ITEMS
      ===================== */}

      <div className="checkout-items">

        {cart.map(
          (item) => (

            <div
              className="checkout-item"
              key={item.food.id}
            >

              <img
                src={item.food.image}
                alt={item.food.name}
              />


              <div>

                <h3>
                  {item.food.name}
                </h3>

                <p>
                  Quantity:{" "}
                  {item.quantity}
                </p>

                <p>
                  Price: Rs.{" "}
                  {item.food.price}
                </p>

              </div>


              <strong>

                Rs.{" "}

                {(
                  Number(
                    item.food.price
                  ) *
                  Number(
                    item.quantity
                  )
                ).toFixed(2)}

              </strong>

            </div>

          )
        )}

      </div>


      {/* =====================
          TOTAL
      ===================== */}

      <div className="checkout-total">

        <h2>
          Total: Rs.{" "}
          {total.toFixed(2)}
        </h2>

      </div>


      {/* =====================
          BUTTON
      ===================== */}

      <button
        className="place-order-button"
        onClick={handlePlaceOrder}
        disabled={loading}
      >

        {loading
          ? "Placing Order..."
          : "Place Order"
        }

      </button>


    </div>

  );

}

export default Checkout;