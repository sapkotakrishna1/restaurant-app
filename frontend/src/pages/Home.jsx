import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import "./Home.css";

function Home({ addToCart, cart = [] }) {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/foods");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load foods");
        }

        const foodList = Array.isArray(data)
          ? data
          : Array.isArray(data.foods)
          ? data.foods
          : [];

        setFoods(foodList);
      } catch (err) {
        console.error("Food API Error:", err);
        setError(err.message || "Failed to load foods");
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, []);

  const filteredFoods = foods.filter((food) =>
    food.name?.toLowerCase().includes(search.toLowerCase())
  );

  const isFoodAdded = (foodId) => {
    return cart.some(
      (item) => Number(item.food?.id) === Number(foodId)
    );
  };

  if (loading) {
    return (
      <main className="home">
        <section className="hero hero-loading">
          <div className="hero-content">
            <span className="hero-small-title">
              🍴 MY RESTAURANT
            </span>

            <h1>
              Fresh Food.
              <br />
              Good Mood.
            </h1>

            <p>Loading our delicious menu...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home">
        <section className="hero">
          <div className="hero-content">
            <span className="hero-small-title">
              🍴 MY RESTAURANT
            </span>

            <h1>
              Fresh Food.
              <br />
              Good Mood.
            </h1>

            <p>{error}</p>

            <button
              className="hero-button"
              onClick={() => window.location.reload()}
            >
              Try Again
              <span>↻</span>
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="home">

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-foods">

          {foods.map((food, index) => (
            <div
              className="hero-food"
              key={food.id}
              style={{
                "--delay": `${index * 3}s`,
                "--total": `${foods.length * 3}s`,
              }}
            >
              <img
                src={food.image}
                alt={food.name}
                onClick={() =>
                  navigate(`/food/${food.id}`)
                }
              />
            </div>
          ))}

        </div>

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="hero-small-title">
            🍴 WELCOME TO OUR RESTAURANT
          </span>

          <h1>
            Fresh Food.
            <br />
            Good Mood.
          </h1>

          <p>
            Delicious meals made fresh for you,
            using quality ingredients and lots of love.
          </p>

          <a
            href="#foods"
            className="hero-button"
          >
            View Our Menu
            <span>→</span>
          </a>

        </div>

        <a
          href="#foods"
          className="scroll-down"
        >
          <span></span>
          Explore Menu
        </a>

      </section>

      {/* ================= MENU ================= */}

      <section
        className="popular-foods"
        id="foods"
      >

        <div className="section-top">

          <div className="section-heading">

            <span className="section-label">
              OUR MENU
            </span>

            <h2>
              Popular Foods
            </h2>

            <p>
              Choose your favorite dish and enjoy.
            </p>

          </div>

          <div className="search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>

        </div>

        {foods.length === 0 ? (

          <div className="empty-box">

            <div className="empty-icon">
              🍽️
            </div>

            <h3>No foods available</h3>

            <p>
              Please add some food to your menu.
            </p>

          </div>

        ) : filteredFoods.length === 0 ? (

          <div className="empty-box">

            <div className="empty-icon">
              🔍
            </div>

            <h3>No food found</h3>

            <p>
              Nothing matches "{search}".
            </p>

            <button
              onClick={() => setSearch("")}
            >
              View All Foods
            </button>

          </div>

        ) : (

          <div className="food-container">

            {filteredFoods.map((food) => (

              <div
                key={food.id}
                className="food-click-wrapper"
                onClick={() =>
                  navigate(`/food/${food.id}`)
                }
              >

                <FoodCard
                  name={food.name}
                  price={food.price}
                  description={food.description}
                  image={food.image}
                  isAdded={isFoodAdded(food.id)}
                  onAddToCart={(e) => {
                    e?.stopPropagation();

                    addToCart({
                      ...food,
                      id: Number(food.id),
                    });
                  }}
                />

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Home;