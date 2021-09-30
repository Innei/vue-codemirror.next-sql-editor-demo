import { Editor } from '~'
import styles from './app.module.css'
export const App = defineComponent({
  setup() {
    return () => (
      <div class={styles['wrapper']}>
        <h1>SQL editor</h1>
        <Editor
          initialValue={'select * from `table-1` where name = `foo` limit 1;'}
          onChange={(e) => {
            console.log(e.doc.toString())
          }}
        />
      </div>
    )
  },
})
