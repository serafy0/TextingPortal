import apiClient from './apiClient';

export interface PhoneListDTO {
  id: number;
  title: string;
}

export interface CreatePhoneListDTO {
  title: string;
}

export interface PhoneNumberDTO {
  number: string;
}

export interface GetPhoneNumberDTO extends PhoneNumberDTO {
  id: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getPhoneLists = async (params: {
  pageIndex?: number;
  pageSize?: number;
  sortColumn?: string;
  sortOrder?: string;
  filterColumn?: string;
  filterQuery?: string;
}) => {
  const response = await apiClient.get<PaginatedResponse<PhoneListDTO>>('/PhoneNumLists', { params });
  return response.data;
};

export const getPhoneList = async (id: number) => {
  const response = await apiClient.get<PhoneListDTO>(`/PhoneNumLists/${id}`);
  return response.data;
};

export const getPhoneListWithNumbers = async (id: number) => {
  const response = await apiClient.get<{ id: number; title: string; phoneNumbers: GetPhoneNumberDTO[] }>(`/PhoneNumLists/num/${id}`);
  return response.data;
};

export const createPhoneList = async (data: CreatePhoneListDTO) => {
  const response = await apiClient.post<PhoneListDTO>('/PhoneNumLists', data);
  return response.data;
};

export const deletePhoneList = async (id: number) => {
  await apiClient.delete(`/PhoneNumLists/${id}`);
};

export const addPhoneNumbersToList = async (listId: number, numbers: PhoneNumberDTO[]) => {
  const response = await apiClient.post<{ newNumbers: GetPhoneNumberDTO[] }>(`/PhoneNumLists/bulk/${listId}`, numbers);
  return response.data;
};
