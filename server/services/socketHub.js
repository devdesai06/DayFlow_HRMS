let ioRef = null;

export function attachSocket(io) {
  ioRef = io;
  io.on("connection", (socket) => {
    socket.on("join", ({ userId }) => {
      if (typeof userId === "string" && userId.trim()) {
        socket.join(`user:${userId}`);
      }
    });
  });
}

export function getIO() {
  if (!ioRef) throw new Error("Socket.io not initialized");
  return ioRef;
}

