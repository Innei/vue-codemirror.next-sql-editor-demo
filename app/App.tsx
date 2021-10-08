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
  NText,
  useMessage,
} from 'naive-ui'
import { execSql, QueryError, tableNames, tableSchema } from 'sqlite'
import { Editor } from '~'
import { reconfigureMap } from '~/hooks/use-codemirror'
import styles from './app.module.css'

export const App = defineComponent({
  setup() {
    const editorRef = ref<EditorView>()
    const menuOptions: MenuOption[] = tableNames.map((name) => ({
      key: name,
      label: name,
    }))
    const menuRefKey = ref(null)
    const sqlQueryText = ref('')
    const message = useMessage()

    watch(
      () => menuRefKey.value,
      (currentTable) => {
        if (currentTable) {
          sqlQueryText.value = `SELECT * FROM ${currentTable};`

          queryResultData.value = []
          queryTableSchemaData.value = []
        }
      },
    )

    watch(
      () => sqlQueryText.value,
      (localQueryText) => {
        if (editorRef.value) {
          const valueInEditor = editorRef.value.state.doc.toString()
          if (valueInEditor !== localQueryText) {
            editorRef.value.dispatch({
              changes: {
                from: 0,
                to: editorRef.value.state.doc.length,
                insert: localQueryText,
              },
            })
          }
        }
      },
    )

    const handleQuery = async () => {
      message.success(sqlQueryText.value)
      const res = await execSql(sqlQueryText.value)
      // TODO

      if (res instanceof QueryError) {
        queryResultData.value = []
        queryTableSchemaData.value = []

        message.error(res.message)

        return
      }
      const { columns, values } = res[0]

      const combineObject = (columns: string[], values: any[]) => {
        return columns.reduce((acc, name, i) => {
          acc[name] = values[i]
          return acc
        }, {} as any)
      }
      // [ [1, 'name', 1] ]
      const data = values.map((v) => combineObject(columns, v))
      // @ts-ignore
      queryResultData.value = data

      queryTableSchemaData.value = columns.map((col) => ({ rowName: col }))
    }

    const queryTableSchemaData = ref<Record<string, any>[]>([])

    const queryResultData = ref([])

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
                tables: tableNames.map((name) => ({ label: name })),
                schema: tableSchema,
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
              initialValue={'select * from `users` limit 1;'}
              onChange={(e) => {
                sqlQueryText.value = e.doc.toString()
              }}
            />

            <NLayoutContent>
              <NSpace justify="space-between" align="center" class="px-4">
                <NText>Mod+/ quick to run query.</NText>
                <NButtonGroup>
                  <NButton round type="primary" onClick={handleQuery}>
                    查询
                  </NButton>
                </NButtonGroup>
              </NSpace>
            </NLayoutContent>

            <NLayoutContent nativeScrollbar={false} embedded>
              <NDataTable
                bordered={false}
                class="h-full overflow-auto"
                data={queryResultData.value}
                columns={queryTableSchemaData.value.map((schema) => {
                  return { title: schema.rowName, key: schema.rowName }
                })}
              ></NDataTable>
            </NLayoutContent>
          </div>
        </NLayoutContent>
      </NLayout>
    )
  },
})
