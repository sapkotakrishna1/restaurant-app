import {
  createContext,
  useContext,
  useState
} from "react";


// Create context
const AuthContext = createContext();


// Provider
export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });


  // =========================
  // LOGIN
  // =========================

  const login = (token, user) => {

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);
  };


  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isLoggedIn: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// Custom hook
export const useAuth = () => {

  return useContext(AuthContext);

};