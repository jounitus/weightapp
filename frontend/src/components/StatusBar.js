// @flow

import React from 'react';
import './StatusBar.css';


export type StatusBarProps = {
    className: "inactive" | "active" | "success" | "failure",
    statusText: string
}

export function getActiveProps(statusText: ?string): StatusBarProps {
    return {
        className: "active",
        statusText: statusText || "Loading..."
    }
}

export function getSuccessProps(statusText: ?string): StatusBarProps {
    return {
        className: "success",
        statusText: statusText || "Success!"
    }
}

export function getFailureProps(statusText: ?string): StatusBarProps {
    return {
        className: "failure",
        statusText: statusText || "Error"
    }
}

export default function StatusBar(props: StatusBarProps) {

    return (
      <div className="statusBar">
          <div className={(props.className || "inactive") + " holder"}>
              <div className="content">
                  {props.statusText}
              </div>
              <div className="loadBar"></div>
          </div>
      </div>
    );

}