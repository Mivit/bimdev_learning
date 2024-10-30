import * as React from 'react';
import { ProjectsManager } from '../classes/ProjectsManager';
import { IProject, ProjectStatus, ProjectUserRole, Project } from '../classes/Project';

interface ProjectFormProps {
  onCancel: () => void
  project: IProject
  projectsManager: ProjectsManager
  title: string
}

export function ProjectForm({onCancel, project, projectsManager, title}: ProjectFormProps) {
  // use state to store the project data
  const [initialProject, setInitialProject] = React.useState<IProject>(project)

  const onFormSubmit = (event) => {
   event.preventDefault()
   const formData = new FormData(event.target)
   console.log(initialProject);
   if (title === "New Project") {
    const newProject = projectsManager.newProject({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      userRole: formData.get('userRole') as ProjectUserRole,
      projectStatus: formData.get('status') as ProjectStatus,
      finishDate: new Date(formData.get('finishDate') as string),
    })
    console.log(newProject);
    setInitialProject(newProject)
   } else {
    const id = initialProject.id
    projectsManager.updateProject(initialProject, id); 
   }
   
   const editProjectModal = document.getElementById("modify-project-modal")
   if (!(editProjectModal && editProjectModal instanceof HTMLDialogElement)) { return }
   editProjectModal.close()
   
  }
  const onFormCancel = () => {
   setInitialProject(project); // Reset the form to initial project state
   const editProjectModal = document.getElementById("modify-project-modal")
   if (!(editProjectModal && editProjectModal instanceof HTMLDialogElement)) { return }
   editProjectModal.close()
  }

  React.useEffect(() => {
  //  console.log("Project state updated", project);
   
  }, [project])

  return (
  <dialog id="modify-project-modal" onCancel={onFormCancel}>
    <form onSubmit={(event) => onFormSubmit(event)} id="modify-project-form">
      <h2 style={{ margin: 20, paddingTop: 10 }}>{title}</h2>
      <div className="input-list">
        <div className="form-field-container">
          <label htmlFor="project_name">
            <span className="material-icons-round">apartment</span>Name
          </label>
          <input
            type="text"
            id="project_name"
            name="name"
            value={initialProject.name}
            onChange={(event) => setInitialProject({...initialProject, name: event.target.value})}
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
            value={initialProject.description}
            onChange={(event) => setInitialProject({...initialProject, description: event.target.value})}
          />
        </div>
        <div className="form-field-container">
          <label htmlFor="project_role">
            <span className="material-icons-round">person</span>Role
          </label>
          <select id="project_role" name="userRole" value={initialProject.userRole} onChange={(event) => setInitialProject({...initialProject, userRole: event.target.value})}>
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
          <select id="project_status" name="status" value={initialProject.projectStatus} onChange={(event) => setInitialProject({...initialProject, projectStatus: event.target.value})}>
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
            id="project_finishDate"
            name="finishDate"
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}}"
            value={initialProject.finishDate.toLocaleDateString()}
            onChange={(event) => setInitialProject({...initialProject, finishDate: new Date(event.target.value)})}
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
            onClick={onFormCancel}
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