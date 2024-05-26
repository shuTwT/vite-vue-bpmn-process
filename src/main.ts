import { createApp } from 'vue'
import { setupStore } from './store'
import useModelerStore from './store/modeler'
import App from './App.js'

import './styles/index.scss'

import {
  createDiscreteApi,
  create,
  NColorPicker,
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NButton,
  NButtonGroup,
  NTag,
  NCollapse,
  NCollapseItem,
  NDataTable,
  NPopover,
  NDrawer,
  NDrawerContent,
  NModal,
  NCode,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NCheckbox,
  NCheckboxGroup,
  NSelect,
  NSwitch
} from 'naive-ui'

const naive = create({
  components: [
    NColorPicker,
    NConfigProvider,
    NMessageProvider,
    NDialogProvider,
    NButton,
    NButtonGroup,
    NTag,
    NCollapse,
    NCollapseItem,
    NDataTable,
    NPopover,
    NDrawer,
    NDrawerContent,
    NModal,
    NCode,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NRadio,
    NRadioGroup,
    NCheckbox,
    NCheckboxGroup,
    NSelect,
    NSwitch
  ]
})

const { message, notification, dialog, loadingBar } = createDiscreteApi([
  'message',
  'dialog',
  'notification',
  'loadingBar'
])
window.__messageBox = message

import LucideIcon from '@/components/common/LucideIcon.vue'
import EditItem from '@/components/common/EditItem.vue'
import CollapseTitle from '@/components/common/CollapseTitle.vue'

import 'virtual:svg-icons-register'

import i18n from '@/i18n'

const app = createApp(App)

app.use(i18n)
setupStore(app)
app.use(naive)
app.component('LucideIcon', LucideIcon)
app.component('EditItem', EditItem)
app.component('CollapseTitle', CollapseTitle)

app.mount('#app')

const modelerStore = useModelerStore()

window.setModelXml = (xml: string) => {
  return new Promise((resolve, reject) => {
    const modeler = modelerStore.getModeler
    modeler
      ?.importXML(xml)
      .then((value) => {
        resolve(value)
      })
      .catch((res) => {
        reject(res)
      })
  })
}
window.getModelXml = async () => {
  const modeler = modelerStore.getModeler
  const { xml } = await modeler!.saveXML({ format: true })
  return xml
}

window.initModelXml = (xml: string) => {
  return new Promise((resolve, reject) => {
    const modeler = modelerStore.getModeler
    modeler
      ?.importXML(xml)
      .then((value) => {
        resolve(value)
      })
      .catch((res) => {
        reject(res)
      })
  })
}

window.addEventListener(
  'message',
  (e) => {
    // if (e.origin !== window.trustOrigin) {
    //   return
    // }
    if (typeof e.data !== 'string') {
      return
    }
    const data = e.data
    console.log(data)
    try {
      const msg = JSON.parse(data)
      if (msg.target === 'bpmn-process') {
        if (msg.type === 'setModelXml') {
          window.setModelXml(msg.xml)
        } else if (msg.type === 'getModelXml') {
          window.getModelXml().then((xml) => {
            const message = {
              origin: 'bpmn-process',
              type: 'getModelXml',
              xml: xml
            }
            window.top?.postMessage(JSON.stringify(message), '*')
          })
        }
      }
    } catch (error) {
      window.__messageBox.error(String(error))
    }
  },
  false
)
