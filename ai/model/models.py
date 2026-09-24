from pydantic import BaseModel, Field
from typing import Optional

class RepositoryVectorDBRequest(BaseModel):
  repositoryPath:str
  repo_id:str
  user_id:str

class RAGQuestionRequest(BaseModel):
  question:str  
  repo_id:str
  user_id:str

  
class AI_Response_Structure(BaseModel):
    response: str = Field(
        description="The answer to the user's question based on the retrieved repository context."
    )

    source: Optional[list[str]] = None