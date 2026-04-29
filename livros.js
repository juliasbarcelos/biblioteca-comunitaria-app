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
import { excluirLivro, inserirLivro, listarLivros } from '../database';

export default function Livros() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [livros, setLivros] = useState([]);

  function carregarLivros() {
    const dados = listarLivros();
    setLivros(dados);
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

    const resultado = inserirLivro(
      titulo.trim(),
      autor.trim(),
      categoria.trim(),
      qtd
    );

    if (resultado?.sucesso) {
      setTitulo('');
      setAutor('');
      setCategoria('');
      setQuantidade('');
      carregarLivros();
      Alert.alert('Sucesso', 'Livro cadastrado com sucesso.');
    } else {
      Alert.alert('Erro', resultado?.mensagem || 'Não foi possível cadastrar o livro.');
    }
  }

  function remover(id) {
    const resultado = excluirLivro(id);

    if (resultado?.sucesso) {
      carregarLivros();
      Alert.alert('Sucesso', 'Livro excluído com sucesso.');
    } else {
      Alert.alert('Erro', resultado?.mensagem || 'Não foi possível excluir o livro.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Livros</Text>

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
        <Text style={styles.botaoTexto}>Salvar Livro</Text>
      </TouchableOpacity>

      <FlatList
        data={livros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.titulo}</Text>
            <Text>
              {item.autor} | {item.categoria || 'Sem categoria'} | Qtd: {item.quantidade}
            </Text>
            <Text style={item.quantidade > 0 ? styles.disponivel : styles.indisponivel}>
              {item.quantidade > 0 ? 'Disponível' : 'Indisponível'}
            </Text>

            <TouchableOpacity onPress={() => remover(item.id)}>
              <Text style={styles.excluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
  botao: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  item: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 16,
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
  excluir: {
    color: 'red',
    marginTop: 6,
  },
});