import { SetStateAction } from 'react';
import apiClient from './apiClient';

interface CreateMessageTemplate{
    title: string;
    body: string;
}

interface ReadMessageTemplateDTO extends CreateMessageTemplate{
    id: number;
}

// Fetch paginated message templates
export const getMessageTemplates = async (params: {
    pageIndex?: number;
    pageSize?: number;
    sortColumn?: string;
    sortOrder?: string;
    filterColumn?: string;
    filterQuery?: string;
}) => {
    const response = await apiClient.get<{
      totalPages: SetStateAction<number>; data: ReadMessageTemplateDTO[] 
}>('/MessageTemplates', { params });
    return response.data;
};

// Get a single message template by id
export const getMessageTemplate = async (id: number) => {
    const response = await apiClient.get<ReadMessageTemplateDTO>(`/MessageTemplates/${id}`);
    return response.data;
};

// Create a new message template (requires admin role)
export const createMessageTemplate = async (newTemplate: CreateMessageTemplate) => {
    const response = await apiClient.post('/MessageTemplates', newTemplate);
    return response.data;
};

// Update an existing message template (requires admin role)
export const updateMessageTemplate = async (id: number, updatedTemplate: CreateMessageTemplate) => {
    const response = await apiClient.put(`/MessageTemplates/${id}`, updatedTemplate);
    return response.data;
};

// Delete a message template (requires admin role)
export const deleteMessageTemplate = async (id: number) => {
    const response = await apiClient.delete(`/MessageTemplates/${id}`);
    return response.data;
};