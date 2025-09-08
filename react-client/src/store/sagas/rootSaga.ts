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
            const fullMessage = `${user}: ${message}`;
            store.dispatch(addMessage(fullMessage));
            // Show system notification if tab not visible
            console.log(Notification.permission)
            if (
                document.visibilityState === "hidden" &&
                "Notification" in window &&
                Notification.permission === "granted"
            ) {
                const notification = new Notification("New Message", {
                    body: fullMessage,
                    icon: "/logo.png",
                    data: { url: "http://localhost:5173/messages" }
                });

                notification.onclick = () => {
                    window.focus();
                    window.location.href = notification.data.url;
                };
            }
        });

        isRegistered = true; // ensure handler is registered only once
    }
}

export default function* rootSaga() {
    yield takeEvery("START_SIGNALR", connectSignalR);
}
