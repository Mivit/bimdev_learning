import * as React from 'react'
import * as Router from 'react-router-dom'
import { IProject, ProjectStatus, ProjectUserRole, Project } from '../classes/Project'
import { ProjectsManager } from '../classes/ProjectsManager'
import { ProjectCard } from './ProjectCard'
import { ProjectForm } from './ProjectForm'

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

  const [newProjectIsOpen, setNewProjectIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (newProjectIsOpen) {
      openModal()
    }
  }, [newProjectIsOpen])

  const onNewProjectClick = () => {
    setNewProjectIsOpen(true)
    openModal()
  }

  // const onFormSubmit = (event: React.FormEvent) => {
  //   event.preventDefault()
  //   const projectForm = document.getElementById("new-project-form")
  //   if (!(projectForm && projectForm instanceof HTMLFormElement)) { return }
  //   const formData = new FormData(projectForm)
  //   const projectData: IProject = {
  //     name: formData.get('name') as string,
  //     description: formData.get('description') as string,
  //     userRole: formData.get('userRole') as ProjectUserRole,
  //     projectStatus: formData.get('status') as ProjectStatus,
  //     finishDate: new Date(formData.get('finishDate') as string),
  //   }
    
  //   try {
  //     const project = props.projectsManager.newProject(projectData)
  //     projectForm.reset()
  //     const newProjectModal = document.getElementById("new-project-modal")    
  //     if (!(newProjectModal && newProjectModal instanceof HTMLDialogElement)) { return}
  //     newProjectModal.close()
  //   } catch (error) {
  //     alert(error)
  //   }
  // }

  const onDialogCancel = () => {
    const newProjectModal = document.getElementById("modify-project-modal")
    const projectForm = document.getElementById("modify-project-form")
    if (!(projectForm && projectForm instanceof HTMLFormElement)) { return }
    console.log('reset');
    
    if (!(newProjectModal && newProjectModal instanceof HTMLDialogElement)) { return}
    newProjectModal.close()
  }

  const openModal = () => {
    const newProjectModal = document.getElementById("modify-project-modal")
    if (!(newProjectModal && newProjectModal instanceof HTMLDialogElement)) { return }
    newProjectModal.showModal()
  }

  const onProjectImportClick = () => {
    props.projectsManager.importFromJSON()
  }

  const onProjectExportClick = () => {
    props.projectsManager.exportToJSON()
  }

  return (
    <div className="page" id="projects-page" style={{ display: "flex" }}>
    <ProjectForm onCancel={onDialogCancel} openModal={openModal} project={new Project({name: "", description: "", userRole: "Architect", projectStatus: "Pending", finishDate: new Date()})} projectsManager={props.projectsManager} title={"New Project"}/>
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

