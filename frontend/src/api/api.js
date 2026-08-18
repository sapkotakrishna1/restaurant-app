const API_URL = "http://localhost:5000/api";



// =========================
// GET TOKEN
// =========================

const getToken = () => {
  return localStorage.getItem("token");
};


// =========================
// GET REQUEST
// =========================

export const getFoods = async () => {

  const response = await fetch(
    `${API_URL}/foods`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get foods"
    );
  }

  return data;
};


// =========================
// CREATE FOOD
// =========================

export const createFood = async (food) => {

  const token = getToken();

  const response = await fetch(
    `${API_URL}/foods`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify(food)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create food"
    );
  }

  return data;
};