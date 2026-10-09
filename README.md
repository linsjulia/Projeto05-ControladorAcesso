# Controle de Acesso Fatec

Projeto didático em Node.js com servidor HTTP nativo, baseado no CRUD/API com SQLite fornecido. O cadastro existente é usado para decidir se o e-mail informado corresponde a um aluno cadastrado.

## Como executar
1. Instale o Node.js (18 ou superior).
2. No terminal, entre na pasta do projeto.
3. Execute `npm install` para instalar a dependência SQLite.
4. Execute `npm start`.
5. Acesse `http://localhost:5000/acesso.html`.

## Chain of Responsibility
A requisição `POST /api/acesso` percorre três verificadores: **ValidarEntrada** verifica se o e-mail foi informado; **VerificarAluno** consulta a tabela `pessoas` do SQLite; **ConcederAcesso** retorna autorização apenas quando existe cadastro correspondente. Qualquer falha encerra a cadeia imediatamente.

## Teste
Cadastre uma pessoa em `/cadastrar.html` e use o mesmo e-mail na tela de acesso. Um e-mail não cadastrado deve receber acesso negado. Para este projeto acadêmico, a tabela original chama-se `pessoas`; ela é tratada como o cadastro de alunos, sem recriar o banco ou remover o CRUD.

> Demonstração acadêmica: em um sistema real, e-mail sozinho não é autenticação segura e o cadastro precisaria ser validado institucionalmente.
