import os
import requests
import json
from typing import Dict, Any, Optional

class ApiAssistant:
    def __init__(self, api_key: Optional[str] = None):
        # Carregar API key do ambiente ou usar o valor fornecido
        self.api_key = api_key or os.environ.get('API_KEY')
        self.api_url = os.environ.get('API_URL', 'https://api.example.com/v1/chat')
        
        if not self.api_key:
            print("AVISO: API_KEY não configurada. Configure-a no ambiente ou passe-a como parâmetro.")
    
    def generate_response(self, message: str) -> Dict[str, Any]:
        """Envia a mensagem para a API externa e retorna a resposta."""
        if not self.api_key:
            return {
                'success': False,
                'response': "API não configurada. Por favor, configure uma chave de API.",
                'error': "API_KEY não configurada"
            }
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'message': message,
            'max_tokens': 150,
            'temperature': 0.7
        }
        
        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            response.raise_for_status()  # Lança exceção para erros HTTP
            
            data = response.json()
            return {
                'success': True,
                'response': data.get('response', 'Sem resposta da API'),
                'raw_data': data
            }
            
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'response': "Desculpe, não consegui processar sua solicitação agora.",
                'error': str(e)
            }
        except json.JSONDecodeError:
            return {
                'success': False,
                'response': "Recebi uma resposta inválida do servidor.",
                'error': "JSONDecodeError"
            }

# Exemplo de uso
if __name__ == "__main__":
    # Para teste, você pode definir a chave aqui
    assistant = ApiAssistant(api_key="sua_chave_de_teste")
    result = assistant.generate_response("Olá! Como você pode me ajudar com automação?")
    print(result)
