import { useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import { API_URL } from "../config/config";
import "./Menu.css";

function Menu({ addToCart, cart = [] }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
  `${API_URL}/foods`
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            `Server error: ${response.status}`
          );
        }

        const foodList = Array.isArray(data)
          ? data
          : Array.isArray(data.foods)
          ? data.foods
          : [];

        setFoods(foodList);

      } catch (err) {
        console.error("MENU ERROR:", err);

        setError(
          err.message ||
          "Failed to load foods"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const isFoodAdded = (foodId) => {
    return cart.some(
      (item) =>
        Number(item.food?.id) === Number(foodId)
    );
  };

  if (loading) {
    return (
      <div className="menu-page">
        <div className="menu-header">
          <h1>Our Menu</h1>
          <p>Loading foods...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <div className="menu-header">
          <h1>Our Menu</h1>

          <p className="menu-error">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="menu-page">
        <div className="menu-header">
          <h1>Our Menu</h1>

          <p>
            No foods found in the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">

      <div className="menu-header">

        <span className="menu-label">
          ✦ OUR RESTAURANT
        </span>

        <h1>Our Menu</h1>

        <p>
          Choose your favorite food and
          order now.
        </p>

      </div>

      <div className="food-container">

        {foods.map((food) => (

          <FoodCard
            key={food.id}

            name={food.name}
            price={food.price}
            description={food.description}
            image={food.image}

            isAdded={isFoodAdded(food.id)}

            onAddToCart={() =>
              addToCart({
                ...food,
                id: Number(food.id),
              })
            }
          />

        ))}

      </div>

    </div>
  );
}

export default Menu;