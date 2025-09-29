from database import get_db_connection, close_db_connection

class AnaliseAcessosPorRegiaoRepository:
    def get_all(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM analise_acessos_por_regiao_ultimo_ano"
        
        try:
            cursor.execute(query)
            return cursor.fetchall()
        finally:
            cursor.close()
            close_db_connection(conn)
