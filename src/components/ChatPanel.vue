<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const message = ref('')
const messages = ref([])
let dataChannel = null

const initializeWebRTC = async () => {
  try {
    await store.dispatch('webrtc/initializePeerConnection')
    const channel = await store.dispatch('webrtc/createDataChannel', { label: 'chat' })
    dataChannel = channel
    
    dataChannel.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data)
      if (type === 'chat-message') {
        messages.value.push(data)
      }
    }
  } catch (error) {
    console.error('初始化WebRTC连接失败:', error)
  }
}

const sendMessage = () => {
  if (!message.value.trim() || !dataChannel || dataChannel.readyState !== 'open') return

  const messageData = {
    text: message.value,
    timestamp: new Date().toISOString(),
    sender: 'me'
  }

  messages.value.push(messageData)
  
  if (dataChannel && dataChannel.readyState === 'open') {
    const data = {
      type: 'chat-message',
      data: { ...messageData, sender: 'peer' }
    }
    dataChannel.send(JSON.stringify(data))
  }

  message.value = ''
}

onMounted(() => {
  initializeWebRTC()
})
</script>

<template>
  <div class="chat-panel">
    <div class="messages-container">
      <div v-for="(msg, index) in messages" :key="index" class="message" :class="msg.sender">
        <div class="message-content">
          {{ msg.text }}
        </div>
        <div class="message-time">
          {{ new Date(msg.timestamp).toLocaleTimeString() }}
        </div>
      </div>
    </div>
    <div class="input-container">
      <input
        v-model="message"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="输入消息..."
        class="message-input"
      />
      <button @click="sendMessage" class="send-button">发送</button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.chat-panel {
  background-color: #1f2937;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message {
  max-width: 80%;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  word-break: break-word;

  &.me {
    align-self: flex-end;
    background-color: #2563eb;
    color: #ffffff;

    .message-time {
      text-align: right;
    }
  }

  &.peer {
    align-self: flex-start;
    background-color: #374151;
    color: #ffffff;
  }
}

.message-content {
  margin-bottom: 0.25rem;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #111827;
}

.message-input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: #374151;
  color: #ffffff;
  border: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: 2px solid #2563eb;
    outline-offset: -2px;
  }
}

.send-button {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: #ffffff;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
}
</style>