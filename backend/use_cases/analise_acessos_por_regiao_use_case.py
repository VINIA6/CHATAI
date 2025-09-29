from repositories.analise_acessos_por_regiao_repository import AnaliseAcessosPorRegiaoRepository

class AnaliseAcessosPorRegiaoUseCase:
    def __init__(self, repository: AnaliseAcessosPorRegiaoRepository):
        self.repository = repository
        
    def get_all(self):
        return self.repository.get_all()
