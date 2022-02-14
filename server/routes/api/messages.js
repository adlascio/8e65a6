const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.body.sender.id;
    const { recipientId, text, conversationId, sender, readStatus } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      let message = await Message.create({ senderId, text, conversationId, readStatus });
      return res.json({ message, sender, recipientId });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    let message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      readStatus
    });
    res.json({ message, sender, recipientId});
  } catch (error) {
    next(error);
  }
});

router.put("/unread", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    if(req.user.id !== req.body.otherUserId && req.user.id !== req.body.userId){
      return res.sendStatus(403);
    }
    const { conversationId, otherUserId, userId } = req.body;

    //change readStatus of messages received to true
    await Message.update({readStatus:true},{
      where: {
        [Op.and]: {
          senderId:otherUserId,
          conversationId,
          readStatus:false,
        }
      }
    })

    // get updated conversation
    const conversation = await Conversation.findOne(
      {
        where:{id:conversationId},
        order: [[Message,"createdAt", "ASC"]],
        include: Conversation.includeOptions(userId)
      }
    );
    const updatedConversation = Conversation.setUpforFrontEnd([conversation], userId)
    const messagesFilteredByUserId = updatedConversation[0].messages.filter(message => {
      return message.senderId !== userId
    });
    if(messagesFilteredByUserId.length > 0){
      const lastMsgRead = messagesFilteredByUserId[messagesFilteredByUserId.length-1].id
      res.json({updatedConversation:updatedConversation[0], lastMsgRead })
    }
    res.json({updatedConversation:updatedConversation[0]});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
