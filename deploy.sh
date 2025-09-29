#!/bin/bash

echo "🚀 Preparando deploy do ChatBot FIEC para Vercel..."

# Verificar se estamos no diretório correto
if [ ! -f "vercel.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
cd frontend
npm run clean
cd ..

# Instalar dependências
echo "📦 Instalando dependências..."
cd frontend
npm install

# Executar linting
echo "🔍 Verificando código..."
npm run lint

# Executar build
echo "🏗️ Construindo aplicação..."
npm run build

cd ..

echo "✅ Build concluído com sucesso!"
echo ""
echo "📋 Próximos passos para deploy na Vercel:"
echo ""
echo "1. Via GitHub (Recomendado):"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push"
echo "   - Conecte no vercel.com com GitHub"
echo ""
echo "2. Via Vercel CLI:"
echo "   npm i -g vercel"
echo "   vercel"
echo ""
echo "🌐 URL de exemplo: https://chatbot-fiec.vercel.app"
