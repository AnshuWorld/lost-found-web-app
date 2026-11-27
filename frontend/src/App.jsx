import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ItemForm from "./components/ItemForm";

function App() {
  const [page, setPage] = useState("home");
  const [editItem, setEditItem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    return Boolean(localStorage.getItem("token"));
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setEditItem(null);
    setPage("home");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar
        page={page}
        setPage={setPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onNewItem={() => setEditItem(null)}
      />

      <main className="flex-1">
        {page === "home" && (
          <Home setPage={setPage} setEditItem={setEditItem} />
        )}

        {page === "login" && (
          <Login
            setPage={setPage}
            onLoginSuccess={() => setIsLoggedIn(true)}
          />
        )}

        {page === "signup" && <Signup setPage={setPage} />}

        {page === "create" && (
          <ItemForm
            key={editItem?._id || "new"}
            setPage={setPage}
            editItem={editItem}
          />
        )}
      </main>
    </div>
  );
}

export default App;
