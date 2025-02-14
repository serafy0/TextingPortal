import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../models/user/user";
import { RegisterDTO } from "../models/auth/RegisterDTO";

const api = "https://localhost:44363/api/";

export const loginAPI = async (email: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "Auth/login", {
      email: email,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const registerAPI = async (
  user:RegisterDTO
) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "Auth/register", {
      email: user.email,
      username: user.username,
      password: user.password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};