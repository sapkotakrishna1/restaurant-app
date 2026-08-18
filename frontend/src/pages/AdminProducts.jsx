import { useState } from "react";
import { createFood } from "../api/api";

function AdminProducts() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [message, setMessage] = useState("");


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const result = await createFood({
        name,
        price,
        description,
        image
      });

      console.log(result);

      setMessage(
        "Food created successfully!"
      );

      // Clear form
      setName("");
      setPrice("");
      setDescription("");
      setImage("");

    } catch (error) {

      console.error(error);

      setMessage(error.message);

    }
  };


  return (
    <div>

      <h1>Admin Products</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Food name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />


        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />


        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) =>
            setImage(e.target.value)
          }
        />


        <button type="submit">
          Add Food
        </button>

      </form>


      {message && (
        <p>{message}</p>
      )}

    </div>
  );
}

export default AdminProducts;