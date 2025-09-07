export const ADD_MESSAGE = "ADD_MESSAGE";
export const START_SIGNALR = "START_SIGNALR";

export const addMessage = (message: string) => ({
  type: ADD_MESSAGE,
  payload: message
});

export const startSignalR = () => ({
  type: START_SIGNALR
});
