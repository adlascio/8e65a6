const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");
const User = require("./user")
const onlineUsers = require("../../onlineUsers");

const Conversation = db.define("conversation", {
  //name of the group and it could be null for direct conversations 
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  
  //type could be "direct"(2 participants) or "group"(3 or more participants) 
  typeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  //array of participants' IDs
  participants: {
    type: Sequelize.ARRAY,
    allowNull: false
  }
});

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
  for (let i = 0; i < conversations.length; i++) {
    const convo = conversations[i];
    const convoJSON = convo.toJSON();

    // set a property "otherUser" so that frontend will have easier access
    if (convoJSON.user1) {
      convoJSON.otherUser = convoJSON.user1;
      delete convoJSON.user1;
    } else if (convoJSON.user2) {
      convoJSON.otherUser = convoJSON.user2;
      delete convoJSON.user2;
    }

    // set property for online status of the other user
    if (onlineUsers.includes(convoJSON.otherUser.id)) {
      convoJSON.otherUser.online = true;
    } else {
      convoJSON.otherUser.online = false;
    }

    // set properties for notification count and latest message preview
    convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length-1].text;
    convoJSON.latestMessageTime = convoJSON.messages[convoJSON.messages.length-1].createdAt;
    
    convoJSON.unread = 0
    for(let j=0; j <convoJSON.messages.length; j++){
      if(userId !== convoJSON.messages[j].senderId && convoJSON.messages[j].readStatus === false){
        convoJSON.unread += 1
      }
    }
    conversations[i] = convoJSON;
  }
  return conversations
}

module.exports = Conversation;
