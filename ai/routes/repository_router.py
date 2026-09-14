from fastapi import APIRouter
from model.models import repositoryPathUrl
from services.load_repo import load
repositoryRouter = APIRouter()

@repositoryRouter.post('/load')
async def load_repo(data:repositoryPathUrl):
  response = await load(data.repositoryPath)
  return response

