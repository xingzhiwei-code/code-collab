import { createPeerConnection } from '../../utils/webrtc'

export default {
  namespaced: true,
  state: {
    peerConnection: null,
    dataChannel: null,
    connectedPeers: [],
    connectionStatus: 'disconnected', // 'disconnected', 'connecting', 'connected'
    messages: []
  },
  getters: {
    isPeerConnected: state => state.connectionStatus === 'connected',
    getMessages: state => state.messages
  },
  mutations: {
    SET_PEER_CONNECTION(state, connection) {
      state.peerConnection = connection
    },
    SET_DATA_CHANNEL(state, channel) {
      state.dataChannel = channel
    },
    ADD_CONNECTED_PEER(state, peerId) {
      if (!state.connectedPeers.includes(peerId)) {
        state.connectedPeers.push(peerId)
      }
    },
    REMOVE_CONNECTED_PEER(state, peerId) {
      state.connectedPeers = state.connectedPeers.filter(id => id !== peerId)
    },
    SET_CONNECTION_STATUS(state, status) {
      state.connectionStatus = status
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message)
    }
  },
  actions: {
    async initializePeerConnection({ commit }) {
      try {
        const peerConnection = await createPeerConnection()
        commit('SET_PEER_CONNECTION', peerConnection)
        commit('SET_CONNECTION_STATUS', 'connecting')
        return peerConnection
      } catch (error) {
        console.error('Failed to initialize peer connection:', error)
        throw error
      }
    },
    createDataChannel({ state, commit }, { label = 'data', options = {} } = {}) {
      if (!state.peerConnection) {
        throw new Error('PeerConnection not initialized')
      }
      
      const dataChannel = state.peerConnection.createDataChannel(label, options)
      commit('SET_DATA_CHANNEL', dataChannel)
      return dataChannel
    },
    handleConnectionStateChange({ commit }, status) {
      commit('SET_CONNECTION_STATUS', status)
    },
    addMessage({ commit }, message) {
      commit('ADD_MESSAGE', message)
    }
  }
}