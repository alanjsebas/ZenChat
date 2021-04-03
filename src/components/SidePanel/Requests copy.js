import React from "react";
import firebase from "../../firebase";
import {connect} from "react-redux";
import { Icon, Modal,Button, ModalActions, Menu, Image } from "semantic-ui-react";

class Requests extends React.Component{
    state = {
        open: false,
        users: [],
        user: this.props.currentUser,
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        FrensRef: firebase.database().ref('/users/' + firebase.auth().currentUser.uid + "/friend_requests_received/"),
        FriendRequests: [],
        IsSubmitReq: false

    };

    componentDidMount(){ 
        if(this.state.user){
        this.addListeners(this.state.user.uid);
        
      }
    }
      

    addListeners = currentUserUid =>{
        let loadedUsers =[];
        let loadedFrens=[];
        
        
        
        this.state.usersRef.on('child_added', snap => {

            if (currentUserUid !== snap.key){
            loadedUsers.push(snap.val());
            console.log(loadedUsers);
            this.setState({users: loadedUsers});
        }
    }
        

        )

        this.state.FrensRef.on('child_added', snap => {

            if (currentUserUid !== snap.key){
            loadedFrens.push(snap.val());
            console.log(loadedFrens);
            this.setState({FriendRequests: loadedFrens});
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

    displayRequests = FriendRequests => (
        FriendRequests.length > 0  && FriendRequests.map(user => (
            
                
                <React.Fragment>

                   <div class="ui middle aligned divided list">
                        <div class="item">
                        <div class="right floated content">
                        <div class="ui red button">Accept</div>
                        <div class="ui button">Reject</div>
                    </div>
                    
                        <img class="ui avatar image bordered" src={user.avatar}/>
                    <div class="content">
                        <h3><b>{user.name}</b></h3> has sent you a Friend Request.
                    
                    </div>      
                    </div>
                    <div class="item">
                    </div>
                    </div>                            
                </React.Fragment>
  
        ))
    )

    SubmitFrenReq = () => {
        console.log("Request Sent");
        
    };

    subFriend = () =>{
        if(this.state.IsSubmitReq){
            console.log("Sent Request");
        }else{
            console.log("Request Not Sent");
        }
    } 


    

    onClose = () => this.setState({open: false});
    FrenReqOpen =() => this.setState({open: true});
    render(){
        const{ user, modal, previewImage, croppedImage, users,FriendRequests, SubmitFrenReq, IsSubmitReq } = this.state;
        return(
            <div >
                <span onClick={this.FrenReqOpen}><div>Friend Requests</div></span>
                    <Modal open={this.state.open} onClose={this.onClose}>
                        <Modal.Header>Friend Requests:</Modal.Header>
                            <Modal.Content>
                            <Modal.Description>
                                <span> <h3 class="ui grey header"><u>Received Requests: ({FriendRequests.length})</u></h3>
                                {this.displayRequests(FriendRequests)}
                                
                                </span>
                                <span><br></br><h3 class="ui grey header"><u>Discover Users: ({users.length})</u></h3></span>
                                
                            </Modal.Description>
                            
                            <React.Fragment>
                            
                            
                            {this.displayUsers(users)}
                            
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
export default connect(mapStateToProps) (Requests);