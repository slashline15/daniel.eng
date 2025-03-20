#!/usr/bin/env python3
"""
Script principal para iniciar o backend do assistente.
Carrega a configuração e inicializa o servidor.
"""

import os
import json
import logging
import argparse
from flask import Flask, request, jsonify
from flask_cors import CORS

# Importações locais
from assistant import Assistant
from enhanced_assistant import EnhancedAssistant
from model_integration import create_model_manager_from_config

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('assistant.log')
    ]
)
logger = logging.getLogger('assistant_backend')

def load_config(config_path):
    """Carrega a configuração do arquivo"""
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Erro ao carregar configuração: {e}")
        # Configuração padrão
        return {
            "api": {
                "host": "0.0.0.0",
                "port": 5000,
                "debug": True
            },
            "assistant": {
                "use_api": False,
                "use_local_model": False
            }
        }

def create_app(config):
    """Cria e configura a aplicação Flask"""
    app = Flask(__name__)
    
    # Configuração CORS
    cors_origins = config.get('api', {}).get('cors_origins', ["*"])
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})
    
    # Inicialização do assistente
    assistant_config = config.get('assistant', {})
    use_api = assistant_config.get('use_api', False)
    use_local_model = assistant_config.get('use_local_model', False)
    
    if use_local_model:
        # Inicializa o gerenciador de modelo
        logger.info("Inicializando gerenciador de modelo...")
        model_manager = create_model_manager_from_config('config.json')
        # TODO: Implementar assistente baseado em modelo local
        assistant = Assistant()  # Fallback para assistente básico
    elif use_api:
        # Inicializa o assistente com suporte à API externa
        api_key = os.environ.get('API_KEY')
        logger.info("Inicializando assistente aprimorado com suporte à API...")
        assistant = EnhancedAssistant(api_key=api_key, use_api=True)
    else:
        # Inicializa o assistente básico
        logger.info("Inicializando assistente básico...")
        assistant = Assistant()
    
    # Registra o assistente na aplicação
    app.config['assistant'] = assistant
    
    # Rotas da API
    @app.route('/api/chat', methods=['POST'])
    def chat():
        try:
            data = request.json
            if not data or 'message' not in data:
                return jsonify({'error': 'Mensagem não fornecida'}), 400
            
            user_message = data['message']
            logger.info(f"Mensagem recebida: {user_message}")
            
            # Processa a mensagem através do assistente
            response = app.config['assistant'].process_message(user_message)
            logger.info(f"Resposta enviada: {response}")
            
            return jsonify({
                'response': response,
                'status': 'success'
            })
        except Exception as e:
            logger.error(f"Erro ao processar mensagem: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'online', 
            'message': 'API do assistente está funcionando!'
        })
    
    # Rota para limpar o histórico (útil para testes)
    @app.route('/api/clear_history', methods=['POST'])
    def clear_history():
        try:
            app.config['assistant'].clear_history()
            return jsonify({
                'status': 'success',
                'message': 'Histórico de conversa limpo'
            })
        except Exception as e:
            logger.error(f"Erro ao limpar histórico: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    return app

def main():
    """Função principal para iniciar o servidor"""
    parser = argparse.ArgumentParser(description='Backend do Assistente')
    parser.add_argument('--config', '-c', type=str, default='config.json',
                        help='Caminho para o arquivo de configuração')
    args = parser.parse_args()
    
    # Carrega a configuração
    config = load_config(args.config)
    
    # Cria e configura a aplicação
    app = create_app(config)
    
    # Obtém a configuração da API
    api_config = config.get('api', {})
    host = api_config.get('host', '0.0.0.0')
    port = api_config.get('port', 5000)
    debug = api_config.get('debug', False)
    
    # Inicia o servidor
    logger.info(f"Iniciando servidor em {host}:{port} (debug: {debug})")
    app.run(host=host, port=port, debug=debug)

if __name__ == '__main__':
    main()