import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface Message {
  user: string;
  message: string;
}

interface SignalRContextValue {
  messages: Message[];
}

const SignalRContext = createContext<SignalRContextValue | undefined>(undefined);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5278/chat")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.start()
      .then(() => {
        console.log("Kapcsolódva a SignalR szerverhez!");
        connection.on("ReceiveMessage", (user: string, message: string) => {
          setMessages(prev => [...prev, { user, message }]);
        });
      })
      .catch(err => console.error("Kapcsolódási hiba: ", err));

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ messages }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalR must be used within a SignalRProvider");
  }
  return context;
};
