import * as OBC from 'openbim-components'

export class TodoCreator extends OBC.Component<null> implements OBC.UI {
  static uuid = "7d6ed77d-cf89-44e9-961b-f687747020e5"
  enabled = true
  uiElement = new OBC.UIElement<{
    activationButton: OBC.Button
    todoList: OBC.FloatingWindow
  }>()

  private _components: OBC.Components
  
  constructor(components: OBC.Components) {
    super(components)
    this._components = components
    components.tools.add(TodoCreator.uuid, this)
    this.setUI()
  }

  addTodo(description: string) {

  }

  private setUI() {
    const activationButton = new OBC.Button(this._components)
    activationButton.materialIcon = "construction"
    // activationButton.tooltip = "Create a todo"

    const newTodoBtn = new OBC.Button(this._components, {name: "Create"})
    activationButton.addChild(newTodoBtn)

    const form = new OBC.Modal(this._components)
    this._components.ui.add(form) 
    form.title = "Create a new todo"

    const descriptionInput = new OBC.TextArea(this._components)
    descriptionInput.label = "Description"
    form.slots.content.addChild(descriptionInput) 

    form.slots.content.get().style.padding = "20px"
    form.slots.content.get().style.display = "flex"
    form.slots.content.get().style.flexDirection = "column"
    form.slots.content.get().style.rowGap = "20px"
    
    form.onAccept.add(() => {})

    form.onCancel.add(() => form.visible = false)


    newTodoBtn.onClick.add(() => form.visible = true)

    const todoList = new OBC.FloatingWindow(this._components)
    this._components.ui.add(todoList)
    todoList.visible = false
    todoList.title = "To-Do list"

    const todoListBtn = new OBC.Button(this._components, {name: "List"})
    activationButton.addChild(todoListBtn)
    todoListBtn.onClick.add(() => {
      todoList.visible = !todoList.visible
    })

    this.uiElement.set({activationButton, todoList})
  }

  get(): null {}
}
