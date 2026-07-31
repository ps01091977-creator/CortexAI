import axios from "axios"

export const getMessages=async (conversationId)=>{
    try {
       const chatServiceUrl = process.env.CHAT_SERVICE || "http://localhost:8002";
       const {data}=await axios.get(`${chatServiceUrl}/get-messages/${conversationId}`)
       return data
    } catch (error) {
        console.log(error)
        return null
    }
}