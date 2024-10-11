import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectsManager } from '../classes/ProjectsManager';
import { Project } from '../classes/Project';

interface Props {
  projectsManager: ProjectsManager
}

function onEditProject() {
  alert("Edit project")
}

export function ProjectDetailsPage(props: Props) {
  const routeParams = useParams<{ id: string }>()
  if (!routeParams.id) { return (<p>A project ID is needed to see this page</p>) }  
  const project = props.projectsManager.getProject(routeParams.id)
  if (!project) { return (<p>No project with {routeParams.id} was found</p>) }  
 
  return (
    <div className="page" id="project-details">
      <header>
        <div>
          <h2>{project.name}</h2> 
          <p style={{ color: "#969696" }} >{project.description} </p>
        </div>
      </header>
      <div className="main-page-content">
        <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
          <div className="dashboard-card" style={{ padding: "30px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 30px",
                marginBottom: 30
              }}
            >
              <p id="round" className="round-abbr">
                {project.name.slice(0, 2).toUpperCase()}
              </p>
              <button id="edit-project-btn" onClick={onEditProject} className="btn-secondary">
                <p style={{ width: "100%" }} >Edit</p>
              </button>
            </div>
            <div style={{ paddingLeft: 30 }}>
              <h4>{project.name}</h4>
              <p>{project.description}</p>
            </div>
            <div
              style={{
                paddingLeft: 20,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                margin: 10
              }}
            >
              <div>
                <p style={{ color: "#969696" }}>Status</p>
                <p>{project.projectStatus}</p>
              </div>
              <div>
                <p style={{ color: "#969696" }}>Cost</p>
                <p>${project.cost}</p>
              </div>
              <div>
                <p style={{ color: "#969696" }}>Role</p>
                <p>{project.userRole}</p>
              </div>
              <div>
                <p style={{ color: "#969696" }}>Finish Date</p>
                <p>{project.finishDate.toLocaleDateString()}</p>
              </div>
            </div>
            <div
              style={{ backgroundColor: "#969696", borderRadius: 10, margin: 30 }}
            >
              <div
                style={{
                  height: 20,
                  width: `${project.progress * 100}%`,
                  backgroundColor: "green",
                  borderRadius: "10px 0 0 10px",
                  textAlign: "center"
                }}
              >{project.progress * 100}</div>
            </div>
          </div>
          <div className="dashboard-card" style={{ flexGrow: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <h2 style={{ paddingLeft: 30 }}>To-do</h2>
                <h5
                  style={{
                    paddingLeft: 30,
                    fontSize: "--font-xs",
                    fontWeight: 100
                  }}
                >
                  Click todo to change status
                </h5>
              </div>
              <div
                style={{
                  margin: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span className="material-icons-round" style={{ marginRight: 10 }}>
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search To-Do's by name"
                  style={{ height: 12, margin: "10px 0" }}
                />
                <span
                  id="add-todo"
                  className="material-icons-round"
                  style={{ marginLeft: 10 }}
                >
                  add
                </span>
              </div>
            </div>
            <div id="todo-container" style={{ padding: "0 20px 10px 20px" }}></div>
          </div>
        </div>
        <div
          id="viewer-container"
          className="dashboard-card"
          style={{ minWidth: 0, position: "relative" }}
        />
      </div>
    </div>

  )
}