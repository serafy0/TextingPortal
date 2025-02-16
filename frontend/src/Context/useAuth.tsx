import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { BasicNotification } from "../Helpers/NotificationHelper";
import { UserProfile } from "../models/user/user";
import { loginAPI, registerAPI } from "../services/axiosAuthService";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = "Bearer " + storedToken;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (email: string, username: string, password: string) => {
    await registerAPI({ email, username, password })
      .then((res) => {
        if (res) {
          navigate("/login");
        }
      })
      .catch(() => BasicNotification("Server error occurred"));
  };

  const loginUser = async (email: string, password: string) => {
    return await loginAPI(email, password)
      .then((res) => {
        if (res) {
          // Optionally handle 400 status if needed
          if (res.status === 400) {
            BasicNotification("Invalid credentials");
            return;
          }
          localStorage.setItem("token", res.data.token);
          const userObj = {
            username: res.data.username,
            email: res.data.email,
            role: res.data.role,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res.data.token);
          setUser(userObj);
          BasicNotification("Login Success!");
          navigate("/dashboard");
        }
      })
      .catch(() => BasicNotification("Server error occurred"));
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
