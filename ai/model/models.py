from pydantic import BaseModel, Field
from typing import Optional

class RepositoryVectorDBRequest(BaseModel):
  repositoryPath:str
  repo_id:str

class RAGQuestionRequest(BaseModel):
  question:str  
  repo_id:str

class AI_Response_Structure(BaseModel):
  response:str  
  source:list[str]