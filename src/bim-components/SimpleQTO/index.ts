import * as OBC from "openbim-components"
import * as WEBIFC from "web-ifc" 
import { FragmentsGroup } from "bim-fragment"

type QtoResult = {
  [setName: string]: {
    [qtoName: string]: number
  }
}


// const sum = {
//   Qto_WallBaseQuantities: {
//     volume: 0,
//     area: 0,
//   }
// }

export class SimpleQTO extends OBC.Component<QtoResult> implements OBC.UI, OBC.Disposable {
  static uuid: string = "a9bea4d6-421c-4aef-88ce-afb880fcbe98"
  enabled: boolean = true
  private _components: OBC.Components
  private _qtoResult: QtoResult = {}
  uiElement = new OBC.UIElement<{
    activationButton: OBC.Button
    qtoList: OBC.FloatingWindow
  }>()

  constructor(components: OBC.Components) {
    super(components)
    components.tools.add(SimpleQTO.uuid, this)
    this._components = components
    this.setUI()
  }

  async setup() {
    const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
    highlighter.events.select.onHighlight.add(async (fragmentIdMap) => {
      await this.sumQuantities(fragmentIdMap)
      await this.sumQuantities2(fragmentIdMap)
      this.updateUI()
    })
    highlighter.events.select.onClear.add(() => {
      this.resetQuantities()
    })    
  }

  resetQuantities() {
    this._qtoResult = {}
  }

  private setUI() {
    const activationButton = new OBC.Button(this._components)
    activationButton.materialIcon = "functions"

    const qtoList = new OBC.FloatingWindow(this._components)
    qtoList.title = "Quantity Takeoff"
    this._components.ui.add(qtoList)
    qtoList.visible = false

    activationButton.onClick.add(() => {
      activationButton.active = !activationButton.active
      qtoList.visible = activationButton.active
    })

    this.uiElement.set({activationButton, qtoList})
  }

  async updateUI() {
   this.resetQtoUI()
   const qtoList = this.uiElement.get("qtoList")
   const treeLevel1 = Object.keys(this._qtoResult)
   for (const qtoEntity of treeLevel1) {
    const tree = new OBC.TreeView(this._components, qtoEntity)
    tree.name = qtoEntity
    const qtoItems = this._qtoResult[treeLevel1[0]]
    for (const qtoItem in qtoItems) {
      const value = qtoItems[qtoItem]
      const qtoRecord = new OBC.SimpleUIComponent(this._components)
      qtoRecord.get().innerHTML = `${qtoItem}: ${value.toFixed(3)}`
      tree.addChild(qtoRecord)
    }
    qtoList.addChild(tree)
   }
  }

  async resetQtoUI() {
    const qtoList = this.uiElement.get("qtoList")
    qtoList.get().children[1].innerHTML = ""
  }

  async sumQuantities(fragmentIdMap: OBC.FragmentIdMap) {
    console.time("sumQuantities v1")
    const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
    for (const fragmentId in fragmentIdMap) {
      const fragment = fragmentManager.list[fragmentId]
      const model = fragment.mesh.parent 
      if (!(model instanceof FragmentsGroup) && model.properties) {continue} 
      const properties = model.properties
      OBC.IfcPropertiesUtils.getRelationMap(
        properties, 
        WEBIFC.IFCRELDEFINESBYPROPERTIES,
        (setID, relatedIDs) => {
          const set = properties[setID]
          const expressIDs = fragmentIdMap[fragmentId]
          const workingIDs = relatedIDs.filter(id => expressIDs.has(id.toString()))
          const { name: setName }  = OBC.IfcPropertiesUtils.getEntityName(properties, setID)
          if (set.type !== WEBIFC.IFCELEMENTQUANTITY || workingIDs.length === 0 || !setName) {return}
          if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
          OBC.IfcPropertiesUtils.getQsetQuantities(
            properties,
            setID,
            (qtoID) => {
              const { name: qtoName } = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
              const { value } = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
              // console.log(properties[qtoID])
              if (!qtoName || !value) {return}
              if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 }
              this._qtoResult[setName][qtoName] += value
            }
          )
        }
      )   
    }
    console.log(this._qtoResult);
    console.timeEnd("sumQuantities v1")
  }

  async sumQuantities2(fragmentIdMap: OBC.FragmentIdMap) {
    console.time("sumQuantities v2")
    const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
    const propertiesProcessor = await this._components.tools.get(OBC.IfcPropertiesProcessor)
    for (const fragmentId in fragmentIdMap) {
      const fragment = fragmentManager.list[fragmentId]
      const model = fragment.mesh.parent 
      if (!(model instanceof FragmentsGroup) && model.properties) {continue} 
      const properties = model.properties
      const modelIndexMap = propertiesProcessor.get()[model?.uuid]
      if (!modelIndexMap) {continue}  
      const expressIds = fragmentIdMap[fragmentId]
      for (const expressID of expressIds) {
        const entityMap = modelIndexMap[Number(expressID)]
        if (!entityMap) {continue}
        for (const mapID of entityMap) {
          const entity = properties[mapID]
          const { name: setName } = OBC.IfcPropertiesUtils.getEntityName(properties, mapID)
          if (!(entity.type === WEBIFC.IFCELEMENTQUANTITY && setName)) {continue}
          if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
          OBC.IfcPropertiesUtils.getQsetQuantities(
            properties,
            mapID,
            (qtoID) => {
              const { name: qtoName } = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
              const { value } = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
              if (!qtoName || !value) {return}
              if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 }
              this._qtoResult[setName][qtoName] += value
            }
          )
        } 
      }  
    }
    console.log(this._qtoResult);
    console.timeEnd("sumQuantities v2")
  }

  async dispose() {
    this._qtoResult = {}
    this.uiElement.dispose()
  }

  get(): QtoResult {
    return this._qtoResult
  }

  
}