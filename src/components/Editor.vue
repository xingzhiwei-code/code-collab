<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { useStore } from 'vuex'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { keymap } from '@codemirror/view'
import { formatCode } from '../utils/formatter'

const store = useStore()
const editorContainer = ref(null)
let editorView = null

const selectedSnippet = computed(() => store.getters.getSelectedSnippet)

watch(selectedSnippet, (newSnippet) => {
  if (newSnippet && editorView) {
    const cursor = editorView.state.selection.main.head
    const transaction = editorView.state.update({
      changes: {
        from: cursor,
        insert: newSnippet.code
      }
    })
    editorView.dispatch(transaction)
    store.dispatch('selectSnippet', null)
  }
})

const formatEditorCode = async () => {
  if (!editorView) {
    console.error('编辑器实例未初始化')
    return
  }
  try {
    const currentCode = editorView.state.doc.toString()
    const formattedCode = await formatCode(currentCode)
    if (formattedCode === currentCode) {
      console.log('代码已经是格式化状态')
      return
    }
    const transaction = editorView.state.update({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: formattedCode
      }
    })
    editorView.dispatch(transaction)
    console.log('代码格式化成功')
  } catch (error) {
    console.error('代码格式化失败:', error)
  }
}

onMounted(() => {
  if (!editorContainer.value) return

  const startState = EditorState.create({
    doc: '// 在这里开始编写代码\n',
    extensions: [
      basicSetup,
      javascript(),
      oneDark,
      EditorView.lineWrapping,
      autocompletion(),
      keymap.of(completionKeymap),
      EditorView.theme({
        '&': {
          height: '100%',
          minHeight: '300px'
        }
      })
    ]
  })

  editorView = new EditorView({
    state: startState,
    parent: editorContainer.value
  })
})
</script>

<template>
  <div class="editor-wrapper">
    <div class="format-button-container">
      <button @click="formatEditorCode" class="format-button">格式化代码</button>
    </div>
    <div class="editor-container" ref="editorContainer"></div>
  </div>
</template>

<style lang="less" scoped>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.format-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.format-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #ffffff;
  background-color: #2563eb;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
}

.editor-container {
  flex: 1;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

:deep(.cm-editor) {
  height: 100%;
  background-color: #1f2937;
  border-radius: 0.5rem;
}

:deep(.cm-scroller) {
  font-family: monospace;
  line-height: 1.5;
  height: 100%;
}

:deep(.cm-content) {
  min-height: 300px;
}
</style>