import React from "react";
import { Modal, Input, Button, Icon, Menu } from "semantic-ui-react";


class AdminManageReports extends React.Component{
    state = {
        reports: []
      };
    
      render() {
        const { reports } = this.state;
    
        return (
          <Menu.Menu style={{ paddingBottom: "2em" }}>
            <Menu.Item>
              <span>
                <Icon name="book" /> REPORTS
                </span>{" "}
              ({reports.length}) 
              
            </Menu.Item>
            {/* reports */}
          </Menu.Menu>
        );
      }
    }

export default AdminManageReports;