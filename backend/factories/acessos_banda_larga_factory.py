from repositories.acessos_banda_larga_repository import AcessosBandaLargaRepository
from use_cases.acessos_banda_larga_use_case import AcessosBandaLargaUseCase

def acessos_banda_larga_use_case_factory():
    repository = AcessosBandaLargaRepository()
    return AcessosBandaLargaUseCase(repository)
