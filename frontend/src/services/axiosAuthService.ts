import apiClient from "./apiClient";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../models/user/user";
import { RegisterDTO } from "../models/auth/RegisterDTO";

// Login API call: uses our apiClient with interceptors
export const loginAPI = async (email: string, password: string) => {
  try {
    const data = await apiClient.post<UserProfileToken>("Auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

// Register API call: uses our apiClient with interceptors
export const registerAPI = async (user: RegisterDTO) => {
  try {
    const data = await apiClient.post<UserProfileToken>("Auth/register", {
      email: user.email,
      username: user.username,
      password: user.password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};
