import os
import re
import json
import random
from typing import Dict, List, Any, Optional, Tuple
from .api_integration import ApiAssistant


class EnhancedAssistant:
    """
    Assistente aprimorado com suporte para fallback para API externa.
    """
    def __init__(self, api_key: Optional[str] = None, use_api: bool = False):
        # Configuração da integração com a API
        self.use_api = use_api
        self.api_assistant = ApiAssistant(api_key=api_key) if use_api else None
        
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
        
        # Histórico de conversas
        self.conversation_history = []
        
        # Limite de confiança para usar o modelo padrão vs. API
        self.confidence_threshold = 0.7
    
    def detect_intent(self, message: str) -> Tuple[str, float]:
        """
        Detecta a intenção da mensagem do usuário com nível de confiança.
        Retorna uma tupla (intent, confidence)
        """
        message = message.lower()
        
        # Pontuação básica para cada padrão encontrado
        scores = {}
        
        for intent, pattern in self.patterns.items():
            matches = re.findall(pattern, message)
            if matches:
                # Pontuação baseada no número de correspondências e comprimento da mensagem
                score = len(matches) / max(1, len(message.split()))
                scores[intent] = min(score * 2, 1.0)  # Normaliza entre 0 e 1
        
        # Se nenhum padrão for encontrado, retorna default com baixa confiança
        if not scores:
            return ('default', 0.3)
        
        # Retorna a intenção com maior pontuação
        best_intent = max(scores.items(), key=lambda x: x[1])
        return best_intent
    
    def get_response_from_patterns(self, intent: str) -> str:
        """Retorna uma resposta com base na intenção detectada."""
        responses = self.responses.get(intent, self.responses['default'])
        return random.choice(responses)
    
    def process_message(self, message: str) -> str:
        """
        Processa a mensagem do usuário e retorna uma resposta.
        Se habilitado, tenta usar a API externa quando a confiança da detecção for baixa.
        """
        # Armazena a mensagem no histórico
        self.conversation_history.append({'role': 'user', 'message': message})
        
        # Detecta a intenção e confiança
        intent, confidence = self.detect_intent(message)
        
        # Decide entre usar padrões locais ou API
        if self.use_api and confidence < self.confidence_threshold:
            try:
                # Tenta obter resposta da API
                api_result = self.api_assistant.generate_response(message)
                if api_result['success']:
                    response = api_result['response']
                else:
                    # Fallback para padrões locais em caso de erro
                    response = self.get_response_from_patterns(intent)
            except Exception as e:
                # Garantia de fallback em caso de erro
                response = self.get_response_from_patterns(intent)
        else:
            # Usa os padrões locais
            response = self.get_response_from_patterns(intent)
        
        # Armazena a resposta no histórico
        self.conversation_history.append({'role': 'assistant', 'message': response})
        
        return response
    
    def get_conversation_history(self) -> List[Dict[str, str]]:
        """Retorna o histórico da conversa."""
        return self.conversation_history
    
    def clear_history(self) -> None:
        """Limpa o histórico de conversas."""
        self.conversation_history = []


# Exemplo de uso
if __name__ == "__main__":
    # Para testes
    assistant = EnhancedAssistant(use_api=False)
    print(assistant.process_message("Olá, como posso solicitar um orçamento?"))
    print(assistant.process_message("Você trabalha com automação?"))