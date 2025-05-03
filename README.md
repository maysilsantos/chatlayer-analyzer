# Chatlayer Analyzer

Projeto desenvolvido com Next.js, Tailwind CSS e shadcn/ui para análise de conversas na Chatlayer.

---

## 🧭 Guia Completo: Criando o Chatlayer Analyzer do Zero

Vamos criar um novo projeto do zero, seguindo cada passo cuidadosamente para garantir que tudo funcione corretamente.

---

## ⚙️ Parte 1: Configuração Inicial do Projeto

### ✅ Passo 1: Criar um Novo Projeto Next.js

```bash
npx create-next-app@latest chatlayer-analyzer-new --typescript --eslint --tailwind --app --use-npm
```

Responda às perguntas da CLI da seguinte forma:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src/ directory: No
App Router: Yes
Import alias: Yes (padrão: @/*)
```

---

### 📁 Passo 2: Navegar para o Diretório do Projeto

```bash
cd chatlayer-analyzer-new
```

---

### 📦 Passo 3: Instalar Dependências Adicionais

```bash
# Garantir que estamos usando React 18
npm install react@18.2.0 react-dom@18.2.0

# Instalar pacotes auxiliares e do shadcn/ui
npm install next-themes sonner @radix-ui/react-label @radix-ui/react-slot \
class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate
```

---

### ⚙️ Passo 4: Inicializar o shadcn/ui

```bash
npx shadcn@latest init
```

Durante a configuração, selecione:

```text
Style: Default
Base color: Slate (ou outro de sua preferência)
Global CSS: app/globals.css
CSS variables: Yes
Radius: 0.5rem
React Server Components: Yes
Tailwind CSS: Yes
Outras configurações: padrão
```

---

### 🧱 Passo 5: Instalar Componentes shadcn/ui

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add card
npx shadcn@latest add label
npx shadcn@latest add sonner
```

---

## 🗂️ Parte 2: Substituir Arquivos e Corrigir Dependências

### 📥 Substituir arquivos pelo zip modificado

Após baixar e descompactar os arquivos modificados, sobrescreva os arquivos do projeto `chatlayer-analyzer-new`.

---

### 🔁 Reinstalar e Corrigir Dependências

```bash
# Limpar build anterior
rm -rf .next

# Remover node_modules e reinstalar tudo
rm -rf node_modules
npm install

# Garantir que dependências essenciais estejam presentes
npm install @radix-ui/react-label @radix-ui/react-slot \
class-variance-authority clsx lucide-react tailwind-merge \
tailwindcss-animate next-themes sonner
```

---

### 🛠️ Corrigir o PostCSS e Tailwind

```bash
# Criar o arquivo se não existir
touch postcss.config.js

# Instalar plugin de desenvolvimento necessário
npm install --save-dev @tailwindcss/postcss
```

---

## 🚀 Executar o Projeto

```bash
npm run dev
```

Acesse em:  
[http://localhost:3000](http://localhost:3000)
