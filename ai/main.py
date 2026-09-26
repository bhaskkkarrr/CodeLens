from fastapi import FastAPI
from routers.repository_router import repositoryRouter
from routers.rag_router import ragRouter

app = FastAPI()

app.include_router(
    repositoryRouter,
    prefix="/ai/repository"
)

app.include_router(
    ragRouter,
    prefix="/ai/rag"
)

@app.get("/")
async def root():
    return {"status": "AI service running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
