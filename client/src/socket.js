import io from "socket.io-client";
import store from "./store";
import { updateUnreadMsgs } from "./store/utils/thunkCreators";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setMsgRead,
  setIsTyping
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    const state = store.getState();
    const userId = state.user.id;
    if(state.activeConversation === data.message.senderId){
      store.dispatch(updateUnreadMsgs({
        conversationId:data.message.conversationId,
        otherUserId:data.message.senderId,
        userId:userId
      }))
    }
    store.dispatch(setNewMessage(data.message, data.sender,state.activeConversation, data.recipientId, userId));
  });
  socket.on("message-read", (data) => {
    store.dispatch(setMsgRead(data));
  });
  socket.on("typing", (data) => {
    store.dispatch(setIsTyping(data));
  });
});

export default socket;
