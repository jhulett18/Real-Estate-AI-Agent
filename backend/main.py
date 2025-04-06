from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .agent.real_estate_agent import run_agent

app = FastAPI()

# Optional: allow frontend to call backend if they're on different ports/domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or set to ["http://localhost:3000"] if using Vite/Next
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


# POST endpoint for the chatbot
@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        response = run_agent(req.message)
        return {"reply": response}
    except Exception as e:
        return {"reply": f"Oops! Something went wrong: {e}"}
# @app.post("/api/chat")
# async def chat(req: ChatRequest):
#     response = run_agent(req.message)
#     return {"reply": response}
