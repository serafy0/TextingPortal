// src/services/authService.ts
import axios from 'axios';
import { LoginDTO } from '../models/auth/LoginDTO';
import { LoginResponseDTO } from '../models/auth/LoginResponse';
import { RegisterDTO } from '../models/auth/RegisterDTO';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44363';

export async function loginUser(loginData: LoginDTO): Promise<LoginResponseDTO> {
  try {
    const response = await axios.post<LoginResponseDTO>(`${API_BASE_URL}/api/Auth/login`, loginData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('something went wrong. Please try again.');
  }
}

export async function registerUser(registerData: RegisterDTO): Promise<{ message: string }> {
  try {
    const response = await axios.post<{ message: string }>(`${API_BASE_URL}/api/Auth/register`, registerData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('something went wrong.');
  }
}
