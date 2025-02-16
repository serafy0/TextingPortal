import apiClient from './apiClient';

interface SendMessageRequest {
  phoneNumListIds: number[];
  messageBody: string;
  messageTemplateId: number;
}

export const sendMessageToLists = async (data: SendMessageRequest) => {
  const response = await apiClient.post('/Messages/send/lists', data);
  return response;  
}
