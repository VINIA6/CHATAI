from database import get_db_connection, close_db_connection

class AcessosBandaLargaRepository:
    def get_all(self, page=1, page_size=10):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        offset = (page - 1) * page_size
        
        query = "SELECT * FROM acessos_banda_larga_consolidado LIMIT %s OFFSET %s"
        
        try:
            cursor.execute(query, (page_size, offset))
            result = cursor.fetchall()
            
            cursor.execute("SELECT COUNT(*) FROM acessos_banda_larga_consolidado")
            total_records = cursor.fetchone()[0]
            
            return {
                "data": result,
                "total": total_records,
                "page": page,
                "page_size": page_size,
                "total_pages": (total_records + page_size - 1) // page_size
            }
        finally:
            cursor.close()
            close_db_connection(conn)
