import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Messages from "./Messages";
import { startSignalR } from "./store/actions/messagesActions";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
    dispatch(startSignalR());
  }, [dispatch]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>SignalR + Redux Messages</h1>
      <Messages />
    </div>
  );
}
