import {
  acceptCompletion,
  autocompletion,
  completionKeymap,
  startCompletion,
} from '@codemirror/autocomplete'
import { defaultKeymap } from '@codemirror/commands'
import { commentKeymap } from '@codemirror/comment'
import { highlightActiveLineGutter, lineNumbers } from '@codemirror/gutter'
import { defaultHighlightStyle, HighlightStyle } from '@codemirror/highlight'
import { history, historyKeymap } from '@codemirror/history'
import { MySQL, schemaCompletion, sql } from '@codemirror/lang-sql'
import { indentOnInput } from '@codemirror/language'
import { bracketMatching } from '@codemirror/matchbrackets'
import { Compartment, EditorState } from '@codemirror/state'
import {
  EditorView,
  highlightActiveLine,
  KeyBinding,
  keymap,
} from '@codemirror/view'
import { onMounted, ref, Ref } from 'vue'

export const customTheme = EditorView.theme({
  '&': {
    height: '100%',
  },
  '&:focus': {
    outline: 'none !important',
  },
})
const customKeyMap: KeyBinding[] = [
  {
    key: 'Tab',
    run(target) {
      return acceptCompletion(target)
    },
  },
  {
    key: 'Shift-Space',
    run: startCompletion,
  },
]

const syntaxHighlighting = HighlightStyle.define([])

interface Props {
  initialDoc: string
  onChange?: (state: EditorState) => void
}

export const reconfigureMap = {
  defaultKeymap: new Compartment(),
  historyKeymap: new Compartment(),
  completionKeymap: new Compartment(),
  commentKeymap: new Compartment(),
  customKeyMap: new Compartment(),
  sql: new Compartment(),
  theme: new Compartment(),
}
export const extensions = [
  reconfigureMap.defaultKeymap.of(keymap.of(defaultKeymap)),
  reconfigureMap.historyKeymap.of(keymap.of(historyKeymap)),
  reconfigureMap.customKeyMap.of(keymap.of(customKeyMap)),
  reconfigureMap.completionKeymap.of(keymap.of(completionKeymap)),
  reconfigureMap.commentKeymap.of(keymap.of(commentKeymap)),
  reconfigureMap.sql.of(
    sql({
      dialect: MySQL,
    }),
  ),
  reconfigureMap.theme.of(defaultHighlightStyle),
]

export const useCodeMirror = <T extends Element>(
  props: Props,
): [Ref<T | undefined>, Ref<EditorView | undefined>] => {
  const refContainer = ref<T>()
  const editorView = ref<EditorView>()
  const { onChange } = props

  onMounted(() => {
    if (!refContainer.value) return

    const startState = EditorState.create({
      doc: props.initialDoc,
      extensions: [
        ...extensions,
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),

        highlightActiveLine(),
        autocompletion({
          activateOnTyping: true,
          defaultKeymap: true,
        }),
        schemaCompletion({ dialect: MySQL }),

        syntaxHighlighting,

        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChange && onChange(update.state)
          }
        }),
      ],
    })

    const view = new EditorView({
      state: startState,
      parent: refContainer.value,
    })

    editorView.value = view
  })

  return [refContainer, editorView]
}
