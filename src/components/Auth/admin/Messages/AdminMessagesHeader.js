import React from "react";
import { Header, Segment, Input, Icon} from "semantic-ui-react";

class AdminMessagesHeader extends React.Component {
  state ={
    modal: false
  }
  render() {
    const{ channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel } = this.props;
    return (
      
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
          </span>
          <Header.Subheader>{numUniqueUsers}</Header.Subheader>

        </Header>

        {/*Users Request to Join Channels */}
        {!isPrivateChannel && <div><button class="ui basic button" onClick={() => {window.alert("Topic Settings Modal")}}>
        <i class="icon cog"></i>
        Topic Options
        </button>
        </div>
        }

        {/*Users Request to Join Channels */}
        {isPrivateChannel && <div><button class="ui basic button" onClick={() => {window.alert("User Settings Modal")}}>
        <i class="icon edit"></i>
        Manage User Options
        </button>
        </div>
        }
        
        

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



export default AdminMessagesHeader;
