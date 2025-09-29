from repositories.acessos_banda_larga_repository import AcessosBandaLargaRepository

class AcessosBandaLargaUseCase:
    def __init__(self, repository: AcessosBandaLargaRepository):
        self.repository = repository
        
    def get_all(self, page=1, page_size=10):
        return self.repository.get_all(page, page_size)
