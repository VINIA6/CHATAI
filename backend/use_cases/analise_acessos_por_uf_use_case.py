from repositories.analise_acessos_por_uf_repository import AnaliseAcessosPorUfRepository

class AnaliseAcessosPorUfUseCase:
    def __init__(self, repository: AnaliseAcessosPorUfRepository):
        self.repository = repository
        
    def get_all(self):
        return self.repository.get_all()
