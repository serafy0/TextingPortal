import apiClient from './apiClient';

export interface MessageLog {
  id: number;
  parsedBody: string;
}

export interface MessageLogDetail {
  id: number;
  parsedBody: string;
  messages: {
    id: string;
    sent: boolean;
    dateCreated: string;
    to: string;
    errorCode?: number;
    errorMessage?: string;
  }[];
  sentById: string;
  messageTemplateId: number;
}

export interface MessageLogsResponse {
  data: MessageLog[];
  totalPages: number;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getMessageLogs = async (params: {
  pageIndex?: number;
  pageSize?: number;
  sortColumn?: string;
  sortOrder?: string;
  filterColumn?: string;
  filterQuery?: string;
}) => {
  const response = await apiClient.get<MessageLogsResponse>('/MessageLogs', { params });
  return response.data;
};

export const getMessageLogDetail = async (id: number) => {
  const response = await apiClient.get<MessageLogDetail>(`/MessageLogs/${id}`);
  return response.data;
};
