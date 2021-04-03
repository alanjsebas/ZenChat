import React from "react";
import { Modal, Input, Button, Icon, Menu } from "semantic-ui-react";


class AdminManageFiles extends React.Component{
    state = {
        files: []
      };
    
      render() {
        const { files } = this.state;
    
        return (
          <Menu.Menu style={{ paddingBottom: "2em" }}>
            <Menu.Item>
              <span>
                <Icon name="file alternate" /> USER FILES
                </span>{" "}
              ({files.length}) 
              
            </Menu.Item>
            {/* Files */}
          </Menu.Menu>
        );
      }
    }

export default AdminManageFiles;