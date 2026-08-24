function Navbar({ setPage }) {

  return (
    <nav className="bg-blue-600 text-white px-8 py-4 flex justify-between">

      <h1
        onClick={() => setPage("home")}
        className="text-2xl font-bold cursor-pointer"
      >
        Lost & Found
      </h1>

      <div className="flex gap-6">

        <button onClick={() => setPage("home")}>
          Home
        </button>

        <button onClick={() => setPage("login")}>
          Login
        </button>

        <button onClick={() => setPage("signup")}>
          Signup
        </button>

      </div>

    </nav>
  );
}

export default Navbar;