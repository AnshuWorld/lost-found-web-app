import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ItemForm from "./components/ItemForm";

function App() {

  const [page, setPage] = useState("home");
  const [editItem, setEditItem] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar setPage={setPage} />

      {page === "home" && (
        <Home
          setPage={setPage}
          setEditItem={setEditItem}
        />
      )}

      {page === "login" && (
        <Login setPage={setPage} />
      )}

      {page === "signup" && (
        <Signup setPage={setPage} />
      )}

      {page === "create" && (
        <ItemForm
          setPage={setPage}
          editItem={editItem}
        />
      )}

    </div>
  );
}

export default App;