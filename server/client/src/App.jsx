import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import { Code2, Share2, Users } from "lucide-react";

const socket = io.connect("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("room-1");
  const [code, setCode] = useState("// Start collaborative coding...");

  useEffect(() => {
    socket.emit("join_room", room);
    socket.on("receive_code", (data) => {
      setCode(data);
    });
  }, [room]);

  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit("send_code", { code: value, room });
  };

  return (
    <div className="h-screen bg-[#1e1e1e] text-white flex flex-col">
      {/* Header */}
      <nav className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#252526]">
        <div className="flex items-center gap-2">
          <Code2 className="text-blue-400" />
          <span className="font-bold tracking-wide">SyncSpace<span className="text-blue-400">.io</span></span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded text-sm">
            <Users size={14} /> Room: {room}
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded text-sm font-medium transition flex items-center gap-2">
            <Share2 size={14} /> Share
          </button>
        </div>
      </nav>

      {/* Editor Area */}
      <div className="flex-1 flex">
        <div className="flex-1 relative">
           <Editor
             height="100%"
             defaultLanguage="javascript"
             theme="vs-dark"
             value={code}
             onChange={handleCodeChange}
             options={{
               minimap: { enabled: false },
               fontSize: 14,
             }}
           />
        </div>
      </div>
    </div>
  );
}

export default App;
