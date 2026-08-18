import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// =========================
// COMPONENTS
// =========================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// =========================
// CUSTOMER PAGES
// =========================

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Register from "./pages/Register";
import FoodDetails from "./pages/FoodDetails";
// =========================
// ADMIN PAGES
// =========================

import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import AdminFoods from "./pages/AdminFoods";
import AdminProducts from "./pages/AdminProducts";
import Categories from "./pages/admin/Categories";

// =========================
// CSS
// =========================

import "./App.css";

function App() {
  // =========================
  // CART STATE
  // =========================

  const [cart, setCart] = useState([]);

  // =========================
  // ADD TO CART
  // =========================

  function addToCart(food) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.food.id === food.id
      );

      // If item already exists
      if (existingItem) {
        return currentCart.map((item) =>
          item.food.id === food.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      // New item
      return [
        ...currentCart,
        {
          food: food,
          quantity: 1,
        },
      ];
    });
  }

  // =========================
  // INCREASE QUANTITY
  // =========================

  function increaseQuantity(foodId) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.food.id === foodId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  // =========================
  // DECREASE QUANTITY
  // =========================

  function decreaseQuantity(foodId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.food.id === foodId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // =========================
  // REMOVE FROM CART
  // =========================

  function removeFromCart(foodId) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.food.id !== foodId
      )
    );
  }

  // =========================
  // CLEAR CART
  // =========================

  function clearCart() {
    setCart([]);
  }

  // =========================
  // APP
  // =========================

  return (
    <BrowserRouter>
      <div className="app">

        {/* NAVBAR */}
        <Navbar />

        <Routes>

          {/* =====================
              HOME
          ===================== */}

          <Route
            path="/"
            element={
              <Home
                addToCart={addToCart}
                cart={cart}
              />
            }
          />

 <Route
  path="/food/:id"
  element={
    <FoodDetails
      addToCart={addToCart}
      cart={cart}
    />
  }
/>

          {/* =====================
              LOGIN
          ===================== */}

          <Route
            path="/login"
            element={<Login />}
          />


          <Route path="/register" element={<Register />} />

          {/* =====================
              MENU
          ===================== */}

          <Route
  path="/menu"
  element={
    <Menu
      addToCart={addToCart}
      cart={cart}
    />
  }
/>

          {/* =====================
              CART
          ===================== */}

          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
              />
            }
          />

          {/* =====================
              CHECKOUT
          ===================== */}

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout
                  cart={cart}
                  clearCart={clearCart}
                />
              </ProtectedRoute>
            }
          />

          {/* =====================
              ORDER SUCCESS
          ===================== */}

          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          {/* =====================
              MY ORDERS
          ===================== */}

          <Route
  path="/myorders"
  element={
    <ProtectedRoute>
      <MyOrders />
    </ProtectedRoute>
  }
/>

          {/* =====================
              ADMIN PRODUCTS
          ===================== */}

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          {/* =====================
              ADMIN LAYOUT
          ===================== */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >

            {/* DASHBOARD */}

            <Route
              index
              element={<Dashboard />}
            />

            {/* FOODS */}

            <Route
              path="foods"
              element={<AdminFoods />}
            />

            {/* CATEGORIES */}

           <Route path="categories" element={<Categories />} />

            {/* ORDERS */}

            <Route
              path="orders"
              element={<Orders />}
            />

            {/* CUSTOMERS */}

            <Route
              path="customers"
              element={
                <h1>Customers</h1>
              }
            />

            {/* USERS */}

            <Route
              path="users"
              element={
                <h1>Users</h1>
              }
            />

          </Route>

        </Routes>

        {/* FOOTER */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;