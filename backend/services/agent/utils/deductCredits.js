import axios from "axios"

export const deductCredits=async (userId,agent)=>{
    try {
       const authServiceUrl = process.env.AUTH_SERVICE || "http://localhost:8001";
       const {data}=await axios.post(`${authServiceUrl}/deduct-credits`,{userId,agent})
       return data
    } catch (error) {
        console.log(error)
        return null
    }
}