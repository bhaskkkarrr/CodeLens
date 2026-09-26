from services.get_answer import get_answer

async def ask_question(query,repo_id,user_id):
  try:
    response = get_answer(query,repo_id,user_id)
    return response
  except Exception as e:
        print("ERROR:", repr(e))

        return {
            "success": False,
            "message": str(e)
        }
    