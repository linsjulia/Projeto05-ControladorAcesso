// Chain of Responsibility: cada verificador decide se continua ou encerra a cadeia.
export class Verificador {
  setProximo(proximo) { this.proximo = proximo; return proximo; }
  async verificar(dados) {
    if (this.proximo) return this.proximo.verificar(dados);
    return { permitido: false, status: 403, mensagem: 'Acesso negado.' };
  }
}

// 1. Confere se o usuário informou um e-mail.
export class ValidarEntrada extends Verificador {
  async verificar(dados) {
    if (!dados.email || typeof dados.email !== 'string' || !dados.email.trim()) {
      return { permitido: false, status: 400, mensagem: 'Informe seu e-mail para verificar o acesso.' };
    }
    dados.email = dados.email.trim().toLowerCase();
    return super.verificar(dados);
  }
}

// 2. Consulta o banco já utilizado pelo CRUD.
export class VerificarAluno extends Verificador {
  constructor(db) { super(); this.db = db; }
  async verificar(dados) {
    const aluno = await new Promise((resolve, reject) => {
      this.db.get('SELECT id, nome, email FROM pessoas WHERE lower(email) = ?', [dados.email], (err, row) => {
        if (err) reject(err); else resolve(row);
      });
    });
    if (!aluno) return { permitido: false, status: 403, mensagem: 'Acesso negado. E-mail não encontrado no cadastro de alunos da Fatec.' };
    dados.aluno = aluno;
    return super.verificar(dados);
  }
}

// 3. Finaliza a cadeia e concede acesso somente ao cadastro encontrado.
export class ConcederAcesso extends Verificador {
  async verificar(dados) {
    return { permitido: true, status: 200, mensagem: `Acesso permitido. Bem-vindo(a), ${dados.aluno.nome}!`, aluno: dados.aluno };
  }
}

export function criarCadeiaAcesso(db) {
  const entrada = new ValidarEntrada();
  const aluno = new VerificarAluno(db);
  const conceder = new ConcederAcesso();
  entrada.setProximo(aluno).setProximo(conceder);
  return entrada;
}
