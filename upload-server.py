#!/usr/bin/env python3
"""
Servidor HTTP simples para fazer upload do arquivo para o servidor Hostinger
Execute este script na sua máquina local e depois acesse via navegador
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configurações
PORT = 8080
UPLOAD_DIR = "uploads"

# Criar diretório de upload
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UploadHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/upload':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Salvar arquivo
            with open(f"{UPLOAD_DIR}/chatai-backend.tar.gz", "wb") as f:
                f.write(post_data)
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'Upload realizado com sucesso!')
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_GET(self):
        if self.path == '/':
            # Página de upload
            html = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Upload ChatAI Backend</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 50px; }
                    .upload-area { border: 2px dashed #ccc; padding: 20px; text-align: center; }
                    input[type="file"] { margin: 10px; }
                    button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
                </style>
            </head>
            <body>
                <h1>Upload do ChatAI Backend</h1>
                <div class="upload-area">
                    <p>Selecione o arquivo chatai-backend.tar.gz</p>
                    <input type="file" id="fileInput" accept=".tar.gz">
                    <br>
                    <button onclick="uploadFile()">Fazer Upload</button>
                </div>
                <div id="status"></div>
                
                <script>
                    function uploadFile() {
                        const fileInput = document.getElementById('fileInput');
                        const file = fileInput.files[0];
                        
                        if (!file) {
                            alert('Selecione um arquivo!');
                            return;
                        }
                        
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        fetch('/upload', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.text())
                        .then(data => {
                            document.getElementById('status').innerHTML = '<p style="color: green;">' + data + '</p>';
                        })
                        .catch(error => {
                            document.getElementById('status').innerHTML = '<p style="color: red;">Erro: ' + error + '</p>';
                        });
                    }
                </script>
            </body>
            </html>
            """
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
        else:
            super().do_GET()

if __name__ == "__main__":
    print(f"🚀 Servidor de upload iniciado na porta {PORT}")
    print(f"📁 Acesse: http://localhost:{PORT}")
    print("📤 Faça upload do arquivo chatai-backend.tar.gz")
    
    with socketserver.TCPServer(("", PORT), UploadHandler) as httpd:
        try:
            webbrowser.open(f"http://localhost:{PORT}")
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor parado")
