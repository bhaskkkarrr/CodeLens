from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from dotenv import load_dotenv
load_dotenv()

embedding_model = HuggingFaceEmbeddings(
  model_name = "BAAI/bge-small-en-v1.5"
)

vector_store = Chroma(
  persist_directory='db',
  embedding_function=embedding_model
)

def get_retriever(repo_id):
  print(id)
  retriever = vector_store.as_retriever(
    search_type = 'mmr',
    search_kwargs = {
      'k' : 4,
      'fetch_k': 10,
      'lambda_mult' : 0.5,
      'filter' : {
        'repository_id' : repo_id
      }
    }
  )
  return retriever