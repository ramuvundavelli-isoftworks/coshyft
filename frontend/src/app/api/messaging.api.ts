/**
 * Messaging API
 * Threads, messages, read/pin
 */

import { api, type ApiResponse } from './client';

export const messagingApi = {
  async getThreads(): Promise<ApiResponse> {
    return api.get('/messages/threads');
  },

  async createThread(data: {
    type: string; title: string;
    participant_ids: string[]; linked_ride_id?: string;
  }): Promise<ApiResponse> {
    return api.post('/messages/threads', data);
  },

  async getThread(threadId: string): Promise<ApiResponse> {
    return api.get(`/messages/threads/${threadId}`);
  },

  async sendMessage(threadId: string, data: {
    content: string; type?: string; metadata?: any;
  }): Promise<ApiResponse> {
    return api.post(`/messages/threads/${threadId}/messages`, data);
  },

  async markRead(threadId: string): Promise<ApiResponse> {
    return api.put(`/messages/threads/${threadId}/read`);
  },

  async togglePin(threadId: string): Promise<ApiResponse> {
    return api.put(`/messages/threads/${threadId}/pin`);
  },
};
