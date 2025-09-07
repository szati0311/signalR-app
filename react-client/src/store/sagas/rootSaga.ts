import { call, takeEvery } from "redux-saga/effects";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { addMessage } from "../actions/messagesActions";
import { store } from "../index";

// Keep connection as a module-level variable
let connection: any = null;
let isRegistered = false;

function* connectSignalR() {
  if (connection) {
    // Already connected, do nothing
    return;
  }

  connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5278/chat") // HTTP backend
    .withAutomaticReconnect()
    .build();

  yield call([connection, connection.start]);

  if (!isRegistered) {
    connection.on("ReceiveMessage", (user: string, message: string) => {
      store.dispatch(addMessage(`${user}: ${message}`));
    });
    isRegistered = true; // ensure handler is registered only once
  }
}

export default function* rootSaga() {
  yield takeEvery("START_SIGNALR", connectSignalR);
}
