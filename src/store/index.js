import { createStore } from 'vuex'
import webrtc from './modules/webrtc'

export default createStore({
  state: {
    snippets: [],
    currentLanguage: 'javascript',
    selectedSnippet: null
  },
  getters: {
    getSnippets: state => state.snippets,
    getCurrentLanguage: state => state.currentLanguage,
    getSelectedSnippet: state => state.selectedSnippet
  },
  mutations: {
    ADD_SNIPPET(state, snippet) {
      state.snippets.push(snippet)
    },
    REMOVE_SNIPPET(state, snippetId) {
      state.snippets = state.snippets.filter(s => s.id !== snippetId)
    },
    UPDATE_SNIPPET(state, { id, updates }) {
      const index = state.snippets.findIndex(s => s.id === id)
      if (index !== -1) {
        state.snippets[index] = { ...state.snippets[index], ...updates }
      }
    },
    SET_SELECTED_SNIPPET(state, snippetId) {
      state.selectedSnippet = snippetId
    }
  },
  actions: {
    addSnippet({ commit }, snippet) {
      commit('ADD_SNIPPET', snippet)
    },
    removeSnippet({ commit }, snippetId) {
      commit('REMOVE_SNIPPET', snippetId)
    },
    updateSnippet({ commit }, payload) {
      commit('UPDATE_SNIPPET', payload)
    },
    selectSnippet({ commit }, snippetId) {
      commit('SET_SELECTED_SNIPPET', snippetId)
    }
  },
  modules: {
    webrtc
  }
})