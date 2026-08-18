import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config/config";
import "./FoodDetails.css";

function FoodDetails({
  addToCart,
  cart = [],
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const loadFood = async () => {
      try {
        setLoading(true);
        setError("");

        const response =  await fetch(
  `${API_URL}/foods`
        );

        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status}`
          );
        }

        const contentType =
          response.headers.get("content-type");

        if (
          !contentType ||
          !contentType.includes("application/json")
        ) {
          throw new Error(
            "Food API did not return JSON."
          );
        }

        const data = await response.json();

        const foodList = Array.isArray(data)
          ? data
          : Array.isArray(data.foods)
          ? data.foods
          : [];

        const foundFood = foodList.find(
          (item) =>
            Number(item.id) === Number(id)
        );

        if (!foundFood) {
          throw new Error(
            "Food with this ID was not found."
          );
        }

        setFood(foundFood);
      } catch (err) {
        console.error(
          "Food Details Error:",
          err
        );

        setError(
          err.message ||
            "Failed to load food details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFood();
  }, [id]);

  /* ================= CHECK CART ================= */

  useEffect(() => {
    if (!food) return;

    const alreadyAdded = cart.some(
      (item) =>
        Number(item.food?.id) === Number(food.id) ||
        Number(item.id) === Number(food.id)
    );

    setAdded(alreadyAdded);
  }, [cart, food]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="food-details-page">
        <div className="food-details-loading">
          <div className="food-loading-spinner"></div>

          <p>
            Loading food details...
          </p>
        </div>
      </main>
    );
  }

  /* ================= ERROR ================= */

  if (error || !food) {
    return (
      <main className="food-details-page">
        <div className="food-not-found">

          <div className="food-not-found-icon">
            🍽️
          </div>

          <h1>
            Food Not Found
          </h1>

          <p>
            {error ||
              "We couldn't find this food."}
          </p>

          <button
            onClick={() => navigate("/")}
          >
            ← Back to Menu
          </button>

        </div>
      </main>
    );
  }

  /* ================= ADD TO CART ================= */

  const handleAddToCart = () => {
    if (added) {
      return;
    }

    addToCart({
      ...food,
      id: Number(food.id),
    });

    setAdded(true);
  };

  /* ================= VIEW DETAILS ================= */

  return (
    <main className="food-details-page">

      <div className="food-details-container">

        {/* BACK BUTTON */}

        <button
          className="food-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* FOOD CARD */}

        <div className="food-details-card">

          {/* IMAGE */}

          <div className="food-details-image">

            <img
              src={food.image}
              alt={food.name}
              onError={(e) => {
                e.target.style.display =
                  "none";
              }}
            />

          </div>

          {/* CONTENT */}

          <div className="food-details-content">

            <span className="food-details-label">
              OUR MENU
            </span>

            <h1>
              {food.name}
            </h1>

            <div className="food-details-price">
              Rs. {food.price}
            </div>

            <div className="food-details-line"></div>

            <h2>
              About this dish
            </h2>

            <p className="food-details-description">
              {food.description ||
                "A delicious meal prepared with fresh and quality ingredients."}
            </p>

            {/* FEATURES */}

            <div className="food-info-row">

              <div className="food-info-item">
                <span>🍴</span>

                <div>
                  <strong>
                    Fresh
                  </strong>

                  <small>
                    Quality ingredients
                  </small>
                </div>
              </div>

              <div className="food-info-item">
                <span>👨‍🍳</span>

                <div>
                  <strong>
                    Chef Made
                  </strong>

                  <small>
                    Prepared with care
                  </small>
                </div>
              </div>

            </div>

            {/* BUTTONS */}

            <div className="food-details-buttons">

              {/* ADD TO CART */}

              <button
                className={`food-add-cart ${
                  added ? "food-added" : ""
                }`}
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? (
                  <>
                    ✓ Added to Cart
                  </>
                ) : (
                  <>
                    🛒 Add to Cart
                  </>
                )}
              </button>

              {/* VIEW CART */}

              {added && (
                <button
                  className="food-view-cart"
                  onClick={() =>
                    navigate("/cart")
                  }
                >
                  🛒 View Cart
                </button>
              )}

              {/* MORE FOOD */}

              <button
                className="food-view-menu"
                onClick={() =>
                  navigate("/")
                }
              >
                View More Foods
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default FoodDetails;