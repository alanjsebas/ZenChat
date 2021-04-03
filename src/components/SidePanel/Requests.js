import React from "react";
import firebase from "../../firebase";
import {connect} from "react-redux";
import { Icon, Modal,Button, ModalActions, Menu, Image, Label } from "semantic-ui-react";


class Requests extends React.Component{
    state = {
        open: false,
        users: [],
        user: this.props.currentUser,
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        FrensRef: firebase.database().ref("/users/" + firebase.auth().currentUser.uid + "/friend_requests_received/"),
        FriendRequests: [],

    };

    componentDidMount(){ 
        if(this.state.user){
        this.addListeners(this.state.user.uid);
        
      }
    }

    componentWillUnMount(){
        if(this.state.user){
        this.removeListeners(this.state.user.uid);

      }
    }
      

    addListeners = currentUserUid =>{
        let loadedFrens=[];
        


        this.state.FrensRef.on('child_added', snap => {

            if (currentUserUid !== snap.key){
            loadedFrens.push(snap.val());
            console.log(loadedFrens);
            this.setState({FriendRequests: loadedFrens});
        }
    }
        )



    }

    removeListeners = currentUserUid =>{
        this.state.FrensRef.off();
    }

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
  

    onClose = () => this.setState({open: false});
    FrenReqOpen =() => this.setState({open: true});
    render(){
        const{users,FriendRequests } = this.state;
        
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
export default connect(mapStateToProps) (Requests);