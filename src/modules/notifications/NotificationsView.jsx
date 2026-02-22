import {Bell, ChevronRight, MessageSquare} from 'lucide-react';

// 2.5 Componente Visualizzazione Notifiche
export default function NotificationsView({notifications, onSelectClient}) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-600" /> Notifiche
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p>Non hai nuove notifiche da leggere.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map(notif => (
                            <div
                                key={notif.id || Math.random().toString()}
                                onClick={() => onSelectClient(notif.client)}
                                className="p-4 bg-blue-50 border border-blue-100 rounded-lg cursor-pointer hover:bg-blue-100 hover:shadow-sm transition-all flex justify-between items-center group gap-4"
                            >
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-blue-500 shrink-0 mt-1">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-blue-900 truncate">
                                            Nuovo messaggio da {notif.client.name}
                                            <span className="text-xs font-normal text-blue-600 ml-2 whitespace-nowrap">{notif.timestamp}</span>
                                        </p>
                                        <p className="text-sm text-blue-800 mt-1 truncate">{notif.text}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-2 rounded-full shadow-sm text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
