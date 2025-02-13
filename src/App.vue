<script setup>
import Editor from './components/Editor.vue'
import SnippetPanel from './components/SnippetPanel.vue'
import ChatPanel from './components/ChatPanel.vue'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">CodeCollab</h1>
      <p class="app-description">基于WebRTC的实时协作代码编辑器</p>
    </header>
    <main class="app-main">
      <div class="editor-container">
        <Editor />
      </div>
      <div class="side-panel">
        <div class="snippet-container">
          <SnippetPanel />
        </div>
        <div class="chat-container">
          <ChatPanel />
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="less" scoped>
.app-container {
  min-height: 100vh;
  background-color: #111827;
  padding: 1rem;
}

.app-header {
  margin-bottom: 2rem;
  text-align: center;
}

.app-title {
  font-size: 2.25rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.app-description {
  font-size: 1.125rem;
  color: #9ca3af;
}

.app-main {
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  height: calc(100vh - 12rem);
}

.editor-container {
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
}

.side-panel {
  width: 20rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.snippet-container {
  flex: 1;
  overflow-y: auto;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
}

:deep(.cm-editor) {
  background-color: #1f2937;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  height: 100%;
}

:deep(.cm-scroller) {
  height: 100%;
}
</style>