import * as OBC from "openbim-components"

export class TodoCard extends OBC.SimpleUIComponent {
  
  onCardClick = new OBC.Event()
  
  set description(value: string) {
    const descriptionElement =  this.getInnerElement("description") as HTMLParagraphElement
    descriptionElement.textContent = value
  }
  
  set date(value: Date) {
    const dateElement =  this.getInnerElement("date") as HTMLParagraphElement
    dateElement.textContent = value.toDateString()
  }
  icon: string

  constructor(components: OBC.Components) {
    const template = `
      <div class="todo-item">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; column-gap: 15px; align-items: center;">
            <span class="material-icons-round" style="padding: 10px; border-radius: 5px; background-color: #686868">construction</span>
            <p id="description">Make anything...</p>
          </div>
          <p id="date" style="text-wrap: nowrap; margin-left: 10px;">Fri, 20 sep</p>
        </div>
      </div>
    `
    super(components, template)
    const cardElement = this.get()
    cardElement.addEventListener("click", () => {
      this.onCardClick.trigger()
    })
  }
}