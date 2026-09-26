print("RAG ROUTER: START", flush=True)

from fastapi import APIRouter

print("RAG ROUTER: FASTAPI IMPORTED", flush=True)

from models.models import RAGQuestionRequest

print("RAG ROUTER: MODEL IMPORTED", flush=True)

from controllers.ask_question import ask_question

print("RAG ROUTER: ASK QUESTION IMPORTED", flush=True)

ragRouter = APIRouter()

@ragRouter.post('/question')
async def question(data: RAGQuestionRequest):
    response = await ask_question(
        data.question,
        data.repo_id,
        data.user_id
    )
    return response

print("RAG ROUTER: FINISHED", flush=True)