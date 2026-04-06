import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../features/auth/authStore.js";

const url = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:5000";
const socket = io(url, { withCredentials: true, autoConnect: false });

export function useSocket() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user?.id) return;
    if (!socket.connected) socket.connect();
    socket.emit("join", { userId: user.id });
    
    // We don't disconnect here because components share this single socket.
    // It's connected as long as user is present.
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id && socket.connected) {
      socket.disconnect();
    }
  }, [user?.id]);

  return socket;
}

