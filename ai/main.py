from fastapi import FastAPI
from routes.repository_routes import repositoryRouter

app = FastAPI()

app.include_router(
    repositoryRouter,
    prefix='/repository'
)

@app.get("/")
async def root():
    return {"status": "AI service running"}