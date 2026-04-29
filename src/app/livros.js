import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  atualizarLivro,
  excluirLivro,
  inserirLivro,
  listarLivros,
} from '../database';

export default function Livros() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [livros, setLivros] = useState([]);
  const [livroEditandoId, setLivroEditandoId] = useState(null);

  function carregarLivros() {
    setLivros(listarLivros());
  }

  useFocusEffect(
    useCallback(() => {
      carregarLivros();
    }, [])
  );

  function salvar() {
    if (!titulo.trim() || !autor.trim() || !quantidade.trim()) {
      Alert.alert('Atenção', 'Preencha título, autor e quantidade.');
      return;
    }

    const qtd = Number(quantidade);

    if (isNaN(qtd) || qtd < 0) {
      Alert.alert('Atenção', 'Informe uma quantidade válida.');
      return;
    }

    let resultado;

    if (livroEditandoId) {
      resultado = atualizarLivro(
        livroEditandoId,
        titulo.trim(),
        autor.trim(),
        categoria.trim(),
        qtd
      );
    } else {
      resultado = inserirLivro(
        titulo.trim(),
        autor.trim(),
        categoria.trim(),
        qtd
      );
    }

    if (resultado?.sucesso) {
      setTitulo('');
      setAutor('');
      setCategoria('');
      setQuantidade('');
      setLivroEditandoId(null);
      carregarLivros();

      Alert.alert(
        'Sucesso',
        livroEditandoId
          ? 'Livro atualizado com sucesso.'
          : 'Livro cadastrado com sucesso.'
      );
    } else {
      Alert.alert('Erro', resultado?.mensagem || 'Erro ao salvar.');
    }
  }

  function editarLivro(livro) {
    setLivroEditandoId(livro.id);
    setTitulo(livro.titulo);
    setAutor(livro.autor);
    setCategoria(livro.categoria || '');
    setQuantidade(String(livro.quantidade));
  }

  function remover(id) {
    const resultado = excluirLivro(id);

    if (resultado?.sucesso) {
      carregarLivros();
      Alert.alert('Sucesso', 'Livro excluído com sucesso.');
    } else {
      Alert.alert('Erro', resultado?.mensagem || 'Erro ao excluir.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📚 Livros</Text>
      <Text style={styles.subtitulo}>Gerencie os livros da biblioteca.</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
        />

        <TextInput
          style={styles.input}
          placeholder="Autor"
          value={autor}
          onChangeText={setAutor}
        />

        <TextInput
          style={styles.input}
          placeholder="Categoria"
          value={categoria}
          onChangeText={setCategoria}
        />

        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.botao} onPress={salvar}>
          <Text style={styles.textoBotao}>
            {livroEditandoId ? 'Atualizar Livro' : 'Salvar Livro'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={livros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.titulo}</Text>
            <Text style={styles.info}>
              {item.autor} • {item.categoria || 'Sem categoria'}
            </Text>

            <Text
              style={
                item.quantidade > 0
                  ? styles.disponivel
                  : styles.indisponivel
              }
            >
              {item.quantidade > 0
                ? `Disponível (${item.quantidade})`
                : 'Indisponível'}
            </Text>

            <View style={styles.botoes}>
              <TouchableOpacity onPress={() => editarLivro(item)}>
                <Text style={styles.editar}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => remover(item.id)}>
                <Text style={styles.excluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#f4f6f8',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#27ae60',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  nome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  info: {
    color: '#777',
    marginTop: 4,
  },
  disponivel: {
    color: 'green',
    marginTop: 6,
    fontWeight: 'bold',
  },
  indisponivel: {
    color: 'red',
    marginTop: 6,
    fontWeight: 'bold',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editar: {
    color: '#2e86de',
    fontWeight: 'bold',
  },
  excluir: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});