import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";
import moment from 'moment';

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15
  }
}));

const Sidebar = (props) => {
  const classes = useStyles();
  let conversations = props.conversations || [];
  const { handleChange, searchTerm } = props;
  if(conversations.length > 1){
    conversations = conversations.sort((a , b) => {
      const lastMsgTimeConvo1 = moment(a.latestMessageTime)
      const lastMsgTimeConvo2 = moment(b.latestMessageTime)
      return (lastMsgTimeConvo1.isBefore(lastMsgTimeConvo2)) ?  1 : 
      ((lastMsgTimeConvo1.isAfter(lastMsgTimeConvo2)) ? -1 : 0)
    })
  }

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {conversations
        .filter((conversation) => conversation.otherUser.username.includes(searchTerm))
        .map((conversation) => {
          return <Chat conversation={conversation} key={conversation.otherUser.username} />;
        })}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations
  };
};

export default connect(mapStateToProps)(Sidebar);
