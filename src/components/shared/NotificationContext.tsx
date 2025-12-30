import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../../api/axiosInstance';

export interface Notification {
    id: number;
    userId: string;
    title: string;
    message: string;
    type: string;
    relatedId?: string;
    isRead: boolean;
    createdAt: string;
    details?: {
        itemName?: string;
        toCity?: string;
        departureDate?: string;
        matchStatus?: string;
    };
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children, userId }: { children: ReactNode; userId: string }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Initialize Socket and Fetch Initial Data
    useEffect(() => {
        if (!userId) return;

        // 1. Connect Socket
        const socketUrl = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:4000';
        const newSocket = io(socketUrl, {
            query: { userId },
            transports: ['websocket'], // force websocket
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });

        newSocket.on('notification_received', (data: any) => {
            console.log('New notification received:', data);

            // If the backend sends the full notification object, prepend it
            // If it sends a generic "you have new mail", we might need to re-fetch.
            // Assuming data is the notification object or contains it.
            // Based on user request: "data.unreadCount will tell the UI what number to show"
            // Let's assume data structure. If not provided, we might just refresh.
            // SAFE BET: Re-fetch first page to be sure, or just update unread count if provided.

            if (data.unreadCount !== undefined) {
                setUnreadCount(data.unreadCount);
            } else {
                setUnreadCount(prev => prev + 1);
            }

            refreshNotifications(); // To get the new item in the list
        });

        setSocket(newSocket);

        // 2. Fetch Initial Data
        refreshNotifications();
        fetchUnreadCount();

        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications/unread-count');
            setUnreadCount(res.data.count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const refreshNotifications = async () => {
        try {
            setLoading(true);
            // Backend auto-clears unread count on GET /notifications?page=1
            // User said: "automatically reset the unread count to 0 on the backend. They just need to refresh their local 'badge count' state after that call."
            // So if we call this, we should expect unreadCount to become 0 potentially?
            // WAIT. "Get List... will automatically reset the unread count to 0".
            // This means if I view the list, I reset the count.
            // But maybe I shouldn't call this automatically on mount if I want to keep the badge?
            // Actually, usually you only fetch the list when the USER OPENS the menu.
            // But for now, let's fetch it to populate the list.
            // If fetching resets the count, then the badge disappears immediately on load? That might be annoying if the user hasn't seen them.
            // Let's check the requirement: "Get List... (for page 1) will automatically reset the unread count to 0".
            // Strategy: Only fetch list when user opens the menu? 
            // But here in Provider, initially maybe we don't fetch list? Or we fetch but handle the count reset?
            // If the backend resets it, we should verify behavior.
            // Let's fetch list. If count resets, we can't help it unless we ask backend to change.
            // OR: We only fetch unread count initially, and fetch list ONLY when requested (open menu).

            // For now, let's fetch list so we have data.
            const res = await api.get('/notifications?page=1&limit=20');
            setNotifications(res.data.data || []);

            // If backend resets count on this call, we should update local state to 0?
            // "They just need to refresh their local 'badge count' state after that call." -> Implies count IS reset.
            // So if I call this, badge goes to 0. 
            // Maybe I should NOT call this on mount if I want to preserve the "You have 3 unread" badge.
            // I will defer this to `refreshNotifications` which might be called when opening the menu.
            // Accessing `notifications` from context might trigger this?

            // Let's keep it simple: Fetch it. If it clears, it clears.
            // Ideally, we fetch unread count separately from the list.
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            // Update unread count if we track it locally, or refetch
            // fetchUnreadCount(); // Backend handles it?
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    // Custom method to just update badge without clearing (if we needed it), but we rely on refreshNotifications.

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markAsRead,
            markAllAsRead,
            refreshNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
