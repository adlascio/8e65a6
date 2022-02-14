import moment from "moment";

export const addMessageToStore = (state, payload) => {
  const { message, sender, activeConversation, recipientId, userId} = payload;
  if(userId === message.senderId || userId === recipientId){
    if (sender !== null) {
      const newConvo = {
        id: message.conversationId,
        otherUser: sender,
        messages: [message],
        unread:1,
        userId:recipientId
      };
      newConvo.latestMessageText = message.text;
      return [newConvo, ...state];
    }
    let updatedConvos = state.map((convo) => {
      if (convo.id === message.conversationId) {
        const convoCopy = { ...convo };
        convoCopy.latestMessageText = message.text;
        convoCopy.latestMessageTime = message.createdAt;
         if(convoCopy.otherUser.id === message.senderId){
           if(convoCopy.otherUser.username !== activeConversation){
            convoCopy.unread +=1
           } else {
            message.readStatus = true
           }
        }
        convoCopy.messages = [...convoCopy.messages, message];
        return convoCopy;
      } else {
        return convo;
      }
    });
    //sort convos to latest at top
    updatedConvos = updatedConvos.sort((a , b) => {
      const lastMsgTimeConvo1 = moment(a.latestMessageTime)
      const lastMsgTimeConvo2 = moment(b.latestMessageTime)
      return (lastMsgTimeConvo1.isBefore(lastMsgTimeConvo2)) ?  1 : 
      ((lastMsgTimeConvo1.isAfter(lastMsgTimeConvo2)) ? -1 : 0)
    })
    return updatedConvos
  };
  return state
  }
  
  // if sender isn't null, that means the message needs to be put in a brand new convo
  

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages = [...convoCopy.messages, message];
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateConvoToStore = (state, updatedConvo) => {
  return state.map((convo) => {
    if (convo.id === updatedConvo.id) {
      return updatedConvo;
    } else {
      return convo;
    }
  });
};

export const updateMsgReadToStore = (state, payload) => {
  const {conversationId, lastMsgRead} = payload
  const updatedConvos =  state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      convoCopy.lastMsgRead = lastMsgRead
      return convoCopy;
    } else {
      return convo;
    }
  });
  return updatedConvos
};

export const updateIsTypingToStore = (state, payload) => {
  const {conversationId, isTyping} = payload;
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = {...convo.otherUser, isTyping: isTyping}
      return convoCopy;
    } else {
      return convo;
    }
  });
};
