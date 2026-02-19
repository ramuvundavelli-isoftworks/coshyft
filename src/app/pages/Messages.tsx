import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  Search,
  MessageCircle,
  Users,
  Car,
  MoreVertical,
  Pin,
  Archive,
  Trash2,
  CheckCheck,
  Clock,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  MessageThread,
  filterThreads,
  sortThreadsByRecent,
  getTotalUnreadCount,
  formatMessageTime,
  getMessagePreview,
} from '../utils/messaging';
import { mockMessageThreads } from '../data/mockGamificationData';
import ChatModal from '../components/carpooling/ChatModal';

export default function Messages() {
  const [threads, setThreads] = useState<MessageThread[]>(mockMessageThreads);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const filteredThreads = sortThreadsByRecent(
    filterThreads(threads, searchQuery).filter((t) => !t.isArchived)
  );

  const unreadCount = getTotalUnreadCount(filteredThreads);

  const handleThreadClick = (thread: MessageThread) => {
    setSelectedThread(thread);
    setIsChatOpen(true);

    // Mark as read
    setThreads(
      threads.map((t) =>
        t.id === thread.id ? { ...t, unreadCount: 0 } : t
      )
    );
  };

  const handlePinThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(
      threads.map((t) =>
        t.id === threadId ? { ...t, isPinned: !t.isPinned } : t
      )
    );
    toast.success('Thread pinned');
  };

  const handleArchiveThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(
      threads.map((t) =>
        t.id === threadId ? { ...t, isArchived: true } : t
      )
    );
    toast.success('Thread archived');
  };

  const handleDeleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      setThreads(threads.filter((t) => t.id !== threadId));
      toast.success('Thread deleted');
    }
  };

  const getThreadIcon = (type: MessageThread['type']) => {
    switch (type) {
      case 'ride':
        return <Car className="h-4 w-4" />;
      case 'group':
        return <Users className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            Chat with your carpool partners and commute buddies
          </p>
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Conversations</span>
            <MessageCircle className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {threads.filter((t) => !t.isArchived).length}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Unread Messages</span>
            <Badge className="bg-red-600">{unreadCount}</Badge>
          </div>
          <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Rides</span>
            <Car className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {threads.filter((t) => t.type === 'ride').length}
          </p>
        </Card>
      </div>

      {/* Messages List */}
      <Card className="overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="divide-y">
          {filteredThreads.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No conversations found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Start a conversation with your carpool partners'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const otherParticipants = thread.participants.filter(
                (p) => p.id !== 'user-current'
              );

              return (
                <div
                  key={thread.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    thread.unreadCount > 0 ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleThreadClick(thread)}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {thread.type === 'group' ? (
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                      ) : (
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {otherParticipants[0]?.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {otherParticipants[0]?.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {thread.isPinned && (
                          <Pin className="h-3 w-3 text-blue-600" />
                        )}
                        <h3
                          className={`font-semibold truncate ${
                            thread.unreadCount > 0
                              ? 'text-gray-900'
                              : 'text-gray-700'
                          }`}
                        >
                          {thread.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1"
                        >
                          {getThreadIcon(thread.type)}
                          {thread.type}
                        </Badge>
                      </div>

                      {thread.lastMessage && (
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm truncate flex-1 ${
                              thread.unreadCount > 0
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-600'
                            }`}
                          >
                            {thread.lastMessage.senderId === 'user-current' && (
                              <>
                                <CheckCheck className="h-3 w-3 inline mr-1 text-blue-600" />
                                You:{' '}
                              </>
                            )}
                            {getMessagePreview(thread.lastMessage)}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatMessageTime(thread.lastMessage.timestamp)}
                          </span>
                        </div>
                      )}

                      {/* Metadata */}
                      {thread.type === 'ride' && thread.metadata?.rideDate && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(thread.metadata.rideDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions & Badge */}
                    <div className="flex items-center gap-2">
                      {thread.unreadCount > 0 && (
                        <Badge className="bg-red-600">{thread.unreadCount}</Badge>
                      )}

                      {/* Dropdown Menu */}
                      <div className="relative group">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>

                        {/* Dropdown - simplified for demo */}
                        <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg border py-1 min-w-[150px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10">
                          <button
                            onClick={(e) => handlePinThread(thread.id, e)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Pin className="h-3 w-3" />
                            {thread.isPinned ? 'Unpin' : 'Pin'}
                          </button>
                          <button
                            onClick={(e) => handleArchiveThread(thread.id, e)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Archive className="h-3 w-3" />
                            Archive
                          </button>
                          <button
                            onClick={(e) => handleDeleteThread(thread.id, e)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Chat Modal */}
      {selectedThread && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setSelectedThread(null);
          }}
          thread={selectedThread}
          currentUserId="user-current"
          onSendMessage={(message) => {
            // Update thread with new message
            setThreads(
              threads.map((t) =>
                t.id === selectedThread.id
                  ? {
                      ...t,
                      lastMessage: message,
                      updatedAt: new Date(),
                    }
                  : t
              )
            );
          }}
        />
      )}
    </div>
  );
}
