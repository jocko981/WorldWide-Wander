import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Jovan",
  email: "jovannikolic17@gmail.com",
  password: "test",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

const initialState = {
  hasAuth: false,
  user: null,
  error: "",
};

function reducer(currState, action) {
  switch (action.type) {
    case "login":
      return { ...currState, hasAuth: true, user: action.payload };

    case "logout":
      return { ...currState, hasAuth: false, user: null };

    default:
      throw new Error("Unknown action type for AuthContext");
  }
}

function AuthContextProvider({ children }) {
  const [{ error, hasAuth, user }, dispatch] = useReducer(reducer, initialState);

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ error, hasAuth, user, login, logout }}>{children}</AuthContext.Provider>
  );
}

function useAuthContext() {
  const contextValue = useContext(AuthContext);

  if (contextValue === undefined) throw new Error("AuthContext was used outside of the <AuthContextProvider>");
  return contextValue;
}

export { AuthContextProvider, useAuthContext };
