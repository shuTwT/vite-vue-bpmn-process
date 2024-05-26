import { defineComponent, ref } from 'vue'
import { NButton } from 'naive-ui'
import modeler from '@/store/modeler'

const Saves = defineComponent({
  name: 'SavesTool',
  setup() {
    const modelerStore = modeler()
    const doSave = async () => {
      const modeler = modelerStore.getModeler
      try {
        const { xml } = await modeler!.saveXML({ format: true, preamble: true })
        const message = {
          origin: 'bpmn-process',
          type: 'save',
          xml: xml
        }
        window.top?.postMessage(JSON.stringify(message), '*')
      } catch (e) {
        window.__messageBox.error((e as Error).message || (e as string))
      }
    }
    return () => (
      <span>
        <NButton type="info" secondary onClick={doSave}>
          保存
        </NButton>
      </span>
    )
  }
})

export default Saves
