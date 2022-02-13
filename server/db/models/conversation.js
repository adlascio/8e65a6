const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");
const User = require("./user")
const onlineUsers = require("../../onlineUsers");
const Conversation = db.define("conversation", {});
const moment = require("moment")

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

Conversation.includeOptions = (userId) => [
  { model: Message, order: ["createdAt", "ASC"] },
  {
    model: User,
    as: "user1",
    where: {
      id: {
        [Op.not]: userId,
      },
    },
    attributes: ["id", "username", "photoUrl"],
    required: false,
  },
  {
    model: User,
    as: "user2",
    where: {
      id: {
        [Op.not]: userId,
      },
    },
    attributes: ["id", "username", "photoUrl"],
    required: false,
  },
]

Conversation.setUpforFrontEnd = (conversations, userId) => {
  return conversations.map((convo) => {
    const convoJSON = convo.toJSON();
    convoJSON.userId = userId;

    // set a property "otherUser" so that frontend will have easier access
    if (convoJSON.user1) {
      convoJSON.otherUser = convoJSON.user1;
      
    } else if (convoJSON.user2) {
      convoJSON.otherUser = convoJSON.user2;
      
    }
    delete convoJSON.user1;
    delete convoJSON.user2;
    

    // set property for online status of the other user
    if (onlineUsers.includes(convoJSON.otherUser.id)) {
      convoJSON.otherUser.online = true;
    } else {
      convoJSON.otherUser.online = false;
    }

    // set properties for notification count and latest message preview
    if(convoJSON.messages.length>0){
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length-1].text;
      convoJSON.latestMessageTime = convoJSON.messages[convoJSON.messages.length-1].createdAt;
    }
    
    
    convoJSON.unread = 0
    for(let i=0; i <convoJSON.messages.length; i++){
      if(userId !== convoJSON.messages[i].senderId && convoJSON.messages[i].readStatus === false){
        convoJSON.unread += 1
      }
      if(userId === convoJSON.messages[i].senderId && convoJSON.messages[i].readStatus !== false){
        convoJSON.lastMsgRead = convoJSON.messages[i].id
      }
    }
    return convoJSON
  }).sort((a , b) => {
    const lastMsgTimeConvo1 = moment(a.latestMessageTime)
    const lastMsgTimeConvo2 = moment(b.latestMessageTime)
    return (lastMsgTimeConvo1.isBefore(lastMsgTimeConvo2)) ?  1 : 
    ((lastMsgTimeConvo1.isAfter(lastMsgTimeConvo2)) ? -1 : 0)
  })
}

module.exports = Conversation;
