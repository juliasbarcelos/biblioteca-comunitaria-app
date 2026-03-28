import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  devolverEmprestimo,
  inserirEmprestimo,
  listarEmprestimos,
  listarLivros,
  listarUsuarios,
} from '../database';

export default function Emprestimos() {
  const [livroId, setLivroId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [emprestimos, setEmprestimos] = useState([]);
  const [livros, setLivros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  function carregarDados() {
    const livrosCadastrados = listarLivros();
    const usuariosCadastrados = listarUsuarios();
    const emprestimosRegistrados = listarEmprestimos();

    setLivros(livrosCadastrados);
    setUsuarios(usuariosCadastrados);
    setEmprestimos(emprestimosRegistrados);
  }

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  function salvarEmprestimo() {
    if (!livroId.trim() || !usuarioId.trim()) {
      Alert.alert('Atenção', 'Informe o ID do livro e o ID do usuário.');
      return;
    }

    const idLivro = Number(livroId);
    const idUsuario = Number(usuarioId);

    if (isNaN(idLivro) || isNaN(idUsuario)) {
      Alert.alert('Atenção', 'Os IDs devem ser numéricos.');
      return;
    }

    const livroSelecionado = livros.find((livro) => livro.id === idLivro);
    const usuarioSelecionado = usuarios.find((usuario) => usuario.id === idUsuario);

    if (!livroSelecionado) {
      Alert.alert('Erro', 'Livro não encontrado.');
      return;
    }

    if (!usuarioSelecionado) {
      Alert.alert('Erro', 'Usuário não encontrado.');
      return;
    }

    if (livroSelecionado.quantidade <= 0) {
      Alert.alert('Indisponível', 'Este livro não possui exemplares disponíveis.');
      return;
    }

    const hoje = new Date().toLocaleDateString('pt-BR');
    const resultado = inserirEmprestimo(idLivro, idUsuario, hoje);

    if (resultado?.sucesso) {
      setLivroId('');
      setUsuarioId('');
      carregarDados();
      Alert.alert('Sucesso', 'Empréstimo registrado com sucesso.');
    } else {
      Alert.alert('Erro', resultado?.mensagem || 'Não foi possível registrar o empréstimo.');
    }
  }

  function devolver(id) {
    const resultado = devolverEmprestimo(id);

    if (resultado?.sucesso) {
      carregarDados();
      Alert.alert('Sucesso', 'Livro devolvido com sucesso.');
    } else {
      Alert.alert('Erro', resultado?.mensagem || 'Não foi possível registrar a devolução.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Empréstimos</Text>

      <Text style={styles.subtitulo}>Livros cadastrados:</Text>
      {livros.length === 0 ? (
        <Text>Nenhum livro cadastrado.</Text>
      ) : (
        livros.map((livro) => (
          <Text key={livro.id}>
            ID: {livro.id} - {livro.titulo} ({livro.quantidade} disponíveis)
          </Text>
        ))
      )}

      <Text style={styles.subtitulo}>Usuários cadastrados:</Text>
      {usuarios.length === 0 ? (
        <Text>Nenhum usuário cadastrado.</Text>
      ) : (
        usuarios.map((usuario) => (
          <Text key={usuario.id}>
            ID: {usuario.id} - {usuario.nome}
          </Text>
        ))
      )}

      <TextInput
        style={styles.input}
        placeholder="ID do livro"
        value={livroId}
        onChangeText={setLivroId}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="ID do usuário"
        value={usuarioId}
        onChangeText={setUsuarioId}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.botao} onPress={salvarEmprestimo}>
        <Text style={styles.botaoTexto}>Registrar Empréstimo</Text>
      </TouchableOpacity>

      <FlatList
        data={emprestimos}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.titulo}</Text>
            <Text>Usuário: {item.nome}</Text>
            <Text>Data: {item.data_emprestimo}</Text>
            <Text>Status: {item.devolvido ? 'Devolvido' : 'Em aberto'}</Text>

            {!item.devolvido && (
              <TouchableOpacity onPress={() => devolver(item.id)}>
                <Text style={styles.devolver}>Marcar devolução</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitulo: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
  botao: {
    backgroundColor: '#d35400',
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
  devolver: {
    color: 'green',
    marginTop: 6,
    fontWeight: 'bold',
  },
});