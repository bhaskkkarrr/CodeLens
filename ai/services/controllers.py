from services.retriever import retriever_response

async def ask_question(query):
  response = await retriever_response(query)
  return response