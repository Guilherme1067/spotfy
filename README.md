# 🎵 Spotify Artists Explorer

Uma aplicação React moderna para explorar artistas, álbuns e músicas do Spotify com uma interface elegante e responsiva.

## ✨ Funcionalidades

- 🎵 **Exploração de Artistas**: Visualize artistas em destaque com informações detalhadas
- 💿 **Discografia Completa**: Acesse álbuns e singles dos artistas
- 🎧 **Top Tracks**: Descubra as músicas mais populares de cada artista
- 🔍 **Busca Inteligente**: Filtre álbuns e músicas por nome
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ⚡ **Performance Otimizada**: Carregamento rápido com React Query
- 🔐 **Autenticação Robusta**: Sistema de autenticação com renovação automática de token
- 🛡️ **Tratamento de Erros**: Interceptors inteligentes para lidar com tokens expirados
- 🧪 **Testes Abrangentes**: Cobertura completa de componentes e funcionalidades

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **React Query (TanStack Query)** - Gerenciamento de estado e cache
- **Axios** - Cliente HTTP com interceptors inteligentes
- **React Router DOM** - Roteamento
- **Lucide React** - Ícones
- **Radix UI** - Componentes acessíveis
- **Vitest** - Framework de testes
- **Testing Library** - Testes de componentes

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/spotify.git
cd spotify
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SPOTFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTFY_SECRET=seu_client_secret_aqui
```

4. **Execute o projeto**
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia o servidor de desenvolvimento

# Build
pnpm build        # Gera build de produção
pnpm preview      # Visualiza o build de produção

# Testes
pnpm test         # Executa os testes
pnpm test:ui      # Interface visual para testes
pnpm test:coverage # Testes com cobertura

# Linting
pnpm lint         # Executa o ESLint
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes de UI reutilizáveis
│   ├── hooks/           # Hooks customizados
│   └── __tests__/       # Testes dos componentes
├── hooks/               # Hooks de dados e API
├── lib/                 # Configurações e utilitários
├── pages/               # Páginas da aplicação
├── types/               # Definições de tipos TypeScript
└── consts/              # Constantes da aplicação
```

## 🎯 Funcionalidades Principais

### 1. **Página de Artistas**
- Grid responsivo de artistas em destaque
- Informações de popularidade com barras visuais
- Navegação para detalhes do artista
- Estados de loading e erro

### 2. **Detalhes do Artista**
- Informações completas do artista
- Sistema de abas (Álbuns / Top Tracks)
- Busca e filtragem de álbuns
- Paginação de resultados

### 3. **Top Tracks**
- Lista das músicas mais populares
- Informações de duração e popularidade
- Busca por nome da música
- Ranking visual

### 4. **Sistema de Autenticação Otimizado**
- Autenticação client credentials
- Renovação automática de token
- Interceptor inteligente para erros 401
- Cache otimizado com React Query

## 🔐 Sistema de Autenticação Avançado

O projeto implementa um sistema robusto de autenticação com:

### **🔄 Renovação Automática de Token**
- **Interceptor Inteligente**: Detecta automaticamente erros 401
- **Renovação Transparente**: Renova o token sem intervenção manual
- **Reexecução Automática**: Refaz a requisição original com o novo token
- **Prevenção de Loops**: Evita loops infinitos com flag de controle

### **⚡ Cache Otimizado**
- **staleTime**: 50 minutos (dados considerados frescos)
- **gcTime**: 1 hora (tempo em cache na memória)
- **Retry Inteligente**: 3 tentativas com delay exponencial
- **Performance**: Reduz requisições desnecessárias

### **🛡️ Tratamento de Erros**
```typescript
// Fluxo automático:
// 1. Requisição com token atual
// 2. Se 401 → Renovação automática
// 3. Reexecução da requisição original
// 4. Usuário não percebe interrupção
```

## 🧪 Sistema de Testes

O projeto inclui testes abrangentes e bem estruturados:

### **📋 Cobertura de Testes**
- **Componentes**: Renderização, interações e estados
- **Hooks**: Lógica de negócio e gerenciamento de estado
- **API**: Interceptors e autenticação
- **Integração**: Fluxos completos de usuário

### **🔍 Testes Implementados**
- **SearchInput**: Testes completos de funcionalidade e UI
- **TopTracks**: Validação de renderização e dados
- **Hooks**: Testes de lógica de API e cache
- **Interceptors**: Validação de renovação automática

### **⚙️ Configuração de Testes**
```bash
# Executar todos os testes
pnpm test

# Executar com interface visual
pnpm test:ui

# Verificar cobertura
pnpm test:coverage

# Executar testes em modo watch
pnpm test:watch
```

## 🎨 Design System

A aplicação utiliza um design system consistente com:

- **Cores**: Paleta escura com gradientes
- **Tipografia**: Hierarquia clara de textos
- **Componentes**: Cards, botões e inputs padronizados
- **Animações**: Transições suaves e feedback visual
- **Responsividade**: Layout adaptativo para todos os dispositivos

## 📱 Responsividade

- **Desktop**: Layout em grid com múltiplas colunas
- **Tablet**: Grid adaptativo com 2-3 colunas
- **Mobile**: Layout em coluna única otimizado para toque

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify
1. Build command: `pnpm build`
2. Publish directory: `dist`
3. Configure as variáveis de ambiente

## 🔧 Otimizações Implementadas

### **⚡ Performance**
- **Cache Inteligente**: React Query com configurações otimizadas
- **Lazy Loading**: Carregamento sob demanda de componentes
- **Bundle Splitting**: Separação automática de código
- **Image Optimization**: Otimização de imagens do Spotify

### **🛡️ Robustez**
- **Error Boundaries**: Tratamento gracioso de erros
- **Loading States**: Estados de carregamento consistentes
- **Retry Logic**: Tentativas automáticas em falhas
- **Offline Support**: Cache local para dados essenciais

### **🔐 Segurança**
- **Token Management**: Gerenciamento seguro de tokens
- **Environment Variables**: Configurações seguras
- **Input Validation**: Validação de entradas do usuário
- **XSS Protection**: Proteção contra ataques XSS

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **📋 Checklist para Contribuições**
- [ ] Testes passando
- [ ] Código seguindo padrões do projeto
- [ ] Documentação atualizada
- [ ] Responsividade testada
- [ ] Performance validada

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - API de dados
- [React Query](https://tanstack.com/query) - Gerenciamento de estado
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Vite](https://vitejs.dev/) - Build tool
- [Testing Library](https://testing-library.com/) - Framework de testes

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma [issue](https://github.com/seu-usuario/spotify-artists-explorer/issues) no repositório.

---

Desenvolvido com ❤️ usando React e TypeScript
