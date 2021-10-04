import { defaultKeymap } from '@codemirror/commands'
import { MySQL, sql } from '@codemirror/lang-sql'
import { Compartment, StateEffect } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import {
  MenuOption,
  NButton,
  NButtonGroup,
  NDataTable,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NMenu,
  NSpace,
  useMessage,
} from 'naive-ui'
import { Editor } from '~'
import { reconfigureMap } from '~/hooks/use-codemirror'
import styles from './app.module.css'
export const App = defineComponent({
  setup() {
    const editorRef = ref<EditorView>()
    const menuOptions: MenuOption[] = [
      { label: 'Table-1', key: 'Table-1' },
      { label: 'Table-2', key: 'Table-2' },
    ]
    const menuRefKey = ref(null)
    const sqlQueryText = ref('')
    const message = useMessage()
    const handleQuery = () => {
      message.success(sqlQueryText.value)
    }

    const queryTableSchemaData = ref<Record<string, any>[]>([
      {
        rowName: 'id',
        type: 'long',
        primary: true,
      },
      {
        rowName: 'name',
        type: 'varchar',
      },
      {
        rowName: 'age',
        type: 'int',
      },
    ])

    const queryResultData = ref([
      { id: '1', name: 'John', age: 20 },
      { id: '2', name: 'Tom', age: 30 },
      { id: '3', name: 'Jack', age: 40 },
      { id: '4', name: 'Mike', age: 50 },
      { id: '5', name: 'Jane', age: 60 },
      { id: '6', name: 'Lily', age: 70 },
    ])

    {
      const disposer = watchEffect(() => {
        if (editorRef.value) {
          const codemirror = editorRef.value
          const compartment = new Compartment()

          const extraKeymapExtension = compartment.of(
            keymap.of([
              {
                key: 'Mod-Enter',
                run(view) {
                  handleQuery()
                  return false
                },
              },
            ]),
          )
          codemirror.dispatch({
            effects: StateEffect.appendConfig.of(extraKeymapExtension),
          })
          codemirror.dispatch({
            effects: reconfigureMap.defaultKeymap.reconfigure(
              keymap.of([
                ...defaultKeymap.filter((i) => i.key !== 'Mod-Enter'),
              ]),
            ),
          })

          codemirror.dispatch({
            effects: reconfigureMap.sql.reconfigure(
              sql({
                dialect: MySQL,
                // TODO
              }),
            ),
          })
          disposer()
        }
      })
    }
    return () => (
      <NLayout hasSider>
        <NLayoutSider bordered collapsed={false} width={240}>
          <NMenu
            value={menuRefKey.value}
            onUpdateValue={(e) => {
              menuRefKey.value = e
            }}
            options={menuOptions}
          ></NMenu>
        </NLayoutSider>
        <NLayoutContent>
          <div class={styles['wrapper']}>
            <Editor
              className={styles['top-grid']}
              editorRef={editorRef}
              initialValue={
                'select * from `table-1` where name = `foo` limit 1;'
              }
              onChange={(e) => {
                sqlQueryText.value = e.doc.toString()
              }}
            />

            <NLayoutContent>
              <NSpace justify="end" class="px-4">
                <NButtonGroup>
                  <NButton round type="primary" onClick={handleQuery}>
                    查询
                  </NButton>
                </NButtonGroup>
              </NSpace>
            </NLayoutContent>

            <NDataTable
              data={queryResultData.value}
              columns={queryTableSchemaData.value.map((schema) => {
                return { title: schema.rowName, key: schema.rowName }
              })}
            ></NDataTable>
          </div>
        </NLayoutContent>
      </NLayout>
    )
  },
})
