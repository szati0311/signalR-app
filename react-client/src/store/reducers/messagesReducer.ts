import { ADD_MESSAGE } from "../actions/messagesActions";

const initialState: string[] = [];

export default function messagesReducer(state = initialState, action: any) {
  switch (action.type) {
    case ADD_MESSAGE:
      return [...state, action.payload];
    default:
      return state;
  }
}
