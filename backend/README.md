# API do Assistente - Backend

Este é o backend para o assistente de chat do portfólio. Ele fornece uma API REST para processar mensagens de usuários e retornar respostas apropriadas.

## Recursos

- API RESTful baseada em Flask
- Sistema de detecção de intenções baseado em regex
- Integração opcional com APIs externas de IA
- Suporte para histórico de conversas
- CORS habilitado para integração com o frontend

## Configuração

1. Instale as dependências:

```bash
pip install -r requirements.txt
```

2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Inicie o servidor:

```bash
python app.py
```

## Endpoints da API

### POST /api/chat

Recebe mensagens do usuário e retorna respostas do assistente.

**Corpo da requisição:**
```json
{
  "message": "Olá, como posso solicitar um orçamento?"
}
```

**Resposta de sucesso:**
```json
{
  "response": "Para solicitar um orçamento, entre em contato via WhatsApp ou preencha o formulário na seção de contato com detalhes do seu projeto.",
  "status": "success"
}
```

### GET /api/health

Verifica o status da API.

**Resposta:**
```json
{
  "status": "online",
  "message": "API do assistente está funcionando!"
}
```

## Integração com APIs de IA

Para usar uma API externa como OpenAI ou outra solução de IA conversacional:

1. Configure sua chave de API no arquivo `.env`
2. Modifique a classe `Assistant` em `assistant.py` para usar o módulo `api_integration.py`

## Personalização

Adicione novos padrões de detecção de intenções e respostas no arquivo `assistant.py`.
