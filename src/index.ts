import * as THREE from "three"
import * as OBC from "openbim-components"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { IProject, ProjectStatus, TodoStatus, ProjectUserRole } from "./classes/Project"
import { ProjectsManager } from "./classes/ProjectsManager"

// Function to show modal
function showModal(id: string, data: any) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal()
  } else {
    console.warn(`Modal with id ${id} was not found`)
  }
}

// Function to close modal
function closeModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close()
  } else {
    console.warn(`Modal with id ${id} was not found`)
  }
}

// Initializing project manager and DOM elements
const projectsListUI = document.getElementById('projects-list') as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)
const projectsPage = document.getElementById("projects-page")
const detailsPage = document.getElementById("project-details")
const userPage = document.getElementById("user-page")

// Add Event Listener to new project button
const newProjectBtn = document.getElementById('new-project-btn')
if (newProjectBtn) {
  const handleClick = () => { showModal("new-project-modal", undefined) }
  newProjectBtn.removeEventListener('click', handleClick)
  newProjectBtn.addEventListener('click', handleClick)
} else {
  console.warn('newProjectBtn was not found')
}

// Handle new project form submission
const projectForm = document.getElementById('new-project-form')
if (projectForm && projectForm instanceof HTMLFormElement) {
  const handleSubmit = (event) => {
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
      const project = projectsManager.newProject(projectData)
      projectForm.reset()
      closeModal("new-project-modal")
    } catch (error) {
      alert(error)
    }
  }

  const handleReset = () => {
    projectForm.reset()
    closeModal('new-project-modal')
  }

  projectForm.removeEventListener('submit', handleSubmit)
  projectForm.addEventListener('submit', handleSubmit)

  projectForm.removeEventListener('reset', handleReset)
  projectForm.addEventListener('reset', handleReset)
} else {
  console.warn('projectForm was not found')
}

// Edit project through details page modal
const editProjectBtn = document.getElementById('edit-project-btn')
if (editProjectBtn) {
  const handleClick = () => {
    showModal("edit-project-modal", undefined)

    const editForm = document.forms['edit-project-form']
    if (!editForm || !(editForm instanceof HTMLFormElement)) {
      console.warn('editForm was not found')
      return
    }

    // Get project data
    const editProjectName = detailsPage?.querySelector("[data-project-info='name']")
    const project = projectsManager.getProjectsByName(editProjectName?.textContent ?? '')[0]

    // Set form data
    editForm.elements['name'].value = project.name
    editForm.elements['description'].value = project.description
    editForm.elements['userRole'].value = project.userRole

    const userRoleForm = editForm.elements['userRole'] as HTMLSelectElement
    userRoleForm.options.namedItem(project.userRole)?.setAttribute('selected', 'selected')

    editForm.elements['status'].value = project.projectStatus
    const statusForm = editForm.elements['status'] as HTMLSelectElement
    statusForm.options.namedItem(project.projectStatus)?.setAttribute('selected', 'selected')

    editForm.elements['finishDate'].value = project.finishDate.toLocaleDateString("sv-SE")

    const handleSubmit = (event) => {
      event.preventDefault()
      const editableFormData = new FormData(editForm)
      const editedProjectData: IProject = {
        name: editableFormData.get('name') as string,
        description: editableFormData.get('description') as string,
        userRole: editableFormData.get('userRole') as ProjectUserRole,
        projectStatus: editableFormData.get('status') as ProjectStatus,
        finishDate: new Date(editableFormData.get('finishDate') as string),
      }

      try {
        projectsManager.updateProject(editedProjectData, project.id)
        editForm.reset()
        closeModal("edit-project-modal")
      } catch (error) {
        alert(error)
      }
    }

    const handleReset = () => {
      editForm.reset()
      closeModal('edit-project-modal')
    }

    // Ensure the event listener is only added once
    editForm.removeEventListener('submit', handleSubmit)
    editForm.addEventListener('submit', handleSubmit, { once: true }) // Add event listener only once

    editForm.removeEventListener('reset', handleReset)
    editForm.addEventListener('reset', handleReset, { once: true }) // Add event listener only once
  }
  editProjectBtn.removeEventListener('click', handleClick)
  editProjectBtn.addEventListener('click', handleClick)

} else {
  console.warn('editProjectBtn was not found')
}

// Add Todo Button Event Listener
const addTodoBtn = document.getElementById("add-todo")
if (addTodoBtn) {
  const handleClick = () => {
    showModal("new-todo-modal", undefined)

    const projectName = detailsPage?.querySelector("[data-project-info='name']")?.textContent
    const newTodoForm = document.forms['new-todo-form']

    const handleTodoSubmit = (event) => {
      event.preventDefault()
      const todoFormData = new FormData(newTodoForm)
      const todoData = {
        title: todoFormData.get('title') as string,
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
    }

    const handleTodoReset = () => {
      newTodoForm.reset()
      closeModal('new-todo-modal')
    }

    newTodoForm.removeEventListener('submit', handleTodoSubmit)
    newTodoForm.addEventListener('submit', handleTodoSubmit, { once: true }) // Add event listener only once

    newTodoForm.removeEventListener('reset', handleTodoReset)
    newTodoForm.addEventListener('reset', handleTodoReset, { once: true }) // Add event listener only once
  }
  addTodoBtn.removeEventListener('click', handleClick)
  addTodoBtn.addEventListener('click', handleClick)

} else {
  console.warn('addTodoBtn was not found')
}


// Export and import projects buttons
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

// Function to switch pages
function switchPage(input: string) {
  if (!(projectsPage && detailsPage && userPage)) { return }
  switch (input) {
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

// Switch navigation panel
const projectBtn = document.getElementById('projects-page-btn')
const usersBtn = document.getElementById('users-page-btn')

projectBtn?.addEventListener("click", () => {
  switchPage('projects')
})

usersBtn?.addEventListener("click", () => {
  switchPage('users')
})

const viewer = new OBC.Components()

const sceneComponent = new OBC.SimpleScene(viewer)
sceneComponent.setup()
viewer.scene = sceneComponent
const scene = sceneComponent.get()
scene.background = null

const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera = cameraComponent

const raycasterComponent = new OBC.SimpleRaycaster(viewer)
viewer.raycaster = raycasterComponent

viewer.init()
cameraComponent.updateAspect()
rendererComponent.postproduction.enabled = true

const ifcLoader = new OBC.FragmentIfcLoader(viewer)
ifcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.43/",
  absolute: true
}

const highlighter = new OBC.FragmentHighlighter(viewer)
highlighter.setup()

const classifier = new OBC.FragmentClassifier(viewer)
const classificationsWindow  = new OBC.FloatingWindow(viewer)
viewer.ui.add(classificationsWindow) 
classificationsWindow.title = "Model Groups"

async function createModelTree() {
  const fragmentTree = new OBC.FragmentTree(viewer)
  await fragmentTree.init()
  await fragmentTree.update(["storeys", "entities"])
  fragmentTree.onHovered.add((fragmentMap) => {
    highlighter.highlightByID("hover", fragmentMap)
  })
  fragmentTree.onSelected.add((fragmentMap) => {
    highlighter.highlightByID("select", fragmentMap)
  })
  const tree = fragmentTree.get().uiElement.get("tree")
  return tree
}

ifcLoader.onIfcLoaded.add( async (ifcModel) => {
  highlighter.update()
  classifier.byStorey(ifcModel)
  classifier.byEntity(ifcModel)
  const tree = await createModelTree()
  await classificationsWindow.slots.content.dispose(true)
  classificationsWindow.addChild(tree)
})

const toolbar = new OBC.Toolbar(viewer)
toolbar.addChild(
  ifcLoader.uiElement.get("main")
)
viewer.ui.addToolbar(toolbar)