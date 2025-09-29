from flask import jsonify, g, request
from use_cases.message_use_case import MessageUseCase
from repositories.message_repository import MessageRepository
from config.database import db_config
from auth import token_required
from bson import json_util
import json

class MessageController:
    def __init__(self):
        db = db_config.get_database()
        message_repository = MessageRepository(db)
        self.message_use_case = MessageUseCase(message_repository)

    @token_required
    def get_messages_by_talk(self):
        try:
            # Pegar user_id do token JWT
            user_id = g.current_user.get('user_id')
            if not user_id:
                return jsonify({'message': 'User ID not found in token'}), 400

            # Pegar talk_id da query string
            talk_id = request.args.get('talk_id')
            if not talk_id:
                return jsonify({'message': 'talk_id is required as query parameter'}), 400

            # Buscar mensagens
            messages = self.message_use_case.get_messages_by_talk_and_user(talk_id, user_id)
            
            # Convert ObjectId to string for JSON serialization
            messages_json = json.loads(json_util.dumps(messages))

            return jsonify(messages_json), 200
        except Exception as e:
            return jsonify({'message': f'An error occurred: {str(e)}'}), 500
