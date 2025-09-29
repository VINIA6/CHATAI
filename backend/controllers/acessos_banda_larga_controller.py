from flask import jsonify, request
from factories.acessos_banda_larga_factory import acessos_banda_larga_use_case_factory

class AcessosBandaLargaController:
    def get_all(self):
        try:
            page = int(request.args.get('page', 1))
            page_size = int(request.args.get('page_size', 10))
            
            use_case = acessos_banda_larga_use_case_factory()
            result = use_case.get_all(page, page_size)
            
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
