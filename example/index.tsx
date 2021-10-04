import { App } from 'App'
import { NDialogProvider, NMessageProvider } from 'naive-ui'
import * as Vue from 'vue'
import './index.css'
const Root = defineComponent(() => {
  return () => (
    <NMessageProvider>
      <NDialogProvider>
        <App />
      </NDialogProvider>
    </NMessageProvider>
  )
})
const app = Vue.createApp(Root)
app.mount(document.getElementById('app')!)
