import { EditorState } from '@codemirror/state'
import clsx from 'clsx'
import { defineComponent, h, PropType, watchEffect } from 'vue'
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
  },
  setup(props) {
    const [refContainer, editorView] = useCodeMirror({
      initialDoc: props.initialValue,
      onChange: props.onChange,
    })

    watchEffect(() => {
      console.log(toRaw(editorView.value))
    })

    return () => (
      <div
        class={clsx(styles['wrapper'], props.className)}
        ref={refContainer}
      />
    )
  },
})
