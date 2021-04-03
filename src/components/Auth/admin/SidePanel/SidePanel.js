import React from "react";
import AdminPanel from "./AdminPanel";
import AdminChannels from "./AdminChannels";
import AdminDirectMessages from "./AdminDirectMessages";
import AdminManageFiles from "../ManageFiles";
import { Menu } from "semantic-ui-react";
import AdminManageReports from "../ManageReports";

class AdminSidePanel extends React.Component {
  render() {
    const { currentUser } = this.props;

    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: "#333333", fontSize: "1.2rem" }}
      >
        <AdminPanel currentUser={currentUser} />
        <AdminChannels currentUser={currentUser} />
        <AdminDirectMessages currentUser={currentUser} />
        <AdminManageFiles />
        <AdminManageReports />
      </Menu>
    );
  }
}

export default AdminSidePanel;
