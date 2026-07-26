import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'

function MessageList() {
    const {selectedConversation}=useSelector(state=>state.conversation)
    const {messages,isLoading}=useSelector(state=>state.message)
    const bottemRef=useRef(null)
   
   useEffect(()=>{
       requestAnimationFrame(()=>{
        bottemRef?.current?.scrollIntoView({
          behavior:"smooth",
          block:"end"
        })
       })
   },[messages?.length,isLoading])


  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-gradient-to-b from-[#090b10] to-[#0e1017]'>
      
      {messages.length==0 || !selectedConversation ?(
        <div className="h-full flex flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in-95 duration-500">
           <div className='flex flex-col gap-3 items-center'>
               <h1 className='text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-500 bg-clip-text text-transparent tracking-tight'>CortexAI</h1>
               <p className='text-md md:text-lg font-semibold text-slate-300 tracking-tight'>What will we create today?</p>
               <p className='text-[13px] text-slate-500 max-w-[340px] leading-relaxed'>
                 An intelligent, orchestrating AI assistant powered by advanced agents for Chat, Coding, PDF, PPT, and Vision.
               </p>
           </div>
           <div className='flex flex-wrap justify-center gap-2 max-w-[480px] mt-2'>
            {["Write a Netflix clone", "Explain Redis database", "Generate PDF about AI future", "Build a presentation slide"].map((s)=>(
              <button key={s} className='text-[12.5px] font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/30 px-4 py-2 rounded-xl hover:bg-white/[0.07] hover:text-slate-100 hover:shadow-[0_2px_10px_rgba(99,102,241,0.08)] transition-all duration-200 cursor-pointer'>
                {s}
              </button>
            ))}
           </div>
        </div>
      ):
      <div className='space-y-5'>

        {messages?.map((msg,i)=>(
            <div key={msg?._id || i}>
               <MessageBubble role={msg?.role} content={msg?.content} images={msg.images || []} /> 
            </div>
        ))}

        {isLoading && <LoadingAnimation/>}

        
      </div>
      }
      <div ref={bottemRef}/>
    </div>
  )
}

export default MessageList
