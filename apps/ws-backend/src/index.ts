import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = require("@repo/backend-common/config");
import type { WebSocket } from "ws";
const { prismaClient } = require("@repo/db/client");

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
  userName: string;
}

const users: User[] = [];

async function checkUser(
  token: string
): Promise<{ userId: string; userName: string } | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string" || !decoded?.userId) return null;

    const user = await prismaClient.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true },
    });

    return user ? { userId: user.id, userName: user.name } : null;
  } catch (e) {
    return null;
  }
}

wss.on("connection", async function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryPrams = new URLSearchParams(url.split("?")[1]);
  const token = queryPrams.get("token") || "";
  const userInfo = await checkUser(token);

  if (!userInfo) {
    ws.close();
    return;
  }

  const user: User = {
    ws,
    rooms: [],
    userId: userInfo.userId,
    userName: userInfo.userName,
  };
  users.push(user);

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data.toString());

    if (parsedData.type === "join_room") {
      user.rooms.push(parsedData.roomId);

      broadcastToRoom(
        parsedData.roomId,
        {
          type: "user_joined",
          userId: user.userId,
          userName: user.userName,
          roomId: parsedData.roomId,
        },
        user.userId
      );
    }

    if (parsedData.type === "draw") {
      const { roomId, shape } = parsedData;

      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message: JSON.stringify({
            shape,
            userId: user.userId,
            userName: user.userName,
          }),
          userId: user.userId,
        },
      });

      broadcastToRoom(
        roomId,
        {
          type: "draw",
          shape,
          userId: user.userId,
          userName: user.userName,
          roomId,
        },
        user.userId
      );
    }

    if (parsedData.type === "delete") {
      const { roomId, index } = parsedData;
      const shapes = await prismaClient.chat.findMany({
        where: { roomId: Number(roomId) },
        orderBy: { id: "asc" },
      });

      const shapeToDelete = shapes[index];
      if (shapeToDelete) {
        try {
          await prismaClient.chat.delete({ where: { id: shapeToDelete.id } });
        } catch (e) {
          console.error("Delete failed:", e);
        }
      }
      
      broadcastToRoom(roomId, {
        type: "delete",
        index,
        userId: user.userId,
        roomId
      });
    }
  }); 

  ws.on("close", () => {
    user.rooms.forEach(roomId => {
      broadcastToRoom(roomId, {
        type: "user_left",
        userId: user.userId,
        userName: user.userName,
        roomId
      }, user.userId);
    });

    const index = users.indexOf(user);
    if (index > -1) users.splice(index, 1);
  });
}); 

function broadcastToRoom(roomId: string, message: any, excludeUserId?: string) {
  users.forEach((user) => {
    if (user.rooms.includes(roomId) && user.userId !== excludeUserId) {
      user.ws.send(JSON.stringify(message));
    }
  });
}
