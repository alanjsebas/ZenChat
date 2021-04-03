import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../../../firebase";

import AdminMessagesHeader from "./AdminMessagesHeader";
import AdminMessageForm from "./AdminMessageForm";
import AdminMessage from "./AdminMessage";

class AdminMessages extends React.Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef:firebase.database().ref('privateMessages'),
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    numUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: []
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref= this.getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
    });
  };

  getMessagesRef =() => {
    const {messagesRef, privateMessagesRef, privateChannel} = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  HandleAdminDelete =() => {
    const {messagesRef, privateMessagesRef, privateChannel} = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  handleSearchChange = event => {
    this.setState(
      {
      searchTerm: event.target.value,
      searchLoading: true
    },
    () =>this.handleSearchMessages()
    );
  }

  handleSearchMessages = () => {
    const ChannelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm,'gi');
    const searchResults = ChannelMessages.reduce((acc, message)=> {
      if(
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
        )  {
      {acc.push(message);}
    }
    return acc;
    }, []);
    this.setState({searchResults});
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({ numUniqueUsers });
  };



  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <span>
        <div class="ui small basic icon buttons">
        <button class="ui  button" onClick={this.HandleAdminDelete}>Delete</button></div>
      <AdminMessage
        key={message.timestamp}
        message={message}
        user={this.state.user}
        />
      
       {console.log(message)}
      </span>
      
    ));

  displayChannelName = channel => {
    return channel ? `${this.state.privateChannel ?  '@': '#'}${channel.name}`:
    '';
  }

  render() {
    //Prettier Ignore
    const { messagesRef, messages, channel, user, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel } = this.state;

    return (
      <React.Fragment>
        <AdminMessagesHeader 
        channelName={this.displayChannelName(channel)}
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={this.handleSearchChange}
        searchLoading={searchLoading}
        isPrivateChannel={privateChannel}
        
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm
             ? this.displayMessages(searchResults)
             :this.displayMessages(messages)}
             
          </Comment.Group>
        </Segment>

        <AdminMessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}

export default AdminMessages;
