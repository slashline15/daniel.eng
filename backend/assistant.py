import re
import json
import random
from typing import Dict, List, Optional

class Assistant:
    def __init__(self):
        # Carregar respostas predefinidas
        self.responses = {
            'greeting': [
                "Olá! Que bom falar com você. Como posso ajudar hoje?",
                "Oi! Em que posso ser útil?",
                "Olá! Como posso te auxiliar?"
            ],
            'contact': [
                "Você pode entrar em contato pelo WhatsApp clicando no ícone verde abaixo, ou pelo email daniel.alves66@hotmail.com.",
                "Para contato direto, use o WhatsApp disponível no site ou envie um email para daniel.alves66@hotmail.com."
            ],
            'project': [
                "Para solicitar um orçamento, entre em contato via WhatsApp ou preencha o formulário na seção de contato com detalhes do seu projeto.",
                "Posso ajudar com seu projeto! Basta enviar os detalhes pelo formulário de contato ou pelo WhatsApp."
            ],
            'automation': [
                "Trabalho com soluções de automação e IA para o setor de construção civil. Posso desenvolver sistemas personalizados para aumentar a eficiência do seu negócio.",
                "Especializo-me em automação para construção civil, criando soluções que economizam tempo e recursos."
            ],
            'default': [
                "Ótimo! Como posso te ajudar com isso?",
                "Interessante! Conte-me mais sobre como posso ajudar?",
                "Entendi. Que tipo de assistência específica você está procurando?"
            ]
        }
        
        # Padrões para correspondência de intenções
        self.patterns = {
            'greeting': r'\b(oi|olá|ola|e ai|e aí|hey|hi|hello)\b',
            'contact': r'\b(contato|email|telefone|whatsapp|ligar|chamar|falar)\b',
            'project': r'\b(projeto|orçamento|orcamento|proposta|valor|preço|preco|custo)\b',
            'automation': r'\b(automação|automacao|ia|inteligência|inteligencia|artificial|sistema|software)\b'
        }
        
        # Histórico de conversas (simples para este exemplo)
        self.conversation_history = []
    
    def detect_intent(self, message: str) -> str:
        """Detecta a intenção da mensagem do usuário."""
        message = message.lower()
        
        for intent, pattern in self.patterns.items():
            if re.search(pattern, message):
                return intent
        
        return 'default'
    
    def get_response(self, intent: str) -> str:
        """Retorna uma resposta com base na intenção detectada."""
        responses = self.responses.get(intent, self.responses['default'])
        return random.choice(responses)
    
    def process_message(self, message: str) -> str:
        """Processa a mensagem do usuário e retorna uma resposta."""
        # Armazena a mensagem no histórico
        self.conversation_history.append({'role': 'user', 'message': message})
        
        # Detecta a intenção e gera uma resposta
        intent = self.detect_intent(message)
        response = self.get_response(intent)
        
        # Armazena a resposta no histórico
        self.conversation_history.append({'role': 'assistant', 'message': response})
        
        return response
    
    def get_conversation_history(self) -> List[Dict[str, str]]:
        """Retorna o histórico da conversa."""
        return self.conversation_history
