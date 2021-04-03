import React from "react";
import firebase from "../../firebase";
import {connect} from "react-redux";
import logo from "./lo.png";
import Requests from "./Requests";
import { Grid, Header, Dropdown, Image, Modal, Input, Button, Icon } from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";



class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    blob: null,
    IsSubmitReq: false,
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
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span onClick={this.openModal}><div>Change Avatar</div></span>
    },
    {
      key: "frenReq",
      text: <Requests></Requests>
      
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}><div>Sign Out</div></span>
    }
    
    
  ];

  uploadCroppedImage= () =>{
    const {storageRef,userRef,blob,metadata}= this.state;

    storageRef
    .child(`avatars/user-${userRef.uid}`)
    .put(blob,metadata)
    .then(snap =>{
      snap.ref.getDownloadURL().then(downloadURL => {
         this.setState({uploadCroppedImage:downloadURL},()=>
         this.changeAvatar()
         );
        });
      });
  };

  changeAvatar= () =>{
    this.state.userRef
    .updateProfile({
      photoURL: this.state.uploadCroppedImage
    })
    .then(() => {
      console.log('PhotoURL updated');
      this.closeModal();
    })
    .catch(err=>{
      console.log(err);
    });
    this.state.usersRef
    .child(this.state.user.uid)
    .update({avatar:this.state.uploadCroppedImage})
    .then(()=>{
      console.log('User Avatar  updated');
    })
    .catch(err => {
      console.log(err);
    });
  };

  handleChange= event =>{
    const file =event.target.files[0];
    const reader= new FileReader();

    if (file){
      reader.readAsDataURL(file);
      reader.addEventListener('load', () =>{
        this.setState({ previewImage:reader.result});
      });
  }
};

SubmitFrenReq = () => {
  this.setState(prevState=>({
      IsSubmitReq: !prevState.IsSubmitReq
  }), () => this.subFriend());
  console.log("Request Sent");
  
}

subFriend = () =>{
  if(this.state.IsSubmitReq){
      console.log("Friend  Request Sent");
  }else{
      console.log("Request Not Sent");
  }
} 


  handleCropImage = () => {
    if(this.AvatarEditor){
      this.AvatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageURL = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageURL,
          blob
        });
      });
    }

  };

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed out!"));
      window.location.reload();
  };

  render() {
    const{ user, modal, previewImage, croppedImage} = this.state;
    console.log(this.props.currentUser);
    
    return (
      <Grid style={{ background: "#fd0003" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
            <img src={logo} align="top" alt="Inverted Logo"/> 
              <Header.Content>ZenChat</Header.Content>
            </Header>
            
          </Grid.Row>
          {/* User Dropdown  */}
          <br></br>
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              trigger={
              <span>
                <Image src={user.photoURL} spaced="right" avatar/>
                {user.displayName}
                
              </span>}   
              options={this.dropdownOptions()}
            />
          </Header>
          {/*Change User Avatar Modal*/}
          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>
              <h2 class="ui orange header">
              Change Avatar
              </h2>
            </Modal.Header>
            <Modal.Content>
              <Input
              onChange={this.handleChange}
              fluid
              type="file"
              label="new Avatar"
              name="previewImage"
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {previewImage &&(
                      <AvatarEditor
                      ref={node =>(this.AvatarEditor = node)}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                      />
                    )}
                    {/*Image Preview*/}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImage &&(
                      <Image
                      style={{margin: '3.5em auto'}}
                      width={100}
                      height={100}
                      src={croppedImage}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage && <Button onClick={this.uploadCroppedImage}>
                <Icon name="save" color="blue"/>Confirm Change
              </Button>}
              <Button onClick={this.handleCropImage}>
              <Icon name="image" color="orange" inverted/>Preview Avatar
              </Button>
              <Button onClick={this.closeModal}>
              <Icon name="remove" color="red" inverted/>Cancel
              </Button>
            </Modal.Actions>
          </Modal>

        </Grid.Column>
      
      </Grid>

      
    );
  }
}




const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(UserPanel);
