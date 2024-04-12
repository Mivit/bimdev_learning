import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type ProjectUserRole = "Architect" | "Engineer" | "Developer"

export interface IProject {
  name: string
	description: string
	projectStatus: ProjectStatus
	userRole: ProjectUserRole
	finishDate: Date
}

export class Project implements IProject {
	//To satisfy IProject
  name: string
	description: string
	projectStatus: "Pending" | "Active" | "Finished"
	userRole: "Architect" | "Engineer" | "Developer"
  finishDate: Date
  
  //Class internals
  ui: HTMLDivElement
  cost: number = 1000
  progress: number = 0
  id: string

  constructor(data: IProject) {
    for (const key in data) {
      this[key] = data[key]
    }
    this.id = uuidv4()
    this.setUI()
  }

  setUI() {
    if (this.ui && Object.keys(this.ui).length !== 0 ) {return}
    
    this.ui = document.createElement("div")
    this.ui.className = "project-card"
    this.ui.innerHTML = `
    <div class="card-header">
      <div style="display: flex; flex-direction: row">
        <p style="background-color: #ca8134; margin-right: 10px; padding: 10px; border-radius: 8px; aspect-ratio: 1; height: 2em;">HC</p>
        <div style="align-content: bottom;">
          <h5>${this.name}</h5>
          <p>${this.description}</p>
        </div>
      </div>
    </div>
    <div class="card-content">
      <div class="card-property">
        <p style="color: #969696;">Status</p>
        <p>${this.projectStatus}</p>
      </div>
      <div class="card-property">
        <p style="color: #969696;">Role</p>
        <p>${this.userRole}</p>
      </div>
      <div class="card-property">
        <p style="color: #969696;">Cost</p>
        <p>$${this.cost}</p>
      </div>
      <div class="card-property">
        <p style="color: #969696;">Estimated Progress</p>
        <p>${this.progress * 100}%</p>
      </div>
    </div>`
  }
}