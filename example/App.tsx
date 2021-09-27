import { Editor } from '~'
import styles from './app.module.css'
export const App = defineComponent({
  setup() {
    return () => (
      <div class={styles['wrapper']}>
        <h1>Markdown Editor</h1>
        <Editor
          onChange={(e) => {
            console.log(e)
          }}
        />
      </div>
    )
  },
})
