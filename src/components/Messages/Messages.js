import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import {connect} from "react-redux";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef:firebase.database().ref('privateMessages'),
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    isChannelJoined: false,
    isFriendRequestSubmitted: false,
    user: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
     AdminReqsRef: firebase.database().ref("/users/fvTCEnVcpoOY8bqoPCaUdbig44S2/Channel_requests-received/"),
    numUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: []
    
  };

  componentDidMount() {
    const { channel, user } = this.state;
    this.setState({ user: this.props.currentUser});


    if (channel && user) {
      this.addListeners(channel.id);
      this.addUsersJoinStateListener(channel.id, user.uid);
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
    });
  };

  addUsersJoinStateListener = (channelId, userId) => {
    this.state.usersRef
    .child(userId)
    .child("Channel_requests_sent")
    .once("value")
    .then(data => {
      if (data.val() !== null) {
        const channelIds = Object.keys(data.val());
          const prevJoined = channelIds.includes(channelId);
          this.setState({ isChannelJoined: prevJoined });
        }
      });
  };

  getMessagesRef =() => {
    const {messagesRef, privateMessagesRef, privateChannel} = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  handleFriendRequest =() => {
    this.setState(prevState=>({
      isFriendRequestSubmitted: !prevState.isFriendRequestSubmitted
    }),()=> this.SubmitFrenReq());
  }

  SubmitFrenReq = () => {
    var truid=String(this.state.channel.id);
    var cuid=String(this.state.user.uid);
    var TruFrenID=truid.replace(cuid,"");
    if(this.state.isFriendRequestSubmitted){
      this.state.usersRef
      .child(`${this.state.user.uid}/friend_requests_sent`)
      .update({
        [TruFrenID]:{
          SenderName:this.state.user.displayName,
          SenderAvatar:this.state.user.photoURL,
          link:this.state.channel.id
          

        }

      })
      console.log("Sent Friend Request");
    }else{
      this.state.usersRef
      .child(`${this.state.user.uid}/friend_requests_sent`)
      .child(`${TruFrenID}`)
      .remove(err=>{
       if(err != null){
          console.error(err);
        }
      });
      console.log("Cancelled Friend Request");
    }
    if(this.state.isFriendRequestSubmitted){
      this.state.usersRef
      .child(`${TruFrenID}/friend_requests_received`)
      .update({
        [this.state.user.uid]:{
          name:this.state.user.displayName,
          avatar:this.state.user.photoURL
          

        }

      })
      console.log("Sent Friend Request");
    }else{
      this.state.usersRef
      .child(`${TruFrenID}/friend_requests_received`)
      .child(this.state.user.uid)
      .remove(err=>{
       if(err != null){
          console.error(err);
        }
      });
      console.log("Cancelled Friend Request");
    }
  }

  handleJoin = () => {
    this.setState(
      prevState => ({
      isChannelJoined: !prevState.isChannelJoined
    }),
     () => this.ChannelJoined()
     );
  };

  ChannelJoined = () => {
    if (this.state.isChannelJoined){
      this.state.usersRef
      .child(`${this.state.user.uid}/Channel_requests_sent`)
      .update({
        [this.state.channel.id]:{
          name: this.state.channel.name,
          details: this.state.channel.details
        }
      })
      console.log("Channel Joined");
    } else {
      this.state.usersRef
      .child(`${this.state.user.uid}/Channel_requests_sent`)
      .child(this.state.channel.id)
      .remove(err=> {
        if(err != null){
          console.error(err);
        }
      });

    }
    if (this.state.isChannelJoined){ //Admin Stuff Request
      this.state.AdminReqsRef
      .update({
        [this.state.user.uid]:{
          avatar:this.state.user.photoURL,
          channelID:this.state.channel.id,
          channelName:this.state.channel.name,
          name:this.state.user.displayName
        }
      })
    } else {
      this.state.AdminReqsRef
      .child(this.state.user.uid)
      .remove(err=> {
        if(err != null){
          console.error(err);
        }
      });

    }
  };

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

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = channel => {
    return channel ? `${this.state.privateChannel ?  '@': ''}${channel.name}`:
    '';
  }

  displayChannelDesc = channel => {
    return channel ? `${channel.details}`:
    '';
  }

  render() {
    //Prettier Ignore
    const { messagesRef, messages, channel, user, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel, isChannelJoined, isFriendRequestSubmitted } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader 
        channelName={this.displayChannelName(channel)}
        channelDesc={this.displayChannelDesc(channel)}
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={this.handleSearchChange}
        searchLoading={searchLoading}
        isPrivateChannel={privateChannel}
        handleJoin={this.handleJoin}
        isChannelJoined={isChannelJoined}
        handleFriendRequest={this.handleFriendRequest}
        isFriendRequestSubmitted={isFriendRequestSubmitted}
        
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm
             ? this.displayMessages(searchResults)
             :this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
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
const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})
export default connect(mapStateToProps) (Messages);
