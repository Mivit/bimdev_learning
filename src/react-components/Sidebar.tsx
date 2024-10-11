import * as React from 'react'
import * as Router from 'react-router-dom'

export function Sidebar() {
  return (
    <aside id="sidebar">
        <img id="company-logo" src="./assets/company-logo.svg" alt="" />
        <ul id="nav-buttons">
          <Router.Link to="/">
            <li id="projects-page-btn"><span className="material-icons-round">apartment</span>Projects</li>
          </Router.Link>
          <Router.Link to="/project">
            <li id="users-page-btn"><span className="material-icons-round">groups</span>Users</li>
          </Router.Link>
        </ul>
      </aside>
  )
}

