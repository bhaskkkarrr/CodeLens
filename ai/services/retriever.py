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
  model="openai/gpt-4o-mini",
  max_tokens=700,
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


11. The answer you will give should be in detailed and fully explained do not give just one word or a one sentence answer one word answer is only allowed when there is nothing relevanty to tell the user otherwise it should be in detail 

12. Do not use tables or any kind of decorated texts, only give me simple text.

13. You can only use bullets or pointer and bold or  italics text decoraters.

14. Generate a text that can be parsed in JSON format
Return:

response:
Return a clear and sufficiently detailed answer based strictly on the retrieved context.


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

def retriever_response(query,repo_id,user_id):
  print("Question",query)

  retriever = get_retriever(repo_id,user_id)

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
  for i, doc in enumerate(docs, 1):
    print(f"\nDOCUMENT {i}")
    print("SOURCE:", doc.metadata.get("file_path"))
  
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
  sources = []

  for doc in docs:
     source = doc.metadata.get('file_path')

     if source and source not in sources:
        sources.append(source)

  try:

        llm_response = structured_llm.invoke(final_prompt)

        # answer = llm_response.content
        answer = llm_response.answer
        print("LLM ANSWER:")
        print(llm_response)

        return {
            "success": True,
            "message": "AI response generated successfully",
            "answer": answer,
            "source": sources
        }

  except Exception as error:

        print("LLM ERROR:", repr(error))

        return {
            "success": False,
            "message": "LLM failed to generate response",
            "answer": None,
            "source": sources
        }
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
