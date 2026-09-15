from fastapi import APIRouter
from model.models import query
from services.controllers import ask_question
ragRouter = APIRouter()

@ragRouter.post('/question')
async def question(data:query):
  response = await ask_question(data.question)
  return response