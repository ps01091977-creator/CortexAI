import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversations: [],
        selectedConversation: null
    },
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload
        },
        addConversation: (state, action) => {
            state.conversations.unshift(action.payload)
        },
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload
        },
        removeConversation: (state, action) => {
            const conversationId = action.payload
            state.conversations = state.conversations.filter((conv) => conv._id !== conversationId)
            if (state.selectedConversation?._id === conversationId) {
                state.selectedConversation = null
            }
        },
        resetConversations: (state) => {
            state.conversations = []
            state.selectedConversation = null
        },
        setConvTitle: (state, action) => {
            const { title, conversationId } = action.payload
            state.conversations = state.conversations.map((conv) => (
                conv._id === conversationId ? { ...conv, title } : conv
            ))

            if (state.selectedConversation?._id === conversationId) {
                state.selectedConversation = { ...state.selectedConversation, title }
            }
        }
    }
})

export const {
    setConversations,
    addConversation,
    setSelectedConversation,
    removeConversation,
    resetConversations,
    setConvTitle
} = conversationSlice.actions

export default conversationSlice.reducer
