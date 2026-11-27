function Navbar({ page, setPage, isLoggedIn, onLogout, onNewItem }) {
  const navBtnClass = (target) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
      page === target
        ? "bg-blue-600 text-white"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="text-xl font-bold text-blue-600 tracking-tight cursor-pointer"
        >
          Lost &amp; Found
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage("home")}
            className={navBtnClass("home")}
          >
            Home
          </button>

          {isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => {
                  onNewItem();
                  setPage("create");
                }}
                className={navBtnClass("create")}
              >
                + Post Item
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPage("login")}
                className={navBtnClass("login")}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setPage("signup")}
                className={navBtnClass("signup")}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
