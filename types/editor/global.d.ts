import { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
import { ElementLike } from 'diagram-js/lib/core'

declare global {
  interface Window {
    bpmnInstances: any
    __messageBox: MessageApiInjection
    trustOrigin: string
    setModelXml: (xml: string) => Promise<any>
    getModelXml: () => Promise<any>
    initModelXml: (xml: string) => Promise<any>
  }

  type BpmnElement = ElementLike & { type: string }
}

declare interface Window {
  bpmnInstances: any
}
