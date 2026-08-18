import { useState } from "react";
import "./FoodCard.css";

function FoodCard({
  name,
  price,
  description,
  image,
  onAddToCart,
  isAdded = false,
}) {
  const [favorite, setFavorite] = useState(false);

  const handleFavorite = () => {
    setFavorite((current) => !current);
  };

  const handleAddToCart = () => {
    if (isAdded) return;

    onAddToCart();
  };

  return (
    <article className="food-card">

      {/* IMAGE */}

      <div className="food-image">

        <img
          src={image}
          alt={name}
          loading="lazy"
        />

        <div className="food-image-overlay"></div>

        <button
          type="button"
          className={`favorite-button ${
            favorite ? "favorite-active" : ""
          }`}
          onClick={handleFavorite}
          aria-label={
            favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          {favorite ? "♥" : "♡"}
        </button>

      </div>

      {/* CONTENT */}

      <div className="food-info">

        <h3>{name}</h3>

        <p>
          {description}
        </p>

        <div className="food-bottom">

          <span className="food-price">
            Rs. {price}
          </span>

          <button
            type="button"
            disabled={isAdded}
            className={`add-cart-button ${
              isAdded ? "added" : ""
            }`}
            onClick={handleAddToCart}
          >

            {isAdded ? (
              <>
                <span className="check-icon">
                  ✓
                </span>
                Added
              </>
            ) : (
              <>
                <span className="plus-icon">
                  +
                </span>
                Add to Cart
              </>
            )}

          </button>

        </div>

      </div>

    </article>
  );
}

export default FoodCard;