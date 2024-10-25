import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectsManager } from '../classes/ProjectsManager';
import { IProject, ProjectStatus, ProjectUserRole, Project } from '../classes/Project';
import { ProjectDetailsPage } from './ProjectDetailsPage';

interface Props {
  projectsManager: ProjectsManager,
  project: IProject,
  onSubmit: (project: IProject) => void,
  onCancel: () => void
}

export function ProjectForm(openModal, closeModal, props: Props) {

  const [initialProject, setInitialProject] = React.useState<IProject>()
  const [updatedProject, setUpdatedProject] = React.useState<IProject>()
  
  setInitialProject(props.project)

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
      projectForm.reset()
      const editProjectModal = document.getElementById("edit-project-modal")    
      if (!(editProjectModal && editProjectModal instanceof HTMLDialogElement)) { return}
      editProjectModal.close()
      setUpdatedProject(projectData)
    } catch (error) {
      alert(error)
    }
  }

  const onDialogCancel = () => {
    setUpdatedProject(initialProject)
    const editProjectModal = document.getElementById("edit-project-modal")
    const projectForm = document.getElementById("edit-project-form")
    if (!(projectForm && projectForm instanceof HTMLFormElement)) { return }
    // console.log('reset');
    
    if (!(editProjectModal && editProjectModal instanceof HTMLDialogElement)) { return}

    editProjectModal.close()
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setUpdatedProject(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <dialog id="edit-project-modal">
      <form onSubmit={(event) => onFormSubmit(event)} id="edit-project-form">
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
              value={initialProject?.name}
              onChange={handleInputChange}/>
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
  )

}