import React from "react";
import { Grid } from "semantic-ui-react";
import "../../components/App.css";
import { connect } from "react-redux";
import ColorPanel from "../ColorPanel/ColorPanel";
import AdminMessages from "./admin/Messages/AdminMessages";
import SidePanel from "./admin/SidePanel/SidePanel";
import AdminMetaPanel from "./admin/MetaPanel";


const Admin = ({ currentUser, currentChannel, isPrivateChannel }) => (
  <Grid columns="equal" className="admin" style={{ background: "#eee" }}>
    <ColorPanel />
    <SidePanel
      key={currentUser && currentUser.uid}
     currentUser={currentUser} 
    />


    <Grid.Column style={{ marginLeft: 160 }}>
      <AdminMessages
      key={currentChannel && currentChannel.id}
      currentChannel={currentChannel}
      currentUser={currentUser}
      isPrivateChannel={isPrivateChannel}
    />
    </Grid.Column>

    <Grid.Column width={4}>
    <AdminMetaPanel />
    </Grid.Column>
  </Grid>
);



const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel
});

export default connect(mapStateToProps)(Admin);
