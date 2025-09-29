from database import get_db_connection, close_db_connection

class AnaliseEvolucaoTecnologiaRepository:
    def get_all(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM analise_evolucao_tecnologia_3_anos"
        
        try:
            cursor.execute(query)
            return cursor.fetchall()
        finally:
            cursor.close()
            close_db_connection(conn)
