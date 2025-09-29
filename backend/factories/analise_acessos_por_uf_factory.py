from repositories.analise_acessos_por_uf_repository import AnaliseAcessosPorUfRepository
from use_cases.analise_acessos_por_uf_use_case import AnaliseAcessosPorUfUseCase

def analise_acessos_por_uf_use_case_factory():
    repository = AnaliseAcessosPorUfRepository()
    return AnaliseAcessosPorUfUseCase(repository)
