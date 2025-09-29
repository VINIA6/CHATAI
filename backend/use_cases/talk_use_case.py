from repositories.talk_repository import TalkRepository
from typing import List, Dict, Any

class TalkUseCase:
    def __init__(self, talk_repository: TalkRepository):
        self.talk_repository = talk_repository

    def get_talks_by_user_id(self, user_id: str) -> List[Dict[str, Any]]:
        return self.talk_repository.get_talks_by_user_id(user_id)
