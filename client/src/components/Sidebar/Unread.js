import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  unread: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius:"50%",
    background:"#3F92FF",
    width:25,
    height:25,
    color:"#FFFFFF",
    marginRight: 20
  },
  unreadText: {
    fontSize:10, 
    fontWeight:"bold"
  }
}));

const Unread = (props) => {
  const classes = useStyles();
  const {unread} = props;

  return (
    <Box className={classes.unread}>
        <Typography className={classes.unreadText}>
            {unread}
        </Typography>
    </Box>
  );
};

export default Unread;
