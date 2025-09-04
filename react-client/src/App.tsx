import React from "react";
import { SignalRProvider } from "./SignalRContext.tsx";
import Messages from "./Messages.tsx";

const App: React.FC = () => {
  return (
    <SignalRProvider>
      <div style={{ padding: "20px" }}>
        <h1>📡 Random üzenetek a SignalR szervertől</h1>
        <Messages />
      </div>
    </SignalRProvider>
  );
};

export default App;
