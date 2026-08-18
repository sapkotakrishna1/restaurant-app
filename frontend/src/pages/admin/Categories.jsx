import { API_URL } from "../../config/config";
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import "./Categories.css";

const response = await fetch(
  `${API_URL}/categories`
);

// ==========================================
// CATEGORY SUGGESTIONS
// ==========================================

const CATEGORY_SUGGESTIONS = [
  {
    name: "Momo",
    description:
      "Momo is a popular Nepali and South Asian dumpling made with soft flour wrappers filled with seasoned vegetables, chicken, or other tasty ingredients. They are usually steamed and served hot with spicy tomato chutney or dipping sauce. Momo is one of the most loved foods in Nepal and is suitable for snacks, lunch, or dinner. This category can include steamed momo, fried momo, jhol momo, chicken momo, and buff momo. It is a perfect choice for restaurants offering traditional Nepali fast food and popular street-style dishes.",
  },

  {
    name: "Pizza",
    description:
      "Pizza is a popular Italian-inspired dish prepared with a baked dough base topped with tomato sauce, cheese, vegetables, meat, and various seasonings. It is commonly served hot and can be customized with different toppings according to customer preferences. Pizza is suitable for lunch, dinner, parties, family meals, and casual gatherings. This category can include classic cheese pizza, vegetable pizza, chicken pizza, pepperoni pizza, and specialty pizzas. The combination of crispy or soft crust, melted cheese, flavorful sauce, and fresh toppings makes pizza a favorite food for many customers.",
  },

  {
    name: "Burger",
    description:
      "Burger is a popular fast-food item made with a soft bun containing a cooked patty, fresh vegetables, cheese, sauces, and other toppings. Burgers can be prepared using chicken, beef, vegetables, or other ingredients depending on the restaurant menu. They are commonly served with French fries, salad, or a refreshing drink. This category can include chicken burgers, cheese burgers, vegetable burgers, crispy burgers, and specialty burgers. Burgers are suitable for lunch, dinner, snacks, and quick meals. Customers enjoy burgers because they are filling, convenient, flavorful, and easy to customize with different sauces, toppings, and cheese options.",
  },

  {
    name: "Chow Mein",
    description:
      "Chow Mein is a popular noodle dish prepared by stir-frying noodles with fresh vegetables, sauces, spices, and optional meat or eggs. It is commonly served hot and is enjoyed as a quick and filling meal. Restaurants can prepare different varieties including vegetable chow mein, chicken chow mein, buff chow mein, egg chow mein, and mixed chow mein. The dish is known for its combination of soft noodles, crunchy vegetables, flavorful seasoning, and delicious stir-fried aroma. Chow Mein is popular in Nepal and is commonly available in restaurants, cafés, food stalls, and fast-food shops as a convenient lunch or dinner option.",
  },

  {
    name: "Fried Rice",
    description:
      "Fried Rice is a flavorful rice dish prepared by stir-frying cooked rice with vegetables, eggs, meat, spices, sauces, and other ingredients. It is a popular meal because it is filling, delicious, and easy to customize. Restaurants can offer different varieties such as vegetable fried rice, chicken fried rice, egg fried rice, buff fried rice, and mixed fried rice. The dish is usually cooked at high heat to give the rice a pleasant roasted aroma and balanced flavor. Fried rice can be served as a main meal or combined with other dishes such as momo, chow mein, or spicy sauces.",
  },

  {
    name: "Thukpa",
    description:
      "Thukpa is a warm and comforting noodle soup popular in Nepal and the Himalayan region. It is prepared with noodles, fresh vegetables, herbs, spices, and optional chicken, meat, or eggs. The flavorful broth makes it especially enjoyable during cold weather and rainy days. Restaurants can offer vegetable thukpa, chicken thukpa, buff thukpa, and mixed varieties according to customer preferences. Thukpa is commonly served hot and provides a satisfying combination of noodles, vegetables, protein, and delicious soup. It is a popular choice for lunch, dinner, or a warm evening meal and is loved for its comforting taste.",
  },

  {
    name: "Sandwich",
    description:
      "Sandwich is a convenient food prepared using slices of bread filled with vegetables, cheese, meat, chicken, eggs, sauces, and other ingredients. It can be served fresh, toasted, grilled, or lightly fried depending on the recipe. Sandwiches are suitable for breakfast, snacks, lunch, or quick meals. Restaurants can offer different varieties such as chicken sandwich, cheese sandwich, club sandwich, vegetable sandwich, and grilled sandwich. Customers enjoy sandwiches because they are easy to eat, customizable, and suitable for different tastes. They can also be served with French fries, salad, chips, or a refreshing beverage for a complete meal.",
  },

  {
    name: "Pasta",
    description:
      "Pasta is a popular Italian-inspired dish prepared using different types of pasta combined with sauces, vegetables, cheese, herbs, chicken, or other ingredients. Common varieties include spaghetti, penne, macaroni, Alfredo pasta, tomato pasta, and creamy chicken pasta. Pasta is usually served hot and can be customized according to customer preferences. Its rich sauce, soft texture, herbs, cheese, and flavorful ingredients make it a popular choice for lunch and dinner. Restaurants can provide vegetarian and non-vegetarian pasta options. Pasta is also suitable for family meals, casual dining, and customers looking for a filling and delicious international-style food option.",
  },

  {
    name: "Drinks",
    description:
      "Drinks include a variety of refreshing beverages served with meals, snacks, or desserts. This category can include soft drinks, fresh juices, milkshakes, smoothies, lemon drinks, iced tea, coffee, tea, and other refreshing beverages. Drinks help customers complete their meals and provide options for different tastes and preferences. Restaurants can offer both cold and hot beverages depending on the season and menu. Fresh fruit juices and smoothies are suitable for customers looking for refreshing options, while tea and coffee are popular throughout the day. A well-designed drinks menu can provide customers with convenient choices alongside their favorite food items.",
  },

  {
    name: "Desserts",
    description:
      "Desserts are sweet dishes usually served after a meal or enjoyed as a separate snack. This category can include cakes, ice cream, brownies, pastries, pudding, fruit salads, cookies, waffles, and other sweet treats. Desserts provide customers with a pleasant way to finish their meals and are also popular for celebrations, family gatherings, and special occasions. Restaurants can offer different flavors, toppings, and serving sizes to suit customer preferences. Popular dessert options can be served cold, warm, or freshly prepared. A good dessert selection adds variety to the restaurant menu and gives customers enjoyable sweet choices after their main food.",
  },
];

// ==========================================
// CATEGORY NAME SUGGESTIONS
// ==========================================

const CATEGORY_NAME_SUGGESTIONS =
  CATEGORY_SUGGESTIONS.map(
    (category) => category.name
  );

function Categories() {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  // ==========================================
  // GET CATEGORIES FROM BACKEND
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
  `${API_URL}/categories`)

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load categories"
        );
      }

      setCategories(data);
    } catch (error) {
      console.error(
        "Fetch categories error:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredCategories =
    categories.filter((category) =>
      category.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
      status: "Active",
    });

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      description:
        category.description || "",
      status: category.status,
    });

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
      status: "Active",
    });
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ==========================================
    // AUTO DESCRIPTION
    // When admin selects/types category name
    // ==========================================

    if (name === "name") {
      const selectedCategory =
        CATEGORY_SUGGESTIONS.find(
          (category) =>
            category.name.toLowerCase() ===
            value.trim().toLowerCase()
        );

      if (selectedCategory) {
        setFormData((prev) => ({
          ...prev,
          name: value,
          description:
            selectedCategory.description,
        }));
      }
    }
  };

  // ==========================================
  // ADD / UPDATE CATEGORY
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryName =
      formData.name.trim();

    if (!categoryName) {
      alert("Please enter category name");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter category description");
      return;
    }

    try {
      setSaving(true);

      const isEditing =
        Boolean(editingCategory);

      const url = isEditing
        ? `${API_URL}/${editingCategory.id}`
        : API_URL;

      const method = isEditing
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: categoryName,
          description:
            formData.description.trim(),
          status: formData.status,
        }),
      });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save category"
        );
      }

      await fetchCategories();

      closeModal();
    } catch (error) {
      console.error(
        "Save category error:",
        error
      );

      alert(
        error.message ||
          "Failed to save category"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const deleteCategory = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this category?"
      );

    if (!confirmed) return;

    try {
      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete category"
        );
      }

      setCategories((prev) =>
        prev.filter(
          (category) =>
            category.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete category"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="categories-page">
        <div className="categories-header">
          <div>
            <h1>Categories</h1>

            <p>
              Manage your restaurant food
              categories
            </p>
          </div>
        </div>

        <div className="category-message">
          Loading categories...
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="categories-page">

      {/* HEADER */}

      <div className="categories-header">
        <div>
          <h1>Categories</h1>

          <p>
            Manage your restaurant food
            categories
          </p>
        </div>

        <button
          className="add-category-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />

          Add Category
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="category-error">
          {error}

          <button
            onClick={fetchCategories}
          >
            Retry
          </button>
        </div>
      )}

      {/* SEARCH */}

      <div className="categories-toolbar">

        <div className="category-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="category-count">
          {filteredCategories.length}{" "}
          Categories
        </div>
      </div>

      {/* DESKTOP TABLE */}

      <div className="categories-table-wrapper">

        <table className="categories-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Description</th>
              <th>Foods</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredCategories.length >
            0 ? (
              filteredCategories.map(
                (category) => (
                  <tr
                    key={category.id}
                  >

                    <td>
                      #{category.id}
                    </td>

                    <td>
                      <div className="category-name">
                        {category.name}
                      </div>
                    </td>

                    <td>
                      <span className="category-description">
                        {category.description ||
                          "No description"}
                      </span>
                    </td>

                    <td>
                      <span className="food-count">
                        {category.foods ??
                          0}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          category.status ===
                          "Active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>

                    <td>
                      <div className="category-actions">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            openEditModal(
                              category
                            )
                          }
                          title="Edit"
                        >
                          <Pencil
                            size={16}
                          />
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteCategory(
                              category.id
                            )
                          }
                          title="Delete"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>

                      </div>
                    </td>

                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="6">
                  <div className="no-categories">
                    {search
                      ? "No categories found"
                      : "No categories available"}
                  </div>
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}

      <div className="categories-mobile">

        {filteredCategories.length >
        0 ? (
          filteredCategories.map(
            (category) => (
              <div
                className="category-card"
                key={category.id}
              >

                <div className="category-card-top">

                  <div>
                    <h3>
                      {category.name}
                    </h3>

                    <span className="category-id">
                      #{category.id}
                    </span>
                  </div>

                  <span
                    className={`status-badge ${
                      category.status ===
                      "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {category.status}
                  </span>

                </div>

                <p>
                  {category.description ||
                    "No description"}
                </p>

                <div className="category-card-bottom">

                  <span>
                    <strong>
                      {category.foods ??
                        0}
                    </strong>{" "}
                    Foods
                  </span>

                  <div className="category-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditModal(
                          category
                        )
                      }
                    >
                      <Pencil
                        size={16}
                      />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteCategory(
                          category.id
                        )
                      }
                    >
                      <Trash2
                        size={16}
                      />
                    </button>

                  </div>
                </div>

              </div>
            )
          )
        ) : (
          <div className="no-categories">
            {search
              ? "No categories found"
              : "No categories available"}
          </div>
        )}

      </div>

      {/* MODAL */}

      {showModal && (
        <div
          className="category-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="category-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p>
                  {editingCategory
                    ? "Update category information"
                    : "Create a new food category"}
                </p>

              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
            >

              {/* NAME */}

              <div className="form-group">

                <label>
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Pizza"
                  value={formData.name}
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                  autoFocus
                  list="category-name-suggestions"
                />

                <datalist
                  id="category-name-suggestions"
                >
                  {CATEGORY_NAME_SUGGESTIONS.map(
                    (categoryName) => (
                      <option
                        key={
                          categoryName
                        }
                        value={
                          categoryName
                        }
                      />
                    )
                  )}
                </datalist>

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Enter category description..."
                  rows="6"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                />

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-category-btn"
                  disabled={saving}
                >

                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check
                        size={17}
                      />

                      {editingCategory
                        ? "Update Category"
                        : "Add Category"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Categories;