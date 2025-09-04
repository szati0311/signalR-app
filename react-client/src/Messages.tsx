import React from "react";
import { useSignalR } from "./SignalRContext";

const Messages: React.FC = () => {
  const { messages } = useSignalR();

  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      height: "300px",
      overflowY: "auto",
      background: "#f9f9f9"
    }}>
      {messages.map((m, i) => (
        <div key={i}>
          <strong>{m.user}:</strong> {m.message}
        </div>
      ))}
    </div>
  );
};

export default Messages;
