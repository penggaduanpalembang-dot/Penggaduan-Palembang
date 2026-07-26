import { Bell, CheckCircle2, User, UserCheck, AlertCircle, Trash2, X } from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "manager" | "officer" | "public";
  isRead: boolean;
}

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onClose
}: NotificationCenterProps) {
  
  const getIcon = (type: "manager" | "officer" | "public") => {
    switch (type) {
      case "manager":
        return (
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <UserCheck className="w-4 h-4" />
          </div>
        );
      case "officer":
        return (
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
      case "public":
        return (
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100">
      
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs font-sans">
          <Bell className="w-4 h-4 text-emerald-600 animate-swing" />
          <span>Notifikasi Sistem ({notifications.filter((n) => !n.isRead).length})</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <button 
            onClick={onMarkAllAsRead}
            className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold"
          >
            Tandai Dibaca
          </button>
          <button 
            onClick={onClearAll}
            className="text-gray-400 hover:text-rose-500 font-semibold"
          >
            Bersihkan
          </button>
          <button 
            onClick={onClose}
            className="p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            Tidak ada notifikasi baru
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`p-4 flex items-start gap-3 transition-colors ${notif.isRead ? 'bg-white' : 'bg-emerald-50/10'}`}
            >
              {getIcon(notif.type)}
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="font-bold text-gray-800 truncate">{notif.title}</h4>
                  <span className="text-[9px] text-gray-400 font-mono whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5 whitespace-normal break-words">{notif.body}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
