from repositories.message_repository import MessageRepository
from typing import List, Dict, Any

class MessageUseCase:
    def __init__(self, message_repository: MessageRepository):
        self.message_repository = message_repository

    def get_messages_by_talk_and_user(self, talk_id: str, user_id: str) -> List[Dict[str, Any]]:
        """
        Retorna mensagens de uma conversa específica para um usuário específico
        """
        return self.message_repository.get_messages_by_talk_and_user(talk_id, user_id)
