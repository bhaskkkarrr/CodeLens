from pydantic import BaseModel, Field


class RepositoryVectorDBRequest(BaseModel):
  repositoryPath:str
  repo_id:str
  user_id:str

class RAGQuestionRequest(BaseModel):
  question:str  
  repo_id:str
  user_id:str

class AI_Response_Structure(BaseModel):
    answer: str = Field(
        description="The answer to the user's question based on the retrieved repository context."
    )