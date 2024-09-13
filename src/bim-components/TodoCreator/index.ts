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
  }

  private setUI() {
    
  }

  get(): null {}
}
