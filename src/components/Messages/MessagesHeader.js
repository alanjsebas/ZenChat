import React from "react";
import { Header, Segment, Input, Icon} from "semantic-ui-react";

class MessagesHeader extends React.Component {
  state ={
    modal: false
  }
  render() {
    const{ channelName,channelDesc, handleSearchChange, isPrivateChannel, handleJoin, isChannelJoined, handleFriendRequest, isFriendRequestSubmitted } = this.props;
    return (
      
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            {!isPrivateChannel && <Icon name={"star outline"} color="black" />}
          </span>
          {!isPrivateChannel && <Header.Subheader>{channelDesc}</Header.Subheader>}

        </Header>

        {/*Users Request to Join Channels */}
        {!isPrivateChannel && (<button class="ui basic button" onClick={handleJoin}>
        <i class={!isChannelJoined ? 'icon plus': 'icon clock'}></i>
        {!isChannelJoined ? 'Join Topic': 'Join Request Sent to Admin'}
        </button>)}

        {/*Users Request to Join Channels */}
        {isPrivateChannel && (<button class="ui basic button" onClick={handleFriendRequest}><i class={isFriendRequestSubmitted ? 'icon user plus' : 'icon clock'}
></i>
        {!isFriendRequestSubmitted ? 'Send Friend Request': ' Cancel Friend Request'}</button>)}
        

        {/* Channel Search Input */}
        <Header floated="right">
          <Input
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}



export default MessagesHeader;
