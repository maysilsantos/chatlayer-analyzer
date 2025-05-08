# Chatlayer Analyzer

A web application built with **Next.js**, **Tailwind CSS**, and **shadcn/ui** to visualize and analyze conversations from **Chatlayer**.

🔗 **Live version:** [chatlayer-analyzer.vercel.app](https://chatlayer-analyzer.vercel.app/)

---

## 🚀 Getting Started

Follow these steps to create and run the project from scratch.

### 1. Create a New Next.js App

```bash
npx create-next-app@latest chatlayer-analyzer --typescript --eslint --tailwind --app --use-npm
```

```bash
CLI answers:

TypeScript: Yes

ESLint: Yes

Tailwind CSS: Yes

src/ directory: No

App Router: Yes

Import alias: Yes (@/*)
```
### 2. Navigate to the Project

```bash
cd chatlayer-analyzer
```


### 3. Install Required Dependencies
```bash
# Ensure React 18
npm install react@18.2.0 react-dom@18.2.0

# Install UI libraries and utilities
npm install next-themes sonner @radix-ui/react-label @radix-ui/react-slot \
class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate

```

### 4. Initialize shadcn/ui
```bash
npx shadcn@latest init

```
Recommended options:

Style: Default

Base color: Slate

Global CSS path: app/globals.css

Use CSS variables: Yes

Border radius: 0.5rem

React Server Components: Yes

Tailwind CSS: Yes

Other options: Default


### 5. Add UI Components
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add card
npx shadcn@latest add label
npx shadcn@latest add sonner

```

## 🧪 Development
### To run the application locally:
```bash
npm run dev

```
Then open your browser at:
http://localhost:3000

## 📦 Build for Production
```bash
npm run build
npm start

```
