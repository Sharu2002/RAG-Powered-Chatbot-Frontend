import axios from "axios";

const NavBar = ({ clearSession }) => {

  const BACKEND_CLEAR_URL = "http://127.0.0.1:8000/clear-session";

    const handleClearSession = async () => {
    try {
      console.log("Clearing session...");
      await axios.get(BACKEND_CLEAR_URL);
      console.log("Session cleared on server.");
      clearSession();
    } catch (error) {
      console.error("Error clearing session on server:", error);
    }
  };

  return (
    <div className="navbar bg-gray-800 h-16 px-4 flex justify-between items-center text-white">
      <span className="text-xl font-semibold">RAG for News Articles</span>
      <button
        onClick={handleClearSession}
        className="btn btn-ghost text-xl text-white cursor-pointer hover:bg-red-500 hover:text-white transition duration-300 ease-in-out px-4 py-2 rounded-lg"
      >
        Clear Session
      </button>
    </div>
  );
};

export default NavBar;
