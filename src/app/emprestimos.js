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
    setLivros(listarLivros());
    setUsuarios(listarUsuarios());
    setEmprestimos(listarEmprestimos());
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

    const hoje = new Date().toLocaleDateString('pt-BR');
    const resultado = inserirEmprestimo(idLivro, idUsuario, hoje);

    if (resultado?.sucesso) {
      setLivroId('');
      setUsuarioId('');
      carregarDados();
      Alert.alert('Sucesso', 'Empréstimo registrado com sucesso.');
    } else {
      Alert.alert('Erro', resultado?.mensagem || 'Não foi possível registrar.');
    }
  }

  function devolver(id) {
    const resultado = devolverEmprestimo(id);

    if (resultado?.sucesso) {
      carregarDados();
      Alert.alert('Sucesso', 'Livro devolvido com sucesso.');
    } else {
      Alert.alert('Erro', resultado?.mensagem || 'Não foi possível devolver.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>🔄 Empréstimos</Text>
      <Text style={styles.subtitulo}>
        Registre empréstimos e acompanhe devoluções.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Novo empréstimo</Text>

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
          <Text style={styles.textoBotao}>Registrar Empréstimo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>📚 Livros cadastrados</Text>

        {livros.length === 0 ? (
          <Text style={styles.vazio}>Nenhum livro cadastrado.</Text>
        ) : (
          livros.map((livro) => (
            <View key={livro.id} style={styles.linhaInfo}>
              <Text style={styles.infoNome}>{livro.titulo}</Text>
              <Text style={styles.infoTexto}>
                ID: {livro.id} • Disponíveis: {livro.quantidade}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>👤 Usuários cadastrados</Text>

        {usuarios.length === 0 ? (
          <Text style={styles.vazio}>Nenhum usuário cadastrado.</Text>
        ) : (
          usuarios.map((usuario) => (
            <View key={usuario.id} style={styles.linhaInfo}>
              <Text style={styles.infoNome}>{usuario.nome}</Text>
              <Text style={styles.infoTexto}>ID: {usuario.id}</Text>
            </View>
          ))
        )}
      </View>

      <Text style={styles.listaTitulo}>Histórico de empréstimos</Text>

      <FlatList
        data={emprestimos}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum empréstimo registrado.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nomeLivro}>{item.titulo}</Text>
            <Text style={styles.infoTexto}>Usuário: {item.nome}</Text>
            <Text style={styles.infoTexto}>Data: {item.data_emprestimo}</Text>

            <Text
              style={item.devolvido ? styles.statusDevolvido : styles.statusAberto}
            >
              {item.devolvido ? 'Devolvido' : 'Em aberto'}
            </Text>

            {!item.devolvido && (
              <TouchableOpacity
                style={styles.botaoDevolver}
                onPress={() => devolver(item.id)}
              >
                <Text style={styles.textoBotao}>Marcar devolução</Text>
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
    marginBottom: 16,
    elevation: 3,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
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
    backgroundColor: '#d35400',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linhaInfo: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  infoNome: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  infoTexto: {
    color: '#666',
    marginTop: 3,
  },
  listaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  nomeLivro: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusAberto: {
    color: '#d35400',
    marginTop: 8,
    fontWeight: 'bold',
  },
  statusDevolvido: {
    color: 'green',
    marginTop: 8,
    fontWeight: 'bold',
  },
  botaoDevolver: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  vazio: {
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
  },
});