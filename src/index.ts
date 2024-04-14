import { IProject, ProjectStatus, ProjectUserRole } from "./classes/Project";
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

const proejctsListUI = document.getElementById('projects-list') as HTMLElement;
const projectsManager = new ProjectsManager(proejctsListUI);
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
    event.preventDefault();
    const formData = new FormData(projectForm);
    const projectData: IProject = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      userRole: formData.get('userRole') as ProjectUserRole,
      projectStatus: formData.get('status') as ProjectStatus,
      finishDate: new Date(formData.get('finishDate') as string),
    }
    try {
      const project = projectsManager.newProject(projectData)
      projectForm.reset();
      // console.log(projectsManager.totalCost());
      closeModal("new-project-modal")        
    } catch (error) {
      alert(error)
    }
  })

} else {
  console.warn('projectForm was not found');
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


