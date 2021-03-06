import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent, Unread } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { updateUnreadMsgs } from "../../store/utils/thunkCreators";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser, unread, userId } = conversation;

  const handleClick = async (conversation) => {
    const body = {
      conversationId:conversation.id,
      otherUserId:otherUser.id,
      userId:userId
    }
    await props.setActiveChat(conversation.otherUser.id);
    await props.updateUnreadMsgs(body);
    
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {unread > 0 && <Unread unread={unread} />}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    updateUnreadMsgs: (body) => {
      dispatch(updateUnreadMsgs(body));
    }
  };
};

export default connect(null, mapDispatchToProps)(Chat);
