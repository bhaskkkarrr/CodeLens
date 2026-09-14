from pydantic import BaseModel, Field
from typing import Optional

class repositoryPathUrl(BaseModel):
  repositoryPath:str

class query(BaseModel):
  question:str  