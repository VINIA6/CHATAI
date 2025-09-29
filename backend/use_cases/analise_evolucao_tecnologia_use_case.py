from repositories.analise_evolucao_tecnologia_repository import AnaliseEvolucaoTecnologiaRepository

class AnaliseEvolucaoTecnologiaUseCase:
    def __init__(self, repository: AnaliseEvolucaoTecnologiaRepository):
        self.repository = repository
        
    def get_all(self):
        return self.repository.get_all()
