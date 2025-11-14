## Objetivo
Voltar o projeto ao estado anterior à criação e integração do "studio-main", removendo esse app Next.js e deixando o back-end e o front já existentes intactos.

## Escopo do Revert
- Remover completamente a pasta `studio-main/` criada recentemente.
- Não alterar o back-end Express/TypeScript atual (rotas, seed, middleware, etc.).
- Não alterar o front existente que você já usa (público em `public/`) e o app `frontend/` caso você queira mantê-lo.
- Opcional: Se desejar também desfazer a exigência de `ADMIN_REGISTER_TOKEN` no cadastro do admin, eu removo essa validação — por padrão vou manter (mais seguro) até você indicar.

## Passos
1. Parar qualquer servidor do `studio-main` (se ativo).
2. Excluir a pasta `studio-main/` inteira.
3. Garantir que o back-end continua rodando normalmente (`npm run dev`) e responde em `http://localhost:3000/health`.
4. Verificar que nenhuma referência ao `studio-main` permanece no workspace.
5. (Opcional) Se solicitado, remover a exigência de token secreto do admin no cadastro.

## Verificação
- Testar rotas do back-end (auth, produtos, histórico) para confirmar funcionamento.
- Confirmar que o front desejado (o seu existente ou `frontend/`) permanece inalterado.

Confirma que posso aplicar esse revert agora (remover apenas `studio-main/` e manter o restante)?