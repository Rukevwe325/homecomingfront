import React, { useState, useEffect } from 'react';
import { User } from '../../App';
import {
    MessageSquare,
    Search,
    User as UserIcon,
    ArrowRight,
    MapPin,
    Clock,
    ChevronRight,
    Loader2,
    AlertCircle
} from 'lucide-react';
import api from '../../api/axiosInstance';
import { ChatView } from './ChatView';

interface InboxItem {
    matchId: number;
    lastMessage: string;
    lastMessageDate: string;
    otherParty: {
        id: string;
        firstName: string;
        lastName: string;
    };
    tripInfo: {
        from: string;
        to: string;
    };
}

interface MessagesProps {
    user: User;
    onNavigate: (view: string, params?: any) => void;
    initialMatchId?: number;
}

export function Messages({ user, onNavigate, initialMatchId }: MessagesProps) {
    const [selectedMatchId, setSelectedMatchId] = useState<number | null>(initialMatchId || null);
    const [inbox, setInbox] = useState<InboxItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInbox();
    }, []);

    const fetchInbox = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/messages/inbox');
            setInbox(response.data);
        } catch (err: any) {
            console.error('Error fetching inbox:', err);
            setError('Failed to load messages. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filteredInbox = inbox.filter(item =>
        `${item.otherParty.firstName} ${item.otherParty.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tripInfo.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tripInfo.to.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    if (loading && inbox.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading your messages...</p>
            </div>
        );
    }

    if (selectedMatchId) {
        return (
            <ChatView
                matchId={selectedMatchId}
                user={user}
                onBack={() => setSelectedMatchId(null)}
            />
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
                <p className="text-gray-600">Coordinate your package deliveries and trips.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                    <button
                        onClick={fetchInbox}
                        className="ml-auto text-sm font-semibold underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Search and Filters */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder=""
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Inbox List */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {filteredInbox.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {filteredInbox.map((item) => (
                            <button
                                key={item.matchId}
                                onClick={() => setSelectedMatchId(item.matchId)}
                                className="w-full flex items-center gap-4 p-4 lg:p-6 hover:bg-gray-50 transition-colors text-left group"
                            >
                                {/* Avatar */}
                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 border border-blue-100">
                                    <UserIcon className="w-6 h-6 lg:w-7 h-7" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-gray-900 truncate">
                                            {item.otherParty.firstName} {item.otherParty.lastName}
                                        </h3>
                                        <span className="text-xs lg:text-sm text-gray-500 whitespace-nowrap ml-2">
                                            {formatTime(item.lastMessageDate)}
                                        </span>
                                    </div>

                                    {/* Trip Info Mini Badge */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-md text-[10px] lg:text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            <MapPin className="w-3 h-3" />
                                            <span>{item.tripInfo.from}</span>
                                            <ArrowRight className="w-2.5 h-2.5" />
                                            <span>{item.tripInfo.to}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 truncate line-clamp-1 group-hover:text-gray-900 transition-colors">
                                        {item.lastMessage}
                                    </p>
                                </div>

                                {/* Chevron */}
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                            <MessageSquare className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No messages found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            {searchTerm ? `No results match "${searchTerm}"` : "You haven't started any conversations yet."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
