import React from "react";
import firebase from "firebase";
import {connect} from "react-redux";
import { Icon, Modal,Button, ModalActions, Menu, Image } from "semantic-ui-react";

class AdminRequests extends React.Component{
    state = {
        open: false,
        users: [],
        user: this.props.currentUser,
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        ChannelReqRef: firebase.database().ref('/users/' + firebase.auth().currentUser.uid + "/Channel_requests-received/"),
        ChannelRequests: [],

    };

    componentDidMount(){ 
        if(this.state.user){
        this.addListeners(this.state.user.uid);
        
      }
    }
      

    addListeners = currentUserUid =>{
        let loadedChannelReqs=[];
        this.state.ChannelReqRef.on('child_added', snap => {

            if (currentUserUid !== snap.key){
            loadedChannelReqs.push(snap.val());
            console.log(loadedChannelReqs);
            this.setState({ChannelRequests: loadedChannelReqs});
        }
    }
        )

    }

    displayUsers = users => (
        users.length > 0  && users.map(user => (
            
                
                <React.Fragment>

                   <div class="ui middle aligned divided list">
                        <div class="item">
                        <div class="right floated content">
                        <button class="ui blue button" onClick={() => {window.alert("Join Topic")}}>Send Friend Request</button>
                    </div>
                        <img class="ui avatar image bordered" src={user.avatar}/>
                    <div class="content">
                    {user.name}
                    </div>      
                    </div>
                    <div class="item">
                    </div>
                    </div>                            
                </React.Fragment>
  
        ))
    )

    displayChannelRequests = ChannelRequests => (
        ChannelRequests.length > 0  && ChannelRequests.map(user => (
            
                
                <React.Fragment>

                   <div class="ui middle aligned divided list">
                        <div class="item">
                        <div class="right floated content">
                        <div class="ui red button">Allow</div>
                        <div class="ui button">Deny</div>
                    </div>
                    
                        <img class="ui mini left floated avatar image bordered" src={user.avatar}/>
                    <div class="content">
                        <h3><b>{user.name} </b> </h3>  Wants to join the Topic:  <div class="ui black horizontal label"> <u>#{user.channelName}</u></div>
                    </div>      
                    </div>
                    <div class="item">
                    </div>
                    </div>                            
                </React.Fragment>
  
        ))
    )

    SubmitChannelReq = () => {
        console.log("Request Sent");
        
    };
  

    onClose = () => this.setState({open: false});
    ChannelReqOpen =() => this.setState({open: true});
    render(){
        const{ user, modal, previewImage, croppedImage, users, ChannelRequests } = this.state;
        return(
            <div >
                <span onClick={this.ChannelReqOpen}><div>User Requests</div></span>
                    <Modal open={this.state.open} onClose={this.onClose}>
                        <Modal.Header> Topic Join Requests: ({ChannelRequests.length})</Modal.Header>
                            <Modal.Content>
                            <Modal.Description>
                                {this.displayChannelRequests(ChannelRequests)} 
                                  
                            </Modal.Description>
                            <React.Fragment>
                            </React.Fragment>
                            </Modal.Content>
                    </Modal>
            </div>
        )
    }
}



const mapStateToProps = state => ({
    currentUser: state.user.currentUser
  })
export default connect(mapStateToProps) (AdminRequests);