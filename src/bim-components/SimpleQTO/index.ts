import * as OBC from "openbim-components"

export class SimpleQTO extends OBC.Component<null> implements OBC.UI, OBC.Disposable {
  static uuid: string = "a9bea4d6-421c-4aef-88ce-afb880fcbe98"
  enabled: boolean = true
  private _components: OBC.Components
  uiElement = new OBC.UIElement<{
    activationBtn: OBC.Button
    qtoList: OBC.FloatingWindow
  }>()

  constructor(components: OBC.Components) {
    super(components)
    components.tools.add(SimpleQTO.uuid, this)
    this._components = components
    this.setUI()
  }

  private setUI() {
    const activationBtn = new OBC.Button(this._components)
    activationBtn.materialIcon = "functions"

    const qtoList = new OBC.FloatingWindow(this._components)
    qtoList.title = "Quantity Takeoff"
    this._components.ui.add(qtoList)
    qtoList.visible = false

    activationBtn.onClick.add(() => {
      activationBtn.active = !activationBtn.active
      qtoList.visible = activationBtn.active
    })

    this.uiElement.set({activationBtn, qtoList})
  }

  async dispose() {
    this.uiElement.dispose()
  }

  get(): null {
    return null
  }

  
}