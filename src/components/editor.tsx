import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import clsx from 'clsx'
import { defineComponent, h, PropType, Ref, watchEffect } from 'vue'
import { useCodeMirror } from '~/hooks/use-codemirror'
import styles from './editor.module.css'
export const Editor = defineComponent({
  props: {
    initialValue: {
      type: String,
      default: '',
    },
    onChange: {
      type: Function as PropType<(state: EditorState) => void>,
    },
    className: {
      type: String,
    },
    editorRef: {
      type: Object as PropType<Ref<EditorView | undefined>>,
    },
  },
  setup(props) {
    const [refContainer, editorView] = useCodeMirror({
      initialDoc: props.initialValue,
      onChange: props.onChange,
    })

    watchEffect(() => {
      if (props.editorRef && editorView.value) {
        props.editorRef.value = editorView.value
      }
    })

    return () => (
      <div
        class={clsx(styles['wrapper'], props.className)}
        ref={refContainer}
      />
    )
  },
})
