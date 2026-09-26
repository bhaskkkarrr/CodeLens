from fastapi import APIRouter
from models.models import RepositoryVectorDBRequest
from services.load_repo import load
repositoryRouter = APIRouter()

@repositoryRouter.post('/load')
async def load_repo(data:RepositoryVectorDBRequest):
  print("DATA:\n",data)
  response = await load(data.repositoryPath, data.repo_id, data.user_id)
  return response

