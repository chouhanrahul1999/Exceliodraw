"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";
import { useAuth } from "@/app/contexts/AuthContext";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [mounted, setMounted] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
      setSocket(ws);
    };

    return () => {
      ws.close();
    };
  }, [token, roomId]);

  if (!mounted || !token) {
    return <div>Please sign in to collaborate</div>;
  }

  return (
      <Canvas roomId={roomId} socket={socket} user={user} />
  );
}
