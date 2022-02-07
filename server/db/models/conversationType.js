const Sequelize = require("sequelize");
const db = require("../db");

const ConversationType = db.define("conversationType", {
// type could be "direct"(2 participants) or "group"(3 or more participants)
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = ConversationType;