from bson import ObjectId
from pymongo.database import Database
from typing import List, Dict, Any, Optional

class TalkRepository:
    def __init__(self, db: Database):
        self.db = db
        self.collection = db.get_collection('talk')

    def get_talks_by_user_id(self, user_id: str) -> List[Dict[str, Any]]:
        return list(self.collection.find({'user_id': ObjectId(user_id), 'is_deleted': False}))

    def get_by_id(self, talk_id: str) -> Optional[Dict[str, Any]]:
        return self.collection.find_one({'_id': ObjectId(talk_id), 'is_deleted': False})

    def create(self, talk_data: Dict[str, Any]) -> Dict[str, Any]:
        result = self.collection.insert_one(talk_data)
        talk_data['_id'] = result.inserted_id
        return talk_data

    def update(self, talk_id: str, talk_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        self.collection.update_one({'_id': ObjectId(talk_id)}, {'$set': talk_data})
        return self.get_by_id(talk_id)

    def delete(self, talk_id: str) -> bool:
        result = self.collection.update_one({'_id': ObjectId(talk_id)}, {'$set': {'is_deleted': True}})
        return result.modified_count > 0
