import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble, TypingBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, lastMsgRead } = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} lastMsgRead={lastMsgRead} otherUser={otherUser} id={message.id}/>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
      {otherUser.isTyping && <TypingBubble  otherUser={otherUser}/>}
    </Box>
  );
};

export default Messages;
