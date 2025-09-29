from flask import Blueprint, jsonify
from controllers.auth_controller import AuthController
from auth import token_required
from config.database import db_config

api_bp = Blueprint('api', __name__)

# Instanciando o controller de autenticação
auth_controller = AuthController()

# Rotas
api_bp.route('/login', methods=['POST'], endpoint='login')(auth_controller.login)

@api_bp.route('/health', methods=['GET'])
def health():
    """Health check da API"""
    try:
        # Testar conexão com MongoDB
        db = db_config.get_database()
        if db is not None:
            db.command('ping')
            return jsonify({
                "status": "healthy",
                "database": "connected",
                "service": "ChatAI API"
            }), 200
        else:
            return jsonify({
                "status": "unhealthy",
                "database": "disconnected",
                "error": "Database connection is None"
            }), 500
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }), 500

# TODO: Implementar endpoints de dados industriais com MongoDB
@api_bp.route('/acessos-banda-larga', methods=['GET'], endpoint='acessos_banda_larga')
@token_required
def get_acessos_banda_larga():
    return jsonify({"message": "Endpoint em desenvolvimento", "data": []})

@api_bp.route('/analise/acessos-por-regiao', methods=['GET'], endpoint='analise_acessos_por_regiao')
@token_required
def get_analise_acessos_por_regiao():
    return jsonify({"message": "Endpoint em desenvolvimento", "data": []})

@api_bp.route('/analise/acessos-por-uf', methods=['GET'], endpoint='analise_acessos_por_uf')
@token_required
def get_analise_acessos_por_uf():
    return jsonify({"message": "Endpoint em desenvolvimento", "data": []})

@api_bp.route('/analise/evolucao-tecnologia', methods=['GET'], endpoint='analise_evolucao_tecnologia')
@token_required
def get_analise_evolucao_tecnologia():
    return jsonify({"message": "Endpoint em desenvolvimento", "data": []})
