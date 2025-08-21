import { useEffect, useState, useRef } from "react";
import Socket from "socket.io-client";
import React from "react";

function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection only once
    socketRef.current = Socket("http://localhost:3000");
    const socket = socketRef.current;

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    socket.on("transfer-chat", (chat) => {
      setChat(chat);
      console.log("transfer-chat received:", chat);
    });

    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim()) {
      console.log("sent message =>", input);
      setMessages((prev) => [...prev, input]);

      socketRef.current.emit("message", input);
      setInput("");
    }
  };

  return (
    <>
      <div className="w-lg mx-auto flex items-center justify-between h-screen">
        <form
          onSubmit={handleSubmit}
          className="border w-full h-96 p-4 flex flex-col justify-between"
        >
          {/* Messages area */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto p-2">
            {/* Current received message display */}
            <div className="flex-1">
              <h1 className="text-center text-gray-600">Received: {chat}</h1>
            </div>

            <div className="overflow-y-auto justify-end">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 rounded-lg px-3 py-1 mb-1 max-w-fit text-sm justify-end"
                >
                  {" "}
                  {message}
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded flex items-center gap-4 p-1">
            <input
              className="w-full py-2 outline-none"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              className="bg-blue-500 text-white rounded px-4 py-2"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
