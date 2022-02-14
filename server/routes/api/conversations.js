const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message,"createdAt", "ASC"]],
      include: Conversation.includeOptions(userId),
    });
    if(conversations.length > 0){
      const updatedConversations = Conversation.setUpforFrontEnd(conversations, userId);
      res.json(updatedConversations);
    } else {
      res.json(conversations);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
