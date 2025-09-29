from flask import jsonify, g
from use_cases.talk_use_case import TalkUseCase
from repositories.talk_repository import TalkRepository
from config.database import db_config
from auth import token_required
from bson import json_util
import json

class TalkController:
    def __init__(self):
        db = db_config.get_database()
        talk_repository = TalkRepository(db)
        self.talk_use_case = TalkUseCase(talk_repository)

    @token_required
    def get_talks_by_user(self):
        try:
            user_id = g.current_user.get('user_id')
            if not user_id:
                return jsonify({'message': 'User ID not found in token'}), 400

            talks = self.talk_use_case.get_talks_by_user_id(user_id)
            
            # Convert ObjectId to string for JSON serialization
            talks_json = json.loads(json_util.dumps(talks))

            return jsonify(talks_json), 200
        except Exception as e:
            return jsonify({'message': f'An error occurred: {str(e)}'}), 500
