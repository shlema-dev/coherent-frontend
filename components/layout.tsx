import React, { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";
const Layout = (props: PropsWithChildren) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">{props.children}</div>
    </div>
  );
};

export default Layout;
