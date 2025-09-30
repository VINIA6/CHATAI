#!/usr/bin/env python3
"""
Servidor HTTP simples para upload do arquivo
"""

import http.server
import socketserver
import os
import webbrowser
import threading
import time

PORT = 8080

class UploadHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            html = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Upload ChatAI Backend</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 50px; background: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #333; text-align: center; }
                    .upload-area { border: 2px dashed #007bff; padding: 40px; text-align: center; margin: 20px 0; border-radius: 10px; background: #f8f9fa; }
                    input[type="file"] { margin: 20px; padding: 10px; }
                    button { padding: 15px 30px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
                    button:hover { background: #0056b3; }
                    .status { margin: 20px 0; padding: 15px; border-radius: 5px; }
                    .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                    .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
                    .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 Upload ChatAI Backend</h1>
                    <div class="upload-area">
                        <p>📁 Selecione o arquivo <strong>chatai-backend.tar.gz</strong></p>
                        <input type="file" id="fileInput" accept=".tar.gz">
                        <br>
                        <button onclick="uploadFile()">📤 Fazer Upload</button>
                    </div>
                    <div id="status"></div>
                    <div class="info">
                        <h3>📋 Instruções para o servidor Hostinger:</h3>
                        <p>1. Após o upload, use este comando no terminal do navegador:</p>
                        <code>wget http://SEU_IP:8080/download/chatai-backend.tar.gz</code>
                        <p>2. Substitua <strong>SEU_IP</strong> pelo IP da sua máquina local</p>
                        <p>3. Seu IP atual: <strong id="currentIP"></strong></p>
                    </div>
                </div>
                
                <script>
                    // Mostrar IP atual
                    fetch('/ip').then(r => r.text()).then(ip => {
                        document.getElementById('currentIP').textContent = ip;
                    });
                    
                    function uploadFile() {
                        const fileInput = document.getElementById('fileInput');
                        const file = fileInput.files[0];
                        
                        if (!file) {
                            showStatus('Selecione um arquivo!', 'error');
                            return;
                        }
                        
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        showStatus('📤 Fazendo upload...', 'info');
                        
                        fetch('/upload', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.text())
                        .then(data => {
                            showStatus('✅ ' + data, 'success');
                        })
                        .catch(error => {
                            showStatus('❌ Erro: ' + error, 'error');
                        });
                    }
                    
                    function showStatus(message, type) {
                        const status = document.getElementById('status');
                        status.innerHTML = '<div class="' + type + '">' + message + '</div>';
                    }
                </script>
            </body>
            </html>
            """
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
        elif self.path == '/ip':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(self.client_address[0].encode())
        elif self.path.startswith('/download/'):
            filename = self.path[10:]  # Remove '/download/'
            if filename == 'chatai-backend.tar.gz' and os.path.exists(filename):
                self.send_response(200)
                self.send_header('Content-type', 'application/gzip')
                self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
                self.end_headers()
                with open(filename, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/upload':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Salvar arquivo
            with open('chatai-backend.tar.gz', 'wb') as f:
                f.write(post_data)
            
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Upload realizado com sucesso! Arquivo salvo como chatai-backend.tar.gz')
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    print("🚀 Servidor de upload iniciado!")
    print("📁 Acesse: http://localhost:8080")
    print("📤 Faça upload do arquivo chatai-backend.tar.gz")
    print("🌐 Depois use o IP mostrado na página para baixar no servidor")
    
    with socketserver.TCPServer(("", PORT), UploadHandler) as httpd:
        try:
            webbrowser.open(f"http://localhost:{PORT}")
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor parado")
