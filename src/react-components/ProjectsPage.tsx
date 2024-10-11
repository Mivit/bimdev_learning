import * as React from 'react'
import * as Router from 'react-router-dom'
import { IProject, ProjectStatus, ProjectUserRole, Project } from '../classes/Project'
import { ProjectsManager } from '../classes/ProjectsManager'
import { ProjectCard } from './ProjectCard'

interface Props {
  projectsManager: ProjectsManager
} 

export function ProjectsPage(props: Props) {
  const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.list)
  props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.list])}
  props.projectsManager.onProjectDeleted = () => {setProjects([...props.projectsManager.list])}

  const projectCards = projects.map((project) => { 
    return (
      <Router.Link to={`/project/${project.id}`} key={project.id}>
        <ProjectCard project={project} key={project.id} />
      </Router.Link>
    )
  })

  React.useEffect(() => {
    console.log("Projects state updated", projects);
    
  }, [projects])

  const onNewProjectClick = () => {
    const newProjectModal = document.getElementById("new-project-modal")
    if (!(newProjectModal && newProjectModal instanceof HTMLDialogElement)) { return}
    newProjectModal.showModal()
  }

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const projectForm = document.getElementById("new-project-form")
    if (!(projectForm && projectForm instanceof HTMLFormElement)) { return }
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      userRole: formData.get('userRole') as ProjectUserRole,
      projectStatus: formData.get('status') as ProjectStatus,
      finishDate: new Date(formData.get('finishDate') as string),
    }
    // console.log('projectData', projectData);
    
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
    const newProjectModal = document.getElementById("new-project-modal")
    const projectForm = document.getElementById("new-project-form")
    if (!(projectForm && projectForm instanceof HTMLFormElement)) { return }
    console.log('reset');
    
    if (!(newProjectModal && newProjectModal instanceof HTMLDialogElement)) { return}
    newProjectModal.close()
  }

  const onProjectImportClick = () => {
    props.projectsManager.importFromJSON()
  }

  const onProjectExportClick = () => {
    props.projectsManager.exportToJSON()
  }

  return (
    <div className="page" id="projects-page" style={{ display: "flex" }}>
    <dialog id="new-project-modal">
      <form onSubmit={(event) => onFormSubmit(event)} id="new-project-form">
        <h2 style={{ margin: 20, paddingTop: 10 }}>New Project</h2>
        <div className="input-list">
          <div className="form-field-container">
            <label htmlFor="project_name">
              <span className="material-icons-round">apartment</span>Name
            </label>
            <input
              type="text"
              id="project_name"
              name="name"
              placeholder="What's the name of your project?"
            />
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
    <dialog id="error-modal" className="error-dialog">
      <h2 style={{ margin: 20, paddingTop: 10 }}>New Project</h2>
      <div id="error-message"></div>
    </dialog>
    <header id="page-header">
      <h5>Projects</h5>
      <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
        <span
          onClick={onProjectImportClick}
          id="import-projects-btn"
          className="material-icons-round action-icon"
        >
          file_upload
        </span>
        <span
          onClick={onProjectExportClick}
          id="export-projects-btn"
          className="material-icons-round action-icon"
        >
          file_download
        </span>
        <button onClick={onNewProjectClick} id="new-project-btn" >
          <span className="material-icons-round">add</span>New Project
        </button>
      </div>
    </header>
    <div id="projects-list">{ projectCards }</div>
  </div>

  )
}

