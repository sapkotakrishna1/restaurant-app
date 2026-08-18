import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/config";
import "./AdminFoods.css";

const FOODS_API_URL = `${API_URL}/foods`;
const CATEGORY_API_URL = `${API_URL}/categories`;

// =====================================================
// FOOD SUGGESTIONS
// =====================================================

const FOOD_SUGGESTIONS = [
  {
    name: "Momo",
    description:
      "Momo is a popular Nepali dumpling prepared with soft flour wrappers and a flavorful filling of vegetables, chicken, buff, or other ingredients. These dumplings are commonly steamed and served hot with spicy tomato chutney or a delicious dipping sauce. Momo is one of the most popular foods in Nepal and is suitable for snacks, lunch, dinner, and casual gatherings. Customers enjoy its soft outer layer and flavorful filling. Different varieties such as steamed momo, fried momo, jhol momo, chicken momo, and buff momo can be offered. It is a great choice for restaurants serving traditional Nepali and South Asian food.",
    image:
      "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Chicken Momo",
    description:
      "Chicken momo is a delicious Nepali-style dumpling filled with seasoned minced chicken, onions, herbs, and spices wrapped inside a soft flour covering. The momo is usually steamed until tender and served hot with spicy tomato chutney or dipping sauce. Chicken momo is popular among customers who enjoy flavorful and filling snacks or meals. Restaurants can also offer fried chicken momo, jhol chicken momo, and other variations. The combination of juicy chicken filling, soft wrapper, aromatic spices, and spicy sauce creates a satisfying taste. Chicken momo is suitable for lunch, dinner, snacks, parties, family meals, and casual restaurant dining.",
    image:
      "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Buff Momo",
    description:
      "Buff momo is a traditional Nepali dumpling prepared with seasoned minced buffalo meat, onions, herbs, spices, and a soft flour wrapper. It is commonly steamed and served with spicy tomato chutney or a flavorful dipping sauce. Buff momo is especially popular in Nepal and is widely available in restaurants, cafés, street-food shops, and local eateries. Customers enjoy its juicy filling, soft texture, aromatic spices, and delicious combination with chutney. Different preparations such as steamed buff momo, fried buff momo, and jhol buff momo can be offered. This category is suitable for customers looking for a traditional and satisfying Nepali food experience.",
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Chicken Burger",
    description:
      "Chicken burger is a popular fast-food dish prepared with a soft burger bun, crispy or grilled chicken patty, fresh vegetables, cheese, sauces, and flavorful seasonings. It is usually served with French fries, salad, or a refreshing beverage. Chicken burgers are suitable for lunch, dinner, snacks, quick meals, and casual dining. Restaurants can offer crispy chicken burgers, grilled chicken burgers, spicy chicken burgers, and specialty versions with different sauces and toppings. Customers enjoy chicken burgers because they are filling, convenient, flavorful, and easy to customize. The combination of tender chicken, fresh vegetables, creamy sauce, and soft bread makes it a popular menu choice.",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Cheese Burger",
    description:
      "Cheese burger is a classic fast-food item prepared with a soft burger bun, a flavorful meat or vegetable patty, melted cheese, fresh vegetables, sauces, and seasonings. The melted cheese adds a rich and creamy flavor that combines well with the juicy patty and fresh toppings. Cheese burgers are commonly served with French fries, salad, or beverages. Restaurants can provide chicken, beef, or vegetable cheese burgers with different sauces and topping options. They are suitable for lunch, dinner, snacks, parties, and quick meals. Customers enjoy cheese burgers because they are filling, convenient, customizable, and rich in flavor.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Margherita Pizza",
    description:
      "Margherita pizza is a classic Italian-style pizza prepared with a baked dough base, tomato sauce, mozzarella cheese, fresh basil, and a light seasoning of herbs and spices. It is known for its simple ingredients and balanced combination of crispy or soft crust, rich tomato sauce, melted cheese, and fresh basil. The pizza is baked until the cheese becomes soft and flavorful while the crust develops a delicious aroma. Margherita pizza is suitable for lunch, dinner, family meals, casual dining, and gatherings. It is a popular vegetarian option for customers who prefer a simple, fresh, and traditional pizza experience.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Chicken Pizza",
    description:
      "Chicken pizza is a delicious baked pizza prepared with a soft or crispy dough base, tomato sauce, mozzarella cheese, seasoned chicken pieces, vegetables, herbs, and flavorful toppings. The pizza is baked until the cheese melts and the crust becomes perfectly cooked. Chicken pizza is suitable for lunch, dinner, family meals, parties, and casual gatherings. Restaurants can offer spicy chicken pizza, barbecue chicken pizza, grilled chicken pizza, and specialty versions with different vegetables and sauces. Customers enjoy the combination of tender chicken, melted cheese, flavorful sauce, fresh toppings, and aromatic herbs, making chicken pizza a popular choice for many food lovers.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Chow Mein",
    description:
      "Chow Mein is a popular stir-fried noodle dish prepared with noodles, fresh vegetables, sauces, spices, and optional chicken, buff, eggs, or other ingredients. The noodles are cooked at high heat with vegetables and seasonings to create a delicious roasted aroma and flavorful taste. Restaurants can offer vegetable chow mein, chicken chow mein, buff chow mein, egg chow mein, and mixed chow mein. It is commonly served hot as a quick and filling lunch or dinner. Chow Mein is popular throughout Nepal and is commonly available in restaurants, cafés, food stalls, and fast-food shops. It is suitable for customers looking for an affordable and satisfying meal.",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Fried Rice",
    description:
      "Fried rice is a flavorful rice dish prepared by stir-frying cooked rice with fresh vegetables, eggs, meat, chicken, spices, sauces, and other ingredients. The ingredients are usually cooked at high heat to create a pleasant roasted aroma and balanced flavor. Restaurants can offer vegetable fried rice, chicken fried rice, egg fried rice, buff fried rice, and mixed fried rice. Fried rice is a filling and convenient meal suitable for lunch, dinner, family meals, and casual dining. Customers enjoy its combination of soft rice, crunchy vegetables, flavorful seasonings, and protein. It can also be served with momo, chow mein, sauces, or other side dishes.",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Thukpa",
    description:
      "Thukpa is a warm and comforting Himalayan noodle soup popular throughout Nepal. It is prepared using noodles, fresh vegetables, herbs, spices, and a flavorful broth with optional chicken, buff, eggs, or other ingredients. Thukpa is usually served hot and is especially enjoyable during cold weather and rainy days. Restaurants can provide vegetable thukpa, chicken thukpa, buff thukpa, and mixed varieties. The combination of warm soup, soft noodles, fresh vegetables, aromatic herbs, and protein creates a satisfying meal. Thukpa is suitable for lunch, dinner, or an evening meal and is loved for its comforting taste and nourishing ingredients.",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Sandwich",
    description:
      "Sandwich is a convenient food prepared using slices of bread filled with fresh vegetables, cheese, chicken, meat, eggs, sauces, and other tasty ingredients. It can be served fresh, toasted, grilled, or lightly fried depending on the recipe. Sandwiches are suitable for breakfast, snacks, lunch, or quick meals. Restaurants can provide chicken sandwich, cheese sandwich, club sandwich, vegetable sandwich, grilled sandwich, and specialty varieties. Customers enjoy sandwiches because they are easy to eat, customizable, filling, and suitable for different tastes. They can also be served with French fries, chips, salad, or a refreshing beverage for a complete and convenient meal.",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Pasta",
    description:
      "Pasta is a popular Italian-inspired dish prepared using different types of pasta combined with sauces, vegetables, cheese, herbs, chicken, or other ingredients. Common varieties include spaghetti, penne, macaroni, Alfredo pasta, tomato pasta, and creamy chicken pasta. Pasta is usually served hot and can be customized according to customer preferences. Its rich sauce, soft texture, herbs, cheese, and flavorful ingredients make it a popular choice for lunch and dinner. Restaurants can provide vegetarian and non-vegetarian pasta options. Pasta is also suitable for family meals, casual dining, and customers looking for a filling and delicious international-style food option.",
    image:
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "French Fries",
    description:
      "French fries are a popular side dish prepared by cutting potatoes into thin strips and frying them until golden, crispy, and delicious. They are commonly served with burgers, sandwiches, fried chicken, momo, or other fast-food items. French fries can be seasoned with salt, herbs, spices, cheese, or special sauces according to customer preferences. Restaurants can offer regular fries, crispy fries, peri-peri fries, cheese fries, and loaded fries. They are suitable as snacks, side dishes, or additions to a complete meal. Customers enjoy French fries because of their crispy outside, soft inside, convenient serving style, and familiar delicious taste.",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Chicken Wings",
    description:
      "Chicken wings are flavorful pieces of chicken prepared by frying, grilling, baking, or roasting and served with different sauces and seasonings. They can be prepared as crispy wings, spicy wings, barbecue wings, hot wings, or garlic wings. Chicken wings are commonly served with dipping sauces, salad, French fries, or refreshing beverages. They are suitable for snacks, casual meals, parties, gatherings, and sharing with friends or family. Customers enjoy chicken wings because they are crispy, juicy, flavorful, and easy to customize with different sauces. Restaurants can provide multiple spice levels and sauce options to satisfy different customer preferences.",
    image:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Chicken Fried Rice",
    description:
      "Chicken fried rice is a delicious rice dish prepared by stir-frying cooked rice with seasoned chicken pieces, fresh vegetables, eggs, sauces, herbs, and spices. The ingredients are cooked at high heat to create a pleasant roasted aroma and balanced flavor. Chicken fried rice is commonly served hot and is suitable for lunch, dinner, family meals, and casual dining. Restaurants can customize it with additional vegetables, sauces, eggs, or spices according to customer preferences. Customers enjoy the combination of soft rice, tender chicken, crunchy vegetables, and flavorful seasonings. It can also be served with momo, chow mein, sauces, or other side dishes.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
  },

  {
    name: "Vegetable Fried Rice",
    description:
      "Vegetable fried rice is a flavorful vegetarian rice dish prepared by stir-frying cooked rice with fresh vegetables, herbs, spices, sauces, and optional eggs. Common vegetables include carrots, cabbage, peas, onions, bell peppers, and spring onions. The ingredients are cooked at high heat to create a delicious roasted aroma and balanced taste. Vegetable fried rice is suitable for lunch, dinner, family meals, and casual dining. It provides a filling and convenient vegetarian meal for customers who prefer fresh vegetables and flavorful rice. Restaurants can customize the dish with different vegetables, sauces, seasonings, and spice levels according to customer preferences.",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
  },
];

// =====================================================
// COMPONENT
// =====================================================

function AdminFoods() {
  const { user, token, isLoggedIn } = useAuth();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category_id: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [foodSuggestions, setFoodSuggestions] =
    useState([]);

  // =====================================================
  // GET FOODS
  // =====================================================

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(FOODS_API_URL);

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      console.log("FOODS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load foods"
        );
      }

      let foodList = [];

      if (Array.isArray(data)) {
        foodList = data;
      } else if (
        data &&
        Array.isArray(data.foods)
      ) {
        foodList = data.foods;
      }

      setFoods(foodList);
    } catch (error) {
      console.error(
        "FETCH FOODS ERROR:",
        error
      );

      setMessage(
        error.message ||
          "Failed to load foods"
      );

      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await fetch(
        CATEGORY_API_URL
      );

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      console.log(
        "CATEGORIES RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load categories"
        );
      }

      let categoryList = [];

      if (Array.isArray(data)) {
        categoryList = data;
      } else if (
        data &&
        Array.isArray(data.categories)
      ) {
        categoryList = data.categories;
      }

      setCategories(categoryList);
    } catch (error) {
      console.error(
        "FETCH CATEGORIES ERROR:",
        error
      );

      setMessage(
        error.message ||
          "Failed to load categories"
      );

      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // =====================================================
  // LOAD PAGE
  // =====================================================

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  // =====================================================
  // NORMAL INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =====================================================
  // FOOD NAME CHANGE
  // =====================================================

  const handleFoodNameChange = (event) => {
    const value = event.target.value;

    setFormData((current) => ({
      ...current,
      name: value,
    }));

    if (!value.trim()) {
      setFoodSuggestions(
        FOOD_SUGGESTIONS
      );
      return;
    }

    const filtered =
      FOOD_SUGGESTIONS.filter(
        (food) =>
          food.name
            .toLowerCase()
            .includes(
              value.toLowerCase()
            )
      );

    setFoodSuggestions(filtered);
  };

  // =====================================================
  // FOOD NAME FOCUS
  // =====================================================

  const handleFoodNameFocus = () => {
    if (!formData.name.trim()) {
      setFoodSuggestions(
        FOOD_SUGGESTIONS
      );
      return;
    }

    const filtered =
      FOOD_SUGGESTIONS.filter(
        (food) =>
          food.name
            .toLowerCase()
            .includes(
              formData.name.toLowerCase()
            )
      );

    setFoodSuggestions(filtered);
  };

  // =====================================================
  // SELECT FOOD SUGGESTION
  // =====================================================

  const selectFoodName = (food) => {
    setFormData((current) => ({
      ...current,
      name: food.name,
      description: food.description,
      image: food.image,
    }));

    setFoodSuggestions([]);
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      image: "",
      category_id: "",
    });

    setFoodSuggestions([]);
    setEditingId(null);
  };

  // =====================================================
  // ADD / UPDATE FOOD
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!isLoggedIn || !token) {
      setMessage(
        "Please login as admin first."
      );
      return;
    }

    if (!formData.name.trim()) {
      setMessage(
        "Please enter food name."
      );
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      setMessage(
        "Please enter a valid price."
      );
      return;
    }

    if (!formData.description.trim()) {
      setMessage(
        "Please enter food description."
      );
      return;
    }

    if (!formData.image.trim()) {
      setMessage(
        "Please enter food image URL."
      );
      return;
    }

    if (!formData.category_id) {
      setMessage(
        "Please select a category."
      );
      return;
    }

    try {
      setSaving(true);

      const isEditing =
        editingId !== null;

      // FIXED URL
      const url = isEditing
        ? `${FOODS_API_URL}/${editingId}`
        : FOODS_API_URL;

      const method = isEditing
        ? "PUT"
        : "POST";

      const foodData = {
        name: formData.name.trim(),

        price: Number(
          formData.price
        ),

        description:
          formData.description.trim(),

        image:
          formData.image.trim(),

        category_id: Number(
          formData.category_id
        ),
      };

      console.log(
        "SENDING FOOD:",
        foodData
      );

      console.log(
        "FOOD API URL:",
        url
      );

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify(
          foodData
        ),
      });

      const text =
        await response.text();

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch {
        console.error(
          "Server returned invalid JSON:",
          text
        );

        throw new Error(
          "Server returned an invalid response."
        );
      }

      console.log(
        "SAVE RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Server error: ${response.status}`
        );
      }

      await fetchFoods();

      if (isEditing) {
        setMessage(
          "Food updated successfully!"
        );
      } else {
        setMessage(
          "Food added successfully!"
        );
      }

      resetForm();
    } catch (error) {
      console.error(
        "SAVE FOOD ERROR:",
        error
      );

      setMessage(
        error.message ||
          "Unable to connect to server."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this food?"
      );

    if (!confirmed) {
      return;
    }

    if (!isLoggedIn || !token) {
      setMessage(
        "Please login as admin first."
      );
      return;
    }

    try {
      setMessage("");

      // FIXED URL
      const response = await fetch(
        `${FOODS_API_URL}/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const text =
        await response.text();

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete food"
        );
      }

      setFoods((current) =>
        current.filter(
          (food) =>
            Number(food.id) !==
            Number(id)
        )
      );

      setMessage(
        "Food deleted successfully!"
      );

      if (
        Number(editingId) ===
        Number(id)
      ) {
        resetForm();
      }
    } catch (error) {
      console.error(
        "DELETE FOOD ERROR:",
        error
      );

      setMessage(
        error.message ||
          "Unable to connect to server."
      );
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (food) => {
    setEditingId(food.id);

    setFormData({
      name: food.name || "",

      price:
        food.price ??
        "",

      description:
        food.description ||
        "",

      image:
        food.image ||
        "",

      category_id:
        food.category_id
          ? String(
              food.category_id
            )
          : "",
    });

    setFoodSuggestions([]);

    console.log(
      "EDIT FOOD:",
      food
    );

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-foods">

      <div className="admin-food-header">

        <div>

          <span className="admin-small-title">
            RESTAURANT ADMIN
          </span>

          <h1>
            Food Menu
          </h1>

          <p>
            Manage your restaurant
            menu easily.
          </p>

        </div>

        <div className="food-total">

          <strong>
            {foods.length}
          </strong>

          <span>
            Menu Items
          </span>

        </div>

      </div>

      <div className="auth-info">

        <span>
          <b>Status:</b>{" "}

          {isLoggedIn
            ? "Logged in"
            : "Not logged in"}
        </span>

        <span>
          <b>User:</b>{" "}

          {user?.name ||
            user?.username ||
            "Unknown"}
        </span>

        <span>
          <b>Role:</b>{" "}

          {user?.role ||
            "Unknown"}
        </span>

      </div>

      {message && (
        <div
          className="admin-message"
          role="alert"
        >
          {message}
        </div>
      )}

      <section className="food-form-card">

        <div className="form-title">

          <div className="form-icon">
            {editingId
              ? "✎"
              : "+"}
          </div>

          <div>

            <h2>
              {editingId
                ? "Edit Food"
                : "Add New Food"}
            </h2>

            <p>
              {editingId
                ? "Update your menu item."
                : "Add a new item to your menu."}
            </p>

          </div>

        </div>

        <form
          className="food-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            <div className="form-group">

              <label>
                Food Name
              </label>

              <div className="food-name-suggestion-wrapper">

                <input
                  type="text"
                  name="name"
                  placeholder="Start typing food name..."
                  value={
                    formData.name
                  }
                  onChange={
                    handleFoodNameChange
                  }
                  onFocus={
                    handleFoodNameFocus
                  }
                  onBlur={() => {
                    setTimeout(() => {
                      setFoodSuggestions([]);
                    }, 200);
                  }}
                  required
                />

                {foodSuggestions.length > 0 && (

                  <div className="food-name-suggestions">

                    {foodSuggestions.map(
                      (food) => (

                        <button
                          type="button"
                          key={food.name}
                          className="food-suggestion-item"
                          onMouseDown={(event) => {
                            event.preventDefault();

                            selectFoodName(
                              food
                            );
                          }}
                        >

                          <img
                            src={food.image}
                            alt={food.name}
                            className="food-suggestion-image"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                          <div className="food-suggestion-content">

                            <strong>
                              {food.name}
                            </strong>

                            <span>
                              Click to select
                            </span>

                          </div>

                        </button>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

            <div className="form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                placeholder="350"
                min="0"
                step="0.01"
                value={
                  formData.price
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                name="category_id"
                value={
                  formData.category_id
                }
                onChange={
                  handleChange
                }
                disabled={
                  categoriesLoading
                }
                required
              >

                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select Category"}
                </option>

                {categories.map(
                  (category) => (

                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {category.name}
                    </option>

                  )
                )}

              </select>

            </div>

            <div className="form-group full">

              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Select a food suggestion or enter description..."
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                rows="6"
                required
              />

              <small>
                Select a food name above to automatically
                fill the description. You can edit it manually.
              </small>

            </div>

            <div className="form-group full">

              <label>
                Food Image URL
              </label>

              <input
                type="text"
                name="image"
                placeholder="https://example.com/food.jpg"
                value={
                  formData.image
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

          </div>

          {formData.image && (

            <div className="image-preview">

              <span>
                Image Preview
              </span>

              <img
                src={
                  formData.image
                }
                alt="Food preview"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

          )}

          <div className="form-buttons">

            <button
              type="submit"
              className="add-food-btn"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : editingId
                ? "Update Food"
                : "Add Food"}

            </button>

            {editingId && (

              <button
                type="button"
                className="cancel-btn"
                onClick={
                  resetForm
                }
                disabled={saving}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </section>

      <section className="food-list-section">

        <div className="food-list-header">

          <div>

            <span className="admin-small-title">
              MENU
            </span>

            <h2>
              All Foods
            </h2>

          </div>

          <button
            type="button"
            className="refresh-btn"
            onClick={
              fetchFoods
            }
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>

        {loading ? (

          <div className="loading-foods">

            <div className="food-loader"></div>

            <p>
              Loading menu...
            </p>

          </div>

        ) : foods.length === 0 ? (

          <div className="empty-foods">

            <div>
              🍽️
            </div>

            <h3>
              No Foods Available
            </h3>

            <p>
              Add your first menu item above.
            </p>

          </div>

        ) : (

          <div className="food-list">

            {foods
              .filter(Boolean)
              .map((food) => (

                <article
                  className="admin-food-card"
                  key={food.id}
                >

                  <div className="admin-food-image">

                    {food.image ? (

                      <img
                        src={
                          food.image
                        }
                        alt={
                          food.name ||
                          "Food"
                        }
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div className="no-image">
                        🍽️
                      </div>

                    )}

                  </div>

                  <div className="admin-food-info">

                    <div className="food-name-price">

                      <h3>
                        {food.name ||
                          "Unnamed Food"}
                      </h3>

                      <strong>
                        Rs.{" "}
                        {Number(
                          food.price || 0
                        ).toLocaleString()}
                      </strong>

                    </div>

                    <p>
                      {food.description ||
                        "No description available."}
                    </p>

                    <div className="food-category-display">

                      Category:{" "}

                      <strong>

                        {
                          categories.find(
                            (category) =>
                              Number(
                                category.id
                              ) ===
                              Number(
                                food.category_id
                              )
                          )?.name ||
                          "No Category"
                        }

                      </strong>

                    </div>

                    <div className="food-actions">

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(
                            food
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            food.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>

              ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default AdminFoods;
