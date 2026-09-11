from fastapi import APIRouter
from model.models import repositoryPathUrl

repositoryRouter = APIRouter()

@repositoryRouter.post('/load_repo')
async def load_repo(repositoryPath:repositoryPathUrl):
  response = await load_repo(repositoryPath)
  return response