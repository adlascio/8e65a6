import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Avatar } from "@material-ui/core";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles(() => ({
  root: {
    display: "flex"
  },
  avatar: {
    height: 30,
    width: 30,
    marginRight: 11,
    marginTop: 6
  },
  usernameDate: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  bubble: {
    backgroundImage: "linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)",
    borderRadius: "0 10px 10px 10px",
    display: "flex",
    justifyContent:"center",
    padding:"8px"
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.2,
    padding: 8
  },
  dot: {
    mixBlendMode: "normal",
    opacity: 0.5,
    color: "#FFFFFF",
    fontSize: "large",
  }
}));

const TypingBubble = (props) => {
  const classes = useStyles();
  const { otherUser } = props;
  return (
    <Box className={classes.root}>
      <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>
      <Box>
        <Typography className={classes.usernameDate}>
          {otherUser.username}
        </Typography>
        <Box className={classes.bubble}>
            <FiberManualRecordIcon className={classes.dot}/>
            <FiberManualRecordIcon className={classes.dot}/>
            <FiberManualRecordIcon className={classes.dot}/>  
        </Box>
      </Box>
    </Box>
  );
};

export default TypingBubble;
