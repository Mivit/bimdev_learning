import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectsManager } from '../classes/ProjectsManager';
import { IProject, ProjectStatus, ProjectUserRole, Project } from '../classes/Project'


interface Props {
  projectsManager: ProjectsManager
}

export function ProjectDetailsPage(props: Props) {
  const routeParams = useParams<{ id: string }>()
  if (!routeParams.id) { return (<p>A project ID is needed to see this page</p>) }  
  const project = props.projectsManager.getProject(routeParams.id)
  if (!project) { return (<p>No project with {routeParams.id} was found</p>) }  

  const [input, setInput] = React.useState([]))

  // copy project to editProject
  const editProject = {...project}
 

  const onEditProjectClick = () => {
    const editProjectModal = document.getElementById("edit-project-modal")
    if (!(editProjectModal && editProjectModal instanceof HTMLDialogElement)) { return }
    editProjectModal.showModal()
  }

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const projectForm = document.getElementById("edit-project-form")
    if (!(projectForm && projectForm instanceof HTMLFormElement)) { return }
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      userRole: formData.get('userRole') as ProjectUserRole,
      projectStatus: formData.get('status') as ProjectStatus,
      finishDate: new Date(formData.get('finishDate') as string),
    }
    
    try {
      const project = props.projectsManager.newProject(projectData)
      projectForm.reset()
      const newProjectModal = document.getElementById("new-project-modal")    
      if (!(newProjectModal && newProjectModal instanceof HTMLDialogElement)) { return}
      newProjectModal.close()
    } catch (error) {
      alert(error)
    }
  }

  const onDialogCancel = () => {
    const editProjectModal = document.getElementById("edit-project-modal")
    const projectForm = document.getElementById("new-project-form")
    if (!(projectForm && projectForm instanceof HTMLFormElement)) { return }
    console.log('reset');
    
    if (!(editProjectModal && editProjectModal instanceof HTMLDialogElement)) { return}
    editProjectModal.close()
  }



  return (
    <div className="page" id="project-details">
      <dialog id="edit-project-modal">
        <form onSubmit={(event) => onFormSubmit(event)} id="new-project-form">
          <h2 style={{ margin: 20, paddingTop: 10 }}>Edit Project</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label htmlFor="project_name">
                <span className="material-icons-round">apartment</span>Name
              </label>
              <input
                type="text"
                id="project_name"
                name="name"
                value={editProject.name}
                onChange={(e) => handleChange(e)}/>
              <p style={{
                color: "gray",
                fontSize: "0.8rem",
                margin: "5px 0px 0px 0px"
              }}>TIP: Give it a short name</p>
            </div>
            <div className="form-field-container">
              <label htmlFor="project_desc">
                <span className="material-icons-round">subject</span>Description
              </label>
              <textarea
                id="project_desc"
                name="description"
                cols={30}
                rows={5}
                placeholder="Give your project a nice description! So people is jealous about it."
                defaultValue={""}
              />
            </div>
            <div className="form-field-container">
              <label htmlFor="project_role">
                <span className="material-icons-round">person</span>Role
              </label>
              <select id="project_role" name="userRole">
                <option>Architect</option>
                <option>Engineer</option>
                <option>Developer</option>
              </select>
            </div>
            <div className="form-field-container">
              <label htmlFor="project_status">
                <span className="material-icons-round">not_listed_location</span>
                Status
              </label>
              <select id="project_status" name="status">
                <option>Pending</option>
                <option>Active</option>
                <option>Finished</option>
              </select>
            </div>
            <div className="form-field-container">
              <label htmlFor="finishDate">
                <span className="material-icons-round">calendar_month</span>
                Finish Date
              </label>
              <input
                type="date"
                id="finishDate"
                name="finishDate"
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}}"
              />
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0px 10px auto",
                columnGap: 10
              }}
            >
              <button
                type="reset"
                id="form-cancel"
                style={{ backgroundColor: "transparent" }}
                onClick={onDialogCancel}
              >
                Cancel
              </button>
              <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
                Accept
              </button>
            </div>
          </div>
        </form>
      </dialog>
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
              <button id="edit-project-btn" onClick={onEditProjectClick} className="btn-secondary">
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