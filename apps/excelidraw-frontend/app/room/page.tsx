"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { ExButton } from "../components/ui/ExButton";
import { InputBox } from "../components/ui/InputBox";
import { useRouter } from "next/navigation";
import { Plus, LogIn, Copy, Check, Trash2 } from "lucide-react";
import { TopNavbar } from "../components/section/TopNavbar";
import { Footer } from "../components/section/Footer";
import { MdOutlineCreate } from "react-icons/md";

interface Room {
  id: number;
  slug: string;
}

export default function RoomPage() {
  const nameRef = useRef<HTMLInputElement>(null);
  const joinRoomNameRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const router = useRouter();

  const getToken = () => `Bearer ${localStorage.getItem("token")}`;

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:3001/rooms", {
        headers: { Authorization: getToken() },
      });
      console.log("Fetched rooms:", res.data.rooms);
      setRooms(res.data.rooms || []);
    } catch (err: any) {
      console.error("Error fetching rooms:", err);
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
        err.response?.data?.message || err.message || "Failed to create room"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (roomId: number) => {
    router.push(`/canvas/${roomId}`);
  };

  const handleJoinByRoomName = async () => {
    setError(null);
    const roomName = joinRoomNameRef.current?.value?.trim();
    if (!roomName) {
      setError("Room name required");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:3001/room/${roomName}`);
      if (res.data.room) {
        handleJoinRoom(res.data.room.id);
      } else {
        setError("Room not found");
      }
    } catch (err: any) {
      setError("Room not found");
    }
  };

  const copyToClipboard = (roomId: number) => {
    navigator.clipboard.writeText(roomId.toString());
    setCopiedId(roomId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      console.log("Deleting room:", roomId);
      const response = await axios.delete(`http://localhost:3001/room/${roomId}`, {
        headers: { Authorization: getToken() },
      });
      console.log("Delete response:", response);
      setSuccess("Room deleted successfully!");
      await fetchRooms();
    } catch (err: any) {
      console.error("Delete error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to delete room");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNavbar />
      <div className="px-6 md:px-14 py-10">

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Create Room Section */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <MdOutlineCreate className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-sans  font-bold text-gray-900">Create Room</h2>
            </div>

            <div className="space-y-4">
              <InputBox
                label="Room Name"
                placeholder="e.g., Design Sprint"
                type="text"
                ref={nameRef}
              />
              <ExButton
                size="md"
                variant="primary"
                text={loading ? "Creating..." : "Create Room"}
                onClick={handleCreateRoom}
              />
            </div>

            {error && <div className="text-red-600 text-sm mt-3">{error}</div>}
            {success && (
              <div className="text-green-600 text-sm mt-3">{success}</div>
            )}
          </div>

          {/* Join Room Section */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <LogIn className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Join Room</h2>
            </div>

            <div className="space-y-4">
              <InputBox
                label="Room Name"
                placeholder="Enter room name"
                type="text"
                ref={joinRoomNameRef}
              />
              <ExButton
                size="md"
                variant="primary"
                text="Join Room"
                onClick={handleJoinByRoomName}
              />
            </div>
          </div>
        </div>

        {/* Your Rooms Section */}
        <div>
          <h2 className="text-2xl font-sans pl-4 font-bold text-gray-900 mb-6">Your Rooms</h2>

          {rooms.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
              <p className="text-gray-600">
                No rooms yet. Create one to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all flex items-center justify-between group"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Room ID: {room.id}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {room.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => copyToClipboard(room.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy room ID"
                    >
                      {copiedId === room.id ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete room"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <ExButton
                      size="sm"
                      variant="primary"
                      text="Join"
                      onClick={() => handleJoinRoom(room.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}