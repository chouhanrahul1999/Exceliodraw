import React, { useEffect, useRef, useState } from "react";
import { Hand, Pencil, Square, Circle, ArrowRight, Minus, Eraser, Type, LockKeyhole, PanelsTopLeft, Share2, Menu } from "lucide-react";
import { Game } from "../draw/Game";

type Tool = "circle" | "rect" | "pencil" | "eraser" | "text" | "select" | "arrow" | "line";

export function Canvas({ roomId, socket, user }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textEditorRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("select");
  const [zoom, setZoom] = useState(100);
  const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (canvasRef.current && user && socket && socket.readyState === WebSocket.OPEN) {
      const g = new Game(canvasRef.current, roomId, socket, user);
      gameRef.current = g;
      setGame(g);
      return () => g.destroy();
    }
  }, [user, roomId, socket]);

  useEffect(() => {
    if (game && selectedTool !== "text") {
      game.setTool(selectedTool);
    }
  }, [selectedTool, game]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        gameRef.current?.resizeSelected(1.1);
      } else if (e.key === "-") {
        e.preventDefault();
        gameRef.current?.resizeSelected(0.9);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        gameRef.current?.undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        gameRef.current?.redo();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (selectedTool === "text") {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setTextPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setTimeout(() => textEditorRef.current?.focus(), 0);
      }
    }
  };

  const handleTextBlur = () => {
    if (textEditorRef.current && textPos && game) {
      const text = textEditorRef.current.innerText.trim();
      if (text) {
        game.addText(text, textPos.x, textPos.y);
      }
      setTextPos(null);
      setSelectedTool("select");
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
    gameRef.current?.setZoom(zoom + 10);
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
    gameRef.current?.setZoom(zoom - 10);
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden relative">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={typeof window !== "undefined" ? window.innerWidth : 1000}
        height={typeof window !== "undefined" ? window.innerHeight : 600}
        style={{ display: "block", backgroundColor: "white", cursor: selectedTool === "text" ? "text" : selectedTool === "select" ? "pointer" : "default", width: "100%", height: "100%", pointerEvents: isLocked ? "none" : "auto" }}
        onClick={handleCanvasClick}
      />

      {/* Left Menu Button */}
      <button className="absolute top-4 left-4 p-2 bg-purple-100 hover:bg-gray-200 rounded-lg transition-colors z-10">
        <Menu className="w-4 h-4 text-gray-700" />
      </button>

      {/* Top Toolbar - Absolute Position */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 bg-white rounded-lg p-1 border border-gray-200 z-10">
        <IconBtn  icon={LockKeyhole} active={isLocked} onClick={() => setIsLocked(!isLocked)} />
        <IconBtn icon={Hand} active={selectedTool === "select"} onClick={() => setSelectedTool("select")} />
        <IconBtn icon={Pencil} active={selectedTool === "pencil"} onClick={() => setSelectedTool("pencil")} />
        <IconBtn icon={Square} active={selectedTool === "rect"} onClick={() => setSelectedTool("rect")} />
        <IconBtn icon={Circle} active={selectedTool === "circle"} onClick={() => setSelectedTool("circle")} />
        <IconBtn icon={ArrowRight} active={selectedTool === "arrow"} onClick={() => setSelectedTool("arrow")} />
        <IconBtn icon={Minus} active={selectedTool === "line"} onClick={() => setSelectedTool("line")} />
        <IconBtn icon={Eraser} active={selectedTool === "eraser"} onClick={() => setSelectedTool("eraser")} />
        <IconBtn icon={Type} active={selectedTool === "text"} onClick={() => setSelectedTool("text")} />
      </div>

      {/* Right Top Buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`)} className="p-2.5 bg-purple-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg">
          <Share2 className="w-3.5 h-3.5" />
        </button>
        <button className="p-2 bg-purple-100 hover:bg-gray-100 rounded-lg transition-colors">
          <PanelsTopLeft className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Text Editor */}
      {textPos && selectedTool === "text" && (
        <div
          ref={textEditorRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTextBlur}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setTextPos(null);
              setSelectedTool("select");
            }
          }}
          style={{
            position: "absolute",
            left: `${textPos.x}px`,
            top: `${textPos.y}px`,
            minWidth: "100px",
            padding: "2px 4px",
            fontSize: "20px",
            fontFamily: "Excalidraw",
            outline: "none",
            zIndex: 50,
          }}
        />
      )}

      {/* Bottom Left - Zoom */}
      <div className="absolute bottom-6 left-6 flex items-center gap-1 bg-white rounded-lg p-1.5 shadow-lg z-10">
        <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600">−</button>
        <span className="text-xs font-medium text-blue-600 w-10 text-center">{zoom}%</span>
        <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600">+</button>
        <div className="w-px h-5 bg-gray-200"></div>
        <button onClick={() => gameRef.current?.undo()} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600">↶</button>
        <button onClick={() => gameRef.current?.redo()} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600">↷</button>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600">✓</button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">?</button>
      </div>
    </div>
  );
}

function IconBtn({ icon: Icon, active, onClick }: { icon: React.FC<{ className?: string }>; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-lg transition-colors ${
        active ? "bg-purple-100 text-purple-800" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-3.5 h-4" />
    </button>
  );
}
