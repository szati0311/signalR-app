import React from "react";
import { useSelector } from "react-redux";

const Messages: React.FC = () => {
  const messages = useSelector((state: any) => state.messages);

  return (
    <div style={{ maxHeight: 250, overflowY: "auto", background: "#f5f5f5", padding: 12 }}>
      {messages.map((message: string, i: number) => (
        <div key={i}>
          <strong style={{ color: "#1a73e8" }}>{message}</strong>
        </div>
      ))}
    </div>
  );
};

export default Messages;
