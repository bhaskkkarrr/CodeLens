from fastapi import APIRouter
from models.models import RAGQuestionRequest
from controllers.ask_question import ask_question
ragRouter = APIRouter()

@ragRouter.post('/question')
async def question(data:RAGQuestionRequest):
  response = await ask_question(data.question, data.repo_id, data.user_id)
  return response