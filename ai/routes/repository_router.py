from fastapi import APIRouter
from model.models import RepositoryVectorDBRequest
from services.load_repo import load
repositoryRouter = APIRouter()

@repositoryRouter.post('/load')
async def load_repo(data:RepositoryVectorDBRequest):
  response = await load(data.repositoryPath, data.repo_id)
  return response

