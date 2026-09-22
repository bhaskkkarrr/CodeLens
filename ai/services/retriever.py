from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI
from langchain_openrouter import ChatOpenRouter
from services.get_retriever import get_retriever
from model.models import AI_Response_Structure
from dotenv import load_dotenv
load_dotenv()


llm = ChatOpenRouter(
  model="qwen/qwen-2.5-7b-instruct",
  max_tokens=500,
  temperature=0
)

structured_llm = llm.with_structured_output(AI_Response_Structure)

rag_system_prompt = """
You are CodeLens, a repository code analysis assistant.

Answer the user's question ONLY using the retrieved repository context.

IMPORTANT RULES:

1. The retrieved context is the only source of truth.

2. Do NOT use general programming knowledge to fill missing information.

3. Do NOT invent files, functions, behavior, architecture, or implementation details.

4. If the retrieved context does not contain enough information to answer the question, say:
   "The retrieved context does not contain enough information to determine this."

5. Never claim something exists unless it is shown in the retrieved context.

6. Never invent line numbers.

7. Never invent file paths.

8. For every claim, rely on the actual code shown in the retrieved context.

9. When explaining a flow, follow the actual code:
   route → controller → service → database
   only if those relationships are present in the retrieved context.

10. The source field must contain only file paths that appear in the retrieved context.

Return:

response:
A concise answer based strictly on the retrieved code.

source:
The exact file paths used to answer the question.

Retrieved Repository Context:

{context}
"""

main_prompt = ChatPromptTemplate.from_messages([
  ("system",rag_system_prompt),
  ("human", 
    """
      Question:
      {question}

      Answer the question using only the retrieved context.
    """)
])

def retriever_response(query,repo_id):
  print("Question",query)

  retriever = get_retriever(repo_id)

  if len(query) == 0:
    return {
      "success":False,
      "message":"No query given"
    }
  
  docs = retriever.invoke(query)
  if(len(docs) <= 0):
    return {
      "success":False,
      "message" :"No data found in Vector Database",
      "response" : None
    }
  for i, doc in enumerate(docs):
    print("\n========== DOCUMENT", i + 1, "==========")
    print("SOURCE:", doc.metadata.get("file_path"))
    print("CONTENT:")
    print(doc.page_content[:2000])
  
  context = "\n\n".join(
    [
        f"FILE: {doc.metadata.get('file_path', 'Unknown')}\n"
        f"{doc.page_content}"
        for doc in docs
    ]
)

  final_prompt = main_prompt.invoke({
    'context' : context,
    'question' : query
  })
  print("Retrieved documents:", len(docs))
  print("Context length:", len(context))

  llm_response = llm.invoke(final_prompt)
#   llm_response = {
#     "response": "The retrieved context shows that the authentication flow creates an access token and returns it to the client.",
    
# }

  # llm_response = {"response":"Success"}
  print("LLM", llm_response)
  return {
    "success":True,
    "message":"AI response generated successfully",
    "response":llm_response
  }
