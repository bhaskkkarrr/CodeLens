print("REPOSITORY ROUTER: START", flush=True)

from fastapi import APIRouter

print("REPOSITORY ROUTER: FASTAPI IMPORTED", flush=True)

from models.models import RepositoryVectorDBRequest

print("REPOSITORY ROUTER: MODEL IMPORTED", flush=True)

from services.load_repo import load

print("REPOSITORY ROUTER: LOAD_REPO IMPORTED", flush=True)

repositoryRouter = APIRouter()

@repositoryRouter.post('/load')
async def load_repo(data: RepositoryVectorDBRequest):
    print("DATA:", data)
    response = await load(
        data.repositoryPath,
        data.repo_id,
        data.user_id
    )
    return response

print("REPOSITORY ROUTER: FINISHED", flush=True)