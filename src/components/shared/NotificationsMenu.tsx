import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { useNotifications } from './NotificationContext';
// import { Badge } from '../ui/badge'; // Unused for now if we use red dot

export function NotificationsMenu() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
    const [open, setOpen] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            refreshNotifications();
        }
    };

    const handleNotificationClick = (notification: any) => {
        markAsRead(notification.id);
        if (notification.relatedId) {
            console.log(`Navigation handler: Navigate to related resource ${notification.relatedId} (Type: ${notification.type})`);
        }
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        // Less than a minute
        if (diff < 60000) return 'Just now';

        // Less than an hour
        if (diff < 3600000) {
            const mins = Math.floor(diff / 60000);
            return `${mins}m ago`;
        }

        // Less than a day
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours}h ago`;
        }

        return date.toLocaleDateString();
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-gray-100 transition-colors">
                    <Bell className="h-5 w-5 text-gray-500" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] sm:w-[320px] p-0 shadow-lg border-gray-100 rounded-xl mr-2 sm:mr-0" align="end" sideOffset={8}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10 rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-gray-900">Notifications</h4>
                        {unreadCount > 0 && (
                            <span className="bg-red-50 text-red-600 text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-red-100">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6 px-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                            onClick={() => markAllAsRead()}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <div className="max-h-[60vh] sm:h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 gap-3">
                            <div className="bg-gray-50 p-3 rounded-full">
                                <Bell className="h-6 w-6 text-gray-300" />
                            </div>
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50/80">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`group relative p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer ${!notification.isRead ? 'bg-blue-50/40' : 'bg-white'
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-blue-500' : 'bg-transparent'
                                            }`} />

                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className={`text-sm leading-snug ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700 font-medium'
                                                    }`}>
                                                    {notification.title}
                                                </p>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium">
                                                    {getRelativeTime(notification.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {notification.message}
                                            </p>
                                            {notification.details && (
                                                <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-100 space-y-1">
                                                    {notification.details.itemName && (
                                                        <p className="font-medium text-gray-700 truncate">
                                                            {notification.details.itemName}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        {notification.details.toCity && (
                                                            <span className="flex items-center gap-1">
                                                                {notification.details.toCity}
                                                            </span>
                                                        )}
                                                        {notification.details.matchStatus && (
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${notification.details.matchStatus === 'accepted' ? 'bg-green-100 text-green-700' :
                                                                notification.details.matchStatus === 'rejected' || notification.details.matchStatus === 'declined' ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {notification.details.matchStatus}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
