import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";

function Home({ setPage, setEditItem }) {

  const [items, setItems] = useState([]);

  const getItems = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/items"
      );

      setItems(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const deleteItem = async (id) => {

    const token = localStorage.getItem("token");

    try {

      await axios.delete(
        `http://localhost:5000/api/items/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      getItems();

    } catch (error) {

      console.log(error);

    }
  };

  const editItem = (item) => {

    setEditItem(item);
    setPage("create");

  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Lost & Found Items
        </h1>

        <button
          onClick={() => {
            setEditItem(null);
            setPage("create");
          }}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          + Add Item
        </button>

      </div>

      {items.length === 0 ? (

        <p className="text-gray-500">
          No items found.
        </p>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {items.map((item) => (

            <ItemCard
              key={item._id}
              item={item}
              onEdit={editItem}
              onDelete={deleteItem}
            />

          ))}

        </div>

      )}

    </div>
  );
}

export default Home;