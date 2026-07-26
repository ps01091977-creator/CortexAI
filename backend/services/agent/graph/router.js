import { getModel } from "../config/llmModels.js"
import { agent } from "../controllers/agent.controller.js"

export const router = async (state) => {

  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent
    }
  }

  if(state.file){
if(state.file.mimetype==="application/pdf"){
    return {
      ...state,
      agent:"pdfRag"
    }
  }

    if(state.file.mimetype.startsWith("image/")){
    return {
      ...state,
      agent:"imageAnalyzer"
    }
  }
  }

  


  const llm = await getModel("router")
  if (!llm) {
    const p = (state.prompt || "").toLowerCase();
    let selectedAgent = "chat";
    if (p.includes("code") || p.includes("html") || p.includes("css") || p.includes("js") || p.includes("function") || p.includes("app") || p.includes("website") || p.includes("build")) {
      selectedAgent = "coding";
    } else if (p.includes("search") || p.includes("news") || p.includes("latest") || p.includes("price") || p.includes("who is")) {
      selectedAgent = "search";
    } else if (p.includes("pdf") || p.includes("document")) {
      selectedAgent = "pdf";
    } else if (p.includes("ppt") || p.includes("presentation") || p.includes("slides")) {
      selectedAgent = "ppt";
    } else if (p.includes("image") || p.includes("picture") || p.includes("photo") || p.includes("draw")) {
      selectedAgent = "vision";
    }
    return {
      ...state,
      agent: selectedAgent
    };
  }

  try {
    const routingPrompt = `You are a query router. Your job is to classify the user request into one of the following category names.
Return ONLY the name of the category in lowercase, with no explanation, punctuation, or other text.

Categories:
- "chat" (general conversation, questions, math, explanation, essays, greetings)
- "coding" (writing code, generating apps/webpages/scripts, coding help)
- "pdf" (generating/writing documents, templates, PDFs, resumes)
- "ppt" (generating powerpoint presentations, slide decks, presentations)
- "search" (real-time facts, search web, weather, news, internet search)
- "vision" (image analysis)

User Request: "${state.prompt}"

Category:`;
    const response = await llm.invoke(routingPrompt)
    let selectedAgent = (response.content || "chat").trim().toLowerCase().replace(/['"]/g, "");
    
    const validAgents = ["chat", "coding", "pdf", "ppt", "search", "vision", "pdfRag", "imageAnalyzer"];
    if (!validAgents.includes(selectedAgent)) {
      selectedAgent = "chat";
    }

    return {
      ...state,
      agent: selectedAgent
    }
  } catch (e) {
    console.error("Routing error, falling back to manual regex matching:", e);
    const p = (state.prompt || "").toLowerCase();
    let selectedAgent = "chat";
    if (p.includes("code") || p.includes("html") || p.includes("css") || p.includes("js") || p.includes("function") || p.includes("app") || p.includes("website") || p.includes("build")) {
      selectedAgent = "coding";
    } else if (p.includes("search") || p.includes("news") || p.includes("latest") || p.includes("price") || p.includes("who is")) {
      selectedAgent = "search";
    } else if (p.includes("pdf") || p.includes("document")) {
      selectedAgent = "pdf";
    } else if (p.includes("ppt") || p.includes("presentation") || p.includes("slides")) {
      selectedAgent = "ppt";
    } else if (p.includes("image") || p.includes("picture") || p.includes("photo") || p.includes("draw")) {
      selectedAgent = "vision";
    }
    return {
      ...state,
      agent: selectedAgent
    };
  }



}