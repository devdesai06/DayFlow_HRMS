import { PageWrapper } from "../../components/layout/PageWrapper.jsx";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { Tooltip } from "../../components/ui/Tooltip.jsx";
import { useSocket } from "../../hooks/useSocket.js";
import { fetchNotifications, markNotificationRead } from "./notificationApi.js";

export function NotificationsPanel() {
  const qc = useQueryClient();
  const socket = useSocket();
  const [open, setOpen] = useState(false);

  const listQ = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications({ page: 1, limit: 30 }),
  });

  const rows = listQ.data?.data?.rows || [];
  const unread = Number(listQ.data?.data?.unread || 0);

  const markM = useMutation({
    mutationFn: (id) => markNotificationRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    function onNew(n) {
      toast.message(n.title, { description: n.message });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    }
    socket.on("notification:new", onNew);
    return () => {
      socket.off("notification:new", onNew);
    };
  }, [socket, qc]);

  const unreadBadge = useMemo(() => {
    if (!unread) return null;
    return (
      <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1.5 text-xs font-extrabold text-white">
        {unread > 99 ? "99+" : unread}
      </span>
    );
  }, [unread]);

  return (
    <PageWrapper>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">
            Notifications {unreadBadge}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Real-time updates via Socket.io with a clean inbox.
          </div>
        </div>
        <Button variant="subtle" onClick={() => setOpen(true)}>
          <Bell className="h-4 w-4" />
          Open panel
        </Button>
      </div>

      <div className="mt-6 card p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold tracking-tight">Inbox</div>
          <Badge tone={unread ? "red" : "slate"}>{unread} unread</Badge>
        </div>
        <div className="mt-3 grid gap-2">
          {rows.slice(0, 6).map((n) => (
            <div
              key={n._id}
              className="group rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition-premium"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">
                    {n.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-600 truncate">
                    {n.message}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 font-mono">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {!n.readAt ? (
                  <div className="opacity-0 group-hover:opacity-100 transition-premium">
                    <Tooltip content="Mark read">
                      <Button
                        size="sm"
                        variant="subtle"
                        disabled={markM.isPending}
                        onClick={() => markM.mutate(n._id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </div>
                ) : (
                  <Badge tone="slate">Read</Badge>
                )}
              </div>
            </div>
          ))}
          {!rows.length ? (
            <EmptyState
              title="No notifications"
              description="When approvals, payroll, or attendance events happen, you’ll see them here instantly."
            />
          ) : null}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Notification panel"
        description="Slide-in panel behavior (modal) with fast actions."
        className="max-w-2xl"
        footer={
          <div className="flex items-center justify-end">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="grid gap-2">
          {rows.map((n) => (
            <div
              key={n._id}
              className="rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition-premium"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">
                    {n.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {n.message}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 font-mono">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {!n.readAt ? (
                  <Button
                    size="sm"
                    variant="subtle"
                    disabled={markM.isPending}
                    onClick={() => markM.mutate(n._id)}
                  >
                    <Check className="h-4 w-4" />
                    Mark read
                  </Button>
                ) : (
                  <Badge tone="slate">Read</Badge>
                )}
              </div>
            </div>
          ))}
          {!rows.length ? (
            <EmptyState
              title="Nothing to show"
              description="You’ll see real-time notifications here once events start flowing."
            />
          ) : null}
        </div>
      </Modal>
    </PageWrapper>
  );
}

