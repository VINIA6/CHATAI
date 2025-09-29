from flask import jsonify
from factories.analise_acessos_por_uf_factory import analise_acessos_por_uf_use_case_factory

class AnaliseAcessosPorUfController:
    def get_all(self):
        try:
            use_case = analise_acessos_por_uf_use_case_factory()
            result = use_case.get_all()
            
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
