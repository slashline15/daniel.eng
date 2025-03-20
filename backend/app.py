import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from assistant import Assistant

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas

# Inicializa o assistente
assistant = Assistant()

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data or 'message' not in data:
            return jsonify({'error': 'Mensagem não fornecida'}), 400
        
        user_message = data['message']
        
        # Processa a mensagem através do assistente
        response = assistant.process_message(user_message)
        
        return jsonify({
            'response': response,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'online', 'message': 'API do assistente está funcionando!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
