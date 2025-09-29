from flask import jsonify
from factories.analise_evolucao_tecnologia_factory import analise_evolucao_tecnologia_use_case_factory

class AnaliseEvolucaoTecnologiaController:
    def get_all(self):
        try:
            use_case = analise_evolucao_tecnologia_use_case_factory()
            result = use_case.get_all()
            
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
