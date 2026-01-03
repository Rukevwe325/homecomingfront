import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../App';
import {
    ArrowLeft,
    Send,
    Loader2,
    AlertCircle,
    MapPin,
    ArrowRight,
    User as UserIcon
} from 'lucide-react';
import api from '../../api/axiosInstance';

interface ChatMessage {
    id: number;
    matchId: number;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

interface ChatHistory {
    chatInfo: {
        matchId: number;
        status: string;
        otherParty: {
            id: string;
            firstName: string;
            lastName: string;
        };
        tripDetails: {
            from: string;
            to: string;
        }
    };
    messages: ChatMessage[];
}

interface ChatViewProps {
    user: User;
    matchId: number;
    onBack: () => void;
}

export function ChatView({ user, matchId, onBack }: ChatViewProps) {
    const [history, setHistory] = useState<ChatHistory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchHistory();
        // Poll for new messages every 5 seconds (primitive real-time)
        const interval = setInterval(fetchHistory, 5000);
        return () => clearInterval(interval);
    }, [matchId]);

    useEffect(() => {
        scrollToBottom();
    }, [history?.messages]);

    const fetchHistory = async () => {
        try {
            const response = await api.get(`/messages/match/${matchId}`);
            setHistory(response.data);
        } catch (err: any) {
            if (loading) { // Only set error state on initial load
                setError('Failed to load chat history.');
            }
            console.error('Error fetching chat history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            const tempMessage = newMessage;
            setNewMessage(''); // Clear input immediately for UX

            const response = await api.post('/messages', {
                matchId,
                content: tempMessage
            });

            // Optimistically add the message to history
            if (history) {
                setHistory({
                    ...history,
                    messages: [...history.messages, response.data]
                });
            }
        } catch (err: any) {
            console.error('Error sending message:', err);
            // Re-set input on failure? Or just show error
            alert('Failed to send message.');
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading && !history) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading chat history...</p>
            </div>
        );
    }

    if (error && !history) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Error</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => { setLoading(true); fetchHistory(); }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    const otherParty = history?.chatInfo.otherParty;
    const trip = history?.chatInfo.tripDetails;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-160px)] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
            {/* Sticky Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10 shadow-sm">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 border border-blue-100">
                    <UserIcon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate tracking-tight">
                        {otherParty?.firstName} {otherParty?.lastName}
                    </h3>
                    {trip && (
                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            <span>{trip.from}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                            <span>{trip.to}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] custom-scrollbar">
                {history?.messages.map((msg, index) => {
                    const isMe = msg.senderId === user.id;
                    return (
                        <div
                            key={msg.id || index}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div
                                className={`max-w-[85%] lg:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm text-sm relative group ${isMe
                                        ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none'
                                        : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                                    }`}
                            >
                                <div className="mb-1 leading-relaxed">{msg.content}</div>
                                <div className={`text-[10px] text-right font-medium opacity-60`}>
                                    {formatTime(msg.createdAt)}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Input Footer */}
            <footer className="bg-[#f0f2f5] px-4 py-3 border-t border-gray-200 lg:px-8">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 max-w-4xl mx-auto"
                >
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder:text-gray-400"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className={`p-3 rounded-full transition-all shadow-md ${!newMessage.trim() || sending
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                            }`}
                    >
                        {sending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5 fill-current" />
                        )}
                    </button>
                </form>
            </footer>
        </div>
    );
}
