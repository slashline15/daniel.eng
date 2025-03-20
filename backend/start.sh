#!/bin/bash

# Script para iniciar o backend do assistente

# Diretório do script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Verificar se o ambiente virtual existe
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativar o ambiente virtual
source venv/bin/activate

# Instalar dependências
echo "Instalando dependências..."
pip install -r requirements.txt

# Verificar se há variáveis de ambiente para carregar
if [ -f ".env" ]; then
    echo "Carregando variáveis de ambiente..."
    export $(grep -v '^#' .env | xargs)
fi

# Tornar o script de execução executável
chmod +x run.py

# Iniciar o servidor
echo "Iniciando servidor backend..."
python run.py --config config.json