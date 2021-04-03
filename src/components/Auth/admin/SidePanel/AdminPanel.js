import React from "react";
import firebase from "../../../../firebase";
import {connect} from "react-redux";
import logo from "./lo.png";
import AdminRequests from "./AdminRequests";
import { Grid, Header, Dropdown, Image } from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";


class AdminPanel extends React.Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    blob: null,
    uploadCroppedImage: '',
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref('users'),
    metadata: {
      contentType:"image/jpg"
    }
    
  };

  openModal= () => this.setState({modal:true});

  closeModal= () => this.setState({modal:false});

  componentDidMount(){
    this.setState({ user: this.props.currentUser});
  }

  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>Admin</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "frenReq",
      text: <AdminRequests></AdminRequests>
      
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}><div>Sign Out</div></span>
    }
    
  ];

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed out!"));
      window.location.reload();
  };

  render() {
    const{ user } = this.state;
    console.log(this.props.currentUser);
    return (
      <Grid style={{ background: "#fd0003" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h3">
            <img src={logo} align="top" alt="Inverted Logo"/> 
              <Header.Content>ZenChat</Header.Content>
              <center><h3 class="ui grey inverted header"><br></br>
            Admin Dashboard</h3></center>
            </Header>
            
          </Grid.Row>
          {/* User Dropdown  */}
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
          
            <Dropdown
              trigger={
              <span>
                <br></br>
                <Image src={user.photoURL} spaced="right" avatar/>
                Admin
                
              </span>}
              options={this.dropdownOptions()}
            />
          </Header>
        </Grid.Column>
      </Grid>
      
    );
  }
}




const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(AdminPanel);
