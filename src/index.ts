import { IProject, ProjectStatus, TodoStatus, ProjectUserRole } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";

function showModal(id: string, data: any) { 
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal()
  } else {
    console.warn(`Modal with id ${id} was not found`);
  }
}

function closeModal(id: string) {  
  const modal = document.getElementById(id)
  if (modal  && modal instanceof HTMLDialogElement) {
    modal.close()
  } else {
    console.warn(`Modal with id ${id} was not found`);
  }
}

const projectsListUI = document.getElementById('projects-list') as HTMLElement;
const projectsManager = new ProjectsManager(projectsListUI);
const projectsPage = document.getElementById("projects-page")
const detailsPage = document.getElementById("project-details")
const userPage = document.getElementById("user-page")

const newProjectBtn = document.getElementById('new-project-btn')
if (newProjectBtn) {
  newProjectBtn.addEventListener('click', () => {showModal("new-project-modal", undefined)})  
} else {
  console.warn('newProjectBtn was not found');
}

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const projectForm = document.getElementById('new-project-form')
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      userRole: formData.get('userRole') as ProjectUserRole,
      projectStatus: formData.get('status') as ProjectStatus,
      finishDate: new Date(formData.get('finishDate') as string),
    }
    try {
      projectsManager.newProject(projectData)
      projectForm.reset()
      // console.log(projectsManager.totalCost());
      

      closeModal("new-project-modal")        
    } catch (error) {
      alert(error)
    }
  })

  projectForm.addEventListener('reset', (event) => {
    // console.log('cancel');
    projectForm.reset()
    closeModal('new-project-modal')
    
  })
} else {
  console.warn('projectForm was not found');
}

// edit 
const editProjectBtn = document.getElementById('edit-project-btn')
if (editProjectBtn) {
  editProjectBtn.addEventListener('click', () => {
    showModal("edit-project-modal", undefined)

    // console.log(editableFormData.get('name') as string);
    const editForm = document.forms['edit-project-form']
  
    // get project data 
    const editProjectName = detailsPage?.querySelector("[data-project-info='name']")
    const project = projectsManager.getProjectsByName(editProjectName?.textContent ?? '')[0];
    // console.log(project);
    
    // instead of placehodlers
    if (editForm && editForm instanceof HTMLFormElement) {
      const formElement = document.forms['edit-project-form']
      
      // Set data
      formElement.elements['name'].value = project.name
      formElement.elements['description'].value = project.description
      formElement.elements['userRole'].value = project.userRole
      // set form attribute to corresponing optin to selected

      const userRoleForm = formElement.elements['userRole'] as HTMLSelectElement
      userRoleForm.options.namedItem(project.userRole)?.setAttribute('selected', 'selected')

      formElement.elements['status'].value = project.projectStatus
      // set form attribute to corresponing optin to selected
      const statusForm = formElement.elements['status'] as HTMLSelectElement
      statusForm.options.namedItem(project.projectStatus)?.setAttribute('selected', 'selected')

      formElement.elements['finishDate'].value = project.finishDate.toLocaleDateString("sv-SE")

      // handle edited data
      editForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const editableFormData = new FormData(editForm)
        const editedProjectData: IProject = {
          name: editableFormData.get('name') as string,
          description: editableFormData.get('description') as string,
          userRole: editableFormData.get('userRole') as ProjectUserRole,
          projectStatus: editableFormData.get('status') as ProjectStatus,
          finishDate: new Date(editableFormData.get('finishDate') as string),
        }
        // project.removeUI()

        try {       
          // console.log(editedProjectData, project.name);
          // update project UI

          projectsManager.updateProject(editedProjectData, project.name)
          project.setUI()
          editForm.reset()
          closeModal("edit-project-modal")  

        } catch (error) {
          alert(error)
        }
      }) 
      } else {
        console.warn('editForm was not found');
      }
      editForm.addEventListener('reset', () => {
        // console.log('cancel');

        editForm.reset()
        closeModal('edit-project-modal')
      })
  })  
} else {
  console.warn('editProjectBtn was not found');
}

const addTodoBtn = document.getElementById("add-todo")
if (addTodoBtn) {
  addTodoBtn.addEventListener("click", () => {
    showModal("new-todo-modal", undefined)
    const projectName = detailsPage?.querySelector("[data-project-info='name']")?.textContent
    
    const newTodoForm = document.forms['new-todo-form']
    newTodoForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const todoFormData = new FormData(newTodoForm)
      const todoData = {
        name: todoFormData.get('title') as string,
        description: todoFormData.get('description') as string,
        status: todoFormData.get('status') as TodoStatus,
        dueDate: new Date(todoFormData.get('dueDate') as string),
      }
      try {       
        projectsManager.addTodo(projectName, todoData)

        newTodoForm.reset()
        closeModal("new-todo-modal")  

      } catch (error) {
        alert(error)
      }
    }) 
    newTodoForm.addEventListener('reset', () => {
      newTodoForm.reset()
      closeModal('new-todo-modal')
      
    })
  })
}

const exportProjectsBtn = document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

function switchPage(input) {
  if (!(projectsPage && detailsPage && userPage)) { return }
  switch (input) {
    case 'projects':
      detailsPage.style.display = "none"    
      projectsPage.style.display = "flex"
      userPage.style.display = "none"   
      break 
    case 'users':
      detailsPage.style.display = "none"    
      projectsPage.style.display = "none"
      userPage.style.display = "flex"
      break
    default:
      detailsPage.style.display = "none"    
      projectsPage.style.display = "flex"
      userPage.style.display = "none"   
  }
}

const projectBtn = document.getElementById('projects-page-btn') 
const usersBtn = document.getElementById('users-page-btn') 

projectBtn?.addEventListener("click", () => {
  switchPage('projects')  
})

usersBtn?.addEventListener("click", () => {
  switchPage('users')
})


