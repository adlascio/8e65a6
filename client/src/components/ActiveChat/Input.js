import React, { useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage, setTyping } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: "flex-end",
    marginTop: 15
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20
  }
}));

const Input = (props) => {
  const classes = useStyles();
  const [input, setInput] = useState({text:"", isTyping:false});
  const { postMessage, otherUser, conversationId, user } = props;

  const handleChange = async (e) => {
    if(e.target.value === ""){
      if(input.isTyping){
        setInput({isTyping:false, text:e.target.value})
        await props.setIsTyping(false,conversationId)
      }
    } else {
      if(!input.isTyping){
        setInput({isTyping:true, text:e.target.value})
        await props.setIsTyping(true,conversationId)
      } else {
        setInput({...input, text:e.target.value})
      } 
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId,
      sender: user,
      readStatus:false
    };
    if(reqBody.text !== ""){
      setInput({isTyping:false, text:""});
      await props.setIsTyping(false,conversationId)
      await postMessage(reqBody);
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={input.text}
          name="text"
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
    setIsTyping: (isTyping, conversationId) => {
      dispatch(setTyping(isTyping, conversationId));
    }
  };
};

export default connect(null, mapDispatchToProps)(Input);
