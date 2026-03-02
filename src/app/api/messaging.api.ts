/**
 * Messaging API
 * Threads, messages, read/pin
 */

import { api, simulateDelay, isMockMode, type ApiResponse } from './client';
import { mockMessageThreads } from '../data/mockGamificationData';

export const messagingApi = {
  async getThreads(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: mockMessageThreads };
    }
    return api.get('/messages/threads');
  },

  async createThread(data: {
    type: string; title: string;
    participant_ids: string[]; linked_ride_id?: string;
  }): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: { id: 'thread-' + Date.now(), ...data } };
    }
    return api.post('/messages/threads', data);
  },

  async getThread(threadId: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      const thread = mockMessageThreads.find(t => t.id === threadId);
      return { success: true, data: { thread: thread || mockMessageThreads[0], messages: [] } };
    }
    return api.get(`/messages/threads/${threadId}`);
  },

  async sendMessage(threadId: string, data: {
    content: string; type?: string; metadata?: any;
  }): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          id: 'msg-' + Date.now(),
          thread_id: threadId,
          sender_id: 'current-user',
          sender_name: 'You',
          content: data.content,
          type: data.type || 'text',
          is_read: true,
          created_at: new Date().toISOString(),
        },
      };
    }
    return api.post(`/messages/threads/${threadId}/messages`, data);
  },

  async markRead(threadId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/messages/threads/${threadId}/read`);
  },

  async togglePin(threadId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/messages/threads/${threadId}/pin`);
  },
};
