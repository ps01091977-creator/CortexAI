import { Check, Copy, ExternalLink, FileX2, X } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
function MessageBubble({ role, content, images }) {
  const isUser = role === "user"
  const [lightBox, setLightBox] = useState(null)
  const [copiedCode, setCopiedCode] = useState("")

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode("")
    }, 2000)
  }


  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`w-fit max-w-[92vw] md:max-w-[72%]
  px-4.5 py-3 rounded-2xl
  break-words overflow-hidden
  leading-relaxed
        ${isUser
          ? "bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white rounded-tr-sm shadow-[0_3px_12px_rgba(99,102,241,0.15)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.22)] transition-all"
          : "bg-white/[0.02] border border-white/[0.04] backdrop-blur-xs text-slate-200 rounded-tl-sm hover:border-white/[0.07] hover:bg-white/[0.03] transition-all duration-300 shadow-md"
        }`}>


        {images.length > 0 && (
          <div className='flex flex-wrap gap-3 mt-4'>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setLightBox(img)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"

              />
            ))}
          </div>
        )}


        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className='text-2xl font-bold mt-5 mb-3'>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className='text-xl font-semibold mt-4 mb-2'>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-lg font-semibold mt-3 mb-2'>{children}</h3>
            ),
            p: ({ children }) => (
              <p className='mb-3 whitespace-pre-wrap break-words'>{children}</p>
            ),
            ul: ({ children }) => (
              <ul className='list-disc pl-5 space-y-1 my-2'>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className='list-decimal pl-5 space-y-1 my-2'>{children}</ol>
            ),
            table: ({ children }) => (
              <div className='overflow-x-auto my-4'>
                <table className='min-w-full border border-white/10'>
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (

              <th className='border border-white/10 bg-white/5 px-3 py-2 text-left'>
                {children}
              </th>

            ),
            td: ({ children }) => (

              <td className='border border-white/10 px-3 py-2'>
                {children}
              </td>

            ),

            a: ({ href, children }) => {
              const text = String(children);
              const isDownload = text.toLowerCase().includes("download");
              if (isDownload) {
                return (
                  <a href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs tracking-wide rounded-xl shadow-[0_2px_8px_rgba(16,185,129,0.3)] hover:opacity-90 active:scale-95 transition-all duration-150 no-underline cursor-pointer"
                  >
                    {children}
                    <ExternalLink size={13} />
                  </a>
                );
              }
              return (
                <a href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline inline-flex items-center gap-1 transition-colors duration-150"
                >
                  {children}
                  <ExternalLink size={14} />
                </a>
              );
            },
            code: ({ className, children }) => {
              const value = String(children).trim()
              

              if (!className) {
                return (
                  <code className='px-1.5 py-0.5 rounded bg-white/10 text-indigo-200'>
                    {value}
                  </code>
                )

              }

              const language = className.replace("language-", "")

              return (
                <div className='my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]'>
                  <div className='flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-4 py-2'>
                    <span className='uppercase text-xs text-slate-400'>
                      {language}
                    </span>
                    <button className='flex items-center gap-1 text-xs' 
                    onClick={() => copyCode(value)}>
                      {
                        copiedCode == value ?
                          <>
                            <Check size={14}/>
                            Copied
                          </> :
                          <><Copy size={14} />Copy</>
                      }
                    </button>
                  </div>


                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: "16px",
                      background: "#0d1117",
                      fontSize: "13px",
                    }}

                  >
                    {value}
                  </SyntaxHighlighter>


                </div>
              )
            },
          img:({src})=>{
            if(!src)return null;
            return (
              <img
                src={src}
                onClick={() => setLightBox(src)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
              />
            )
          }





          }}
        >
          {content}
        </Markdown>



      </div>
      {lightBox &&
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6'>
          <button
            className='absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2'
            onClick={() => setLightBox(null)}
          >
            <X />
          </button>
          <img
            src={lightBox}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"

          />

        </div>}
    </div>
  )
}

export default MessageBubble
