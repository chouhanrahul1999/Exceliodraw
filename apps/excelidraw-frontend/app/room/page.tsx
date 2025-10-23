"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { InputBox } from "../components/ui/InputBox";
import { useRouter } from "next/navigation";

interface Room {
  id: number;
  slug: string;
}

export default function RoomPage() {
  const nameRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  const getToken = () => `Bearer ${localStorage.getItem("token")}`;

  useEffect(() => {
    fetchRooms();
    
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:3001/rooms", {
        headers: { Authorization: getToken() }
      });
      setRooms(res.data.rooms || []);
    } catch (err: any) {
      setError("Failed to fetch rooms");
    }
  };

  const handleCreateRoom = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const name = nameRef.current?.value?.trim();
    if (!name) {
      setError("Room name required");
      setLoading(false);
      return;
    }
    try {
      await axios.post(
        "http://localhost:3001/room",
        { name },
        { headers: { Authorization: getToken() } }
      );
      setSuccess("Room created successfully!");
      if (nameRef.current) nameRef.current.value = "";
      await fetchRooms();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to create room"
      );
    } finally {
      setLoading(false);
    }
  };

  // Join room: redirect to /chats/:roomId
  const handleJoinRoom = (roomId: number) => {
    router.push(`/canvas/${roomId}`);
  };

  return (
    <div className="max-w-md pl-8 pt-4 align-">
      <h1 className="text-2xl font-bold mb-4 ">Create a Room</h1>
      <div className="flex gap-2 mb-4 justify-items-center align items-end">
        <div className=" pr-4">
          <InputBox
            label="Room Name"
            placeholder="Enter room name"
            type="text"
            ref={nameRef}
          />
        </div>
        <div>
          <Button
            size="md"
            variant="primary"
            text={loading ? "Creating..." : "Create"}
            onClick={handleCreateRoom}
          />
        </div>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}

      <h2 className="text-xl font-semibold mt-8 mb-2">Your Rooms</h2>
      <div className="flex flex-col gap-2">
        {rooms.length === 0 && <div>No rooms found.</div>}
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex items-center justify-between rounded px-4 py-2"
          >
            <span className="text-xl font-medium">{room.slug}</span>
            <Button
              size="md"
              variant="secondary"
              text="Join"
              onClick={() => handleJoinRoom(room.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}