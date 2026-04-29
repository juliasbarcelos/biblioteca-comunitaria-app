import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('biblioteca.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      categoria TEXT,
      quantidade INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS emprestimos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      livro_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      data_emprestimo TEXT NOT NULL,
      devolvido INTEGER NOT NULL DEFAULT 0
    );
  `);
}

export function inserirLivro(titulo, autor, categoria, quantidade) {
  try {
    db.runSync(
      'INSERT INTO livros (titulo, autor, categoria, quantidade) VALUES (?, ?, ?, ?)',
      [titulo, autor, categoria, quantidade]
    );

    return {
      sucesso: true,
      mensagem: 'Livro cadastrado com sucesso.',
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: 'Erro ao cadastrar livro.',
    };
  }
}

export function listarLivros() {
  return db.getAllSync('SELECT * FROM livros ORDER BY titulo');
}

export function excluirLivro(id) {
  try {
    const emprestimoAberto = db.getFirstSync(
      'SELECT COUNT(*) as total FROM emprestimos WHERE livro_id = ? AND devolvido = 0',
      [id]
    );

    if (emprestimoAberto.total > 0) {
      return {
        sucesso: false,
        mensagem: 'Este livro possui empréstimo em aberto e não pode ser removido.',
      };
    }

    db.runSync('DELETE FROM livros WHERE id = ?', [id]);

    return {
      sucesso: true,
      mensagem: 'Livro removido com sucesso.',
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: 'Erro ao excluir livro.',
    };
  }
}

export function inserirUsuario(nome) {
  try {
    db.runSync('INSERT INTO usuarios (nome) VALUES (?)', [nome]);

    return {
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso.',
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: 'Erro ao cadastrar usuário.',
    };
  }
}

export function listarUsuarios() {
  return db.getAllSync('SELECT * FROM usuarios ORDER BY nome');
}

export function usuarioTemEmprestimoAberto(id) {
  const resultado = db.getFirstSync(
    'SELECT COUNT(*) as total FROM emprestimos WHERE usuario_id = ? AND devolvido = 0',
    [id]
  );

  return resultado.total > 0;
}

export function excluirUsuario(id) {
  try {
    const temEmprestimo = usuarioTemEmprestimoAberto(id);

    if (temEmprestimo) {
      return {
        sucesso: false,
        mensagem: 'Este usuário possui empréstimo em aberto e não pode ser removido.',
      };
    }

    db.runSync('DELETE FROM usuarios WHERE id = ?', [id]);

    return {
      sucesso: true,
      mensagem: 'Usuário removido com sucesso.',
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: 'Erro ao excluir usuário.',
    };
  }
}

export function inserirEmprestimo(livroId, usuarioId, dataEmprestimo) {
  try {
    const livro = db.getFirstSync('SELECT * FROM livros WHERE id = ?', [livroId]);

    if (!livro) {
      return {
        sucesso: false,
        mensagem: 'Livro não encontrado.',
      };
    }

    const usuario = db.getFirstSync('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);

    if (!usuario) {
      return {
        sucesso: false,
        mensagem: 'Usuário não encontrado.',
      };
    }

    if (livro.quantidade <= 0) {
      return {
        sucesso: false,
        mensagem: 'Este livro não possui exemplares disponíveis.',
      };
    }

    db.runSync(
      'INSERT INTO emprestimos (livro_id, usuario_id, data_emprestimo, devolvido) VALUES (?, ?, ?, 0)',
      [livroId, usuarioId, dataEmprestimo]
    );

    db.runSync(
      'UPDATE livros SET quantidade = quantidade - 1 WHERE id = ?',
      [livroId]
    );

    return {
      sucesso: true,
      mensagem: 'Empréstimo registrado com sucesso.',
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: 'Erro ao registrar empréstimo.',
    };
  }
}

export function listarEmprestimos() {
  return db.getAllSync(`
    SELECT e.id, e.livro_id, e.usuario_id, l.titulo, u.nome, e.data_emprestimo, e.devolvido
    FROM emprestimos e
    INNER JOIN livros l ON l.id = e.livro_id
    INNER JOIN usuarios u ON u.id = e.usuario_id
    ORDER BY e.id DESC
  `);
}

export function devolverEmprestimo(id) {
  try {
    const emprestimo = db.getFirstSync(
      'SELECT * FROM emprestimos WHERE id = ?',
      [id]
    );

    if (!emprestimo) {
      return {
        sucesso: false,
        mensagem: 'Empréstimo não encontrado.',
      };
    }

    if (emprestimo.devolvido === 1) {
      return {
        sucesso: false,
        mensagem: 'Este empréstimo já foi devolvido.',
      };
    }

    db.runSync(
      'UPDATE emprestimos SET devolvido = 1 WHERE id = ?',
      [id]
    );

    db.runSync(
      'UPDATE livros SET quantidade = quantidade + 1 WHERE id = ?',
      [emprestimo.livro_id]
    );

    return {
      sucesso: true,
      mensagem: 'Devolução registrada com sucesso.',
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: 'Erro ao registrar devolução.',
    };
  }
}