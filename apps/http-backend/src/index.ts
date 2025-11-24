import express from "express";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = require("@repo/backend-common/config");
import { middleware } from "./middleware";
const {
  CreateuserSchema,
  SignInSchema,
  CreateRoomSchema,
} = require("@repo/common/types");
const { prismaClient } = require("@repo/db/client");
import bcrypt from "bcrypt";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", async (req, res) => {
  const parsedData = CreateuserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        password: hashedPassword,
        name: parsedData.data.name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "Ussr already exists with this username",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
    },
  });

  if (
    !user ||
    !(await bcrypt.compare(parsedData.data.password, user.password))
  ) {
    res.status(403).json({
      message: "user not authorized",
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );

  res.json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  // @ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "room already existwith this name",
    });
  }
});

app.get("/rooms", middleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  const rooms = await prismaClient.room.findMany({
    where: { adminId: userId },
    orderBy: { createAt: "desc" },
  });
  res.json({ rooms });
});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch {
    res.json({
      messages: [],
    });
  }
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    room,
  });
});

app.delete("/room/:roomId", middleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const roomId = Number(req.params.roomId);

    const room = await prismaClient.room.findFirst({
      where: { id: roomId, adminId: userId },
    });

    if (!room) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await prismaClient.room.delete({
      where: { id: roomId },
    });

    res.json({ message: "Room deleted successfully" });
  } catch (e) {
    console.error("Delete error:", e);
    res.status(411).json({ message: "Failed to delete room" });
  }
});

app.listen(3001);
