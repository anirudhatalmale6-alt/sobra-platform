# Sobra — Marketplace de stock excedente

Plataforma leve (React + Vite + Supabase) onde empresas vendem stock excedente,
fim de estação, devoluções e saldos, e os compradores poupam. Mobile-first,
barata de alojar (Supabase + páginas estáticas) e escalável.

## Etapa 1 (atual)
- Contas de empresa (registo + login seguro via Supabase Auth)
- Perfil de empresa
- Publicação de anúncios com fotografias
- Categorias e subcategorias (10 setores)
- Navegação pública, pesquisa e filtros (sem necessidade de conta)

Próximas etapas: limite de 3 anúncios grátis/semana, destaque, painel de
administração, formulário de contacto e pagamentos MB Way / Multibanco (IfthenPay).

## Configuração
1. Criar um projeto no [Supabase](https://supabase.com).
2. No SQL Editor, correr `db/schema.sql` (cria tabelas, categorias, RLS e storage).
3. Preencher `public/config.js` (ou `dist/config.js` no site publicado) com o
   `Project URL` e a chave `anon public` do Supabase.

Sem essas credenciais a aplicação corre em "modo de pré-visualização" com dados
de exemplo, para se poder ver a interface.

## Desenvolvimento
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # produz dist/
npm run preview   # pré-visualiza o build
```

O `base` do Vite está definido para `/sobra-platform/` (GitHub Pages). Para
alojar noutro sítio (domínio próprio / Vercel), use `VITE_BASE=/ npm run build`.
