from flask import Flask, jsonify
from routes import api_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/')
    @app.route('/health')
    def health_check():
        return jsonify({"status": "healthy", "service": "ChatAI Backend"}), 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
