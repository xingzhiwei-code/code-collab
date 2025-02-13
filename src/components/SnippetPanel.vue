<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const snippets = computed(() => store.getters.getSnippets)

const addSnippet = () => {
  const newSnippet = {
    id: Date.now(),
    name: '新建片段',
    code: '// 在这里输入代码片段',
    language: store.getters.getCurrentLanguage
  }
  store.dispatch('addSnippet', newSnippet)
}

const removeSnippet = (snippetId) => {
  store.dispatch('removeSnippet', snippetId)
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
          <h3 class="snippet-title">{{ snippet.name }}</h3>
          <button @click="() => removeSnippet(snippet.id)" class="delete-button">删除</button>
        </div>
        <pre class="snippet-code">{{ snippet.code }}</pre>
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
}
</style>