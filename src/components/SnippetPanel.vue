<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const snippets = computed(() => store.getters.getSnippets)
const editingSnippet = ref(null)

const insertSnippet = (snippet) => {
  store.dispatch('selectSnippet', snippet)
}

const addSnippet = () => {
  const newSnippet = {
    id: Date.now(),
    name: '新建片段',
    code: '// 在这里输入代码片段',
    language: store.getters.getCurrentLanguage
  }
  store.dispatch('addSnippet', newSnippet)
  editingSnippet.value = newSnippet.id
}

const removeSnippet = (snippetId) => {
  store.dispatch('removeSnippet', snippetId)
}

const updateSnippet = (snippet) => {
  store.dispatch('updateSnippet', {
    id: snippet.id,
    updates: {
      name: snippet.name,
      code: snippet.code
    }
  })
}

const startEditing = (snippetId) => {
  editingSnippet.value = snippetId
}

const stopEditing = (snippet) => {
  editingSnippet.value = null
  updateSnippet(snippet)
}
</script>

<template>
  <div class="snippets-panel">
    <div class="header">
      <h2 class="title">代码片段</h2>
      <button @click="addSnippet" class="add-button">添加片段</button>
    </div>
    <div class="snippets-list">
      <div v-for="snippet in snippets" :key="snippet.id" class="snippet-item">
        <div class="snippet-header">
          <input
            v-if="editingSnippet === snippet.id"
            v-model="snippet.name"
            class="snippet-title-input"
            @blur="stopEditing(snippet)"
            @keyup.enter="stopEditing(snippet)"
          >
          <h3 v-else class="snippet-title" @click="startEditing(snippet.id)">{{ snippet.name }}</h3>
          <div class="snippet-actions">
            <button @click="() => insertSnippet(snippet)" class="insert-button">插入</button>
            <button @click="() => removeSnippet(snippet.id)" class="delete-button">删除</button>
          </div>
        </div>
        <textarea
          v-if="editingSnippet === snippet.id"
          v-model="snippet.code"
          class="snippet-code-input"
          @blur="stopEditing(snippet)"
        ></textarea>
        <pre v-else class="snippet-code" @click="startEditing(snippet.id)">{{ snippet.code }}</pre>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.snippets-panel {
  width: 100%;
  max-width: 24rem;
  background-color: #1f2937;
  padding: 1rem;
  border-radius: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #ffffff;
}

.add-button {
  padding: 0.25rem 0.75rem;
  background-color: #2563eb;
  color: #ffffff;
  border-radius: 0.25rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
}

.snippets-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.snippet-item {
  background-color: #374151;
  padding: 0.75rem;
  border-radius: 0.375rem;
}

.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.snippet-title {
  color: #ffffff;
  font-weight: 500;
}

.snippet-actions {
  display: flex;
  gap: 0.5rem;
}

.insert-button {
  color: #34d399;
  transition: color 0.2s;

  &:hover {
    color: #10b981;
  }
}

.delete-button {
  color: #f87171;
  transition: color 0.2s;

  &:hover {
    color: #ef4444;
  }
}

.snippet-code {
  font-size: 0.875rem;
  color: #d1d5db;
  background-color: #111827;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.snippet-title-input {
  background-color: #111827;
  border: 1px solid #374151;
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  margin-right: 0.5rem;
}

.snippet-code-input {
  width: 100%;
  min-height: 100px;
  font-family: monospace;
  font-size: 0.875rem;
  color: #d1d5db;
  background-color: #111827;
  padding: 0.5rem;
  border: 1px solid #374151;
  border-radius: 0.25rem;
  resize: vertical;
}

.snippet-title {
  cursor: pointer;
}
</style>