import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../utils/firebase'
import api from '../../utils/axios'

async function logOut() {
try {
    await signOut(auth)
    const {data}=await api.get("/api/auth/logout")
    console.log(data)
} catch (error) {
    console.log(error)
}
}

export default logOut
