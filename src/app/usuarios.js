import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { excluirUsuario, inserirUsuario, listarUsuarios } from '../database';

export default function Usuarios() {
  const [nome, setNome] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  function carregarUsuarios() {
    setUsuarios(listarUsuarios());
  }

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, [])
  );

  function salvar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite o nome do usuário.');
      return;
    }

    const resultado = inserirUsuario(nome.trim());

    if (resultado?.sucesso) {
      setNome('');
      carregarUsuarios();
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso.');
    } else {
      Alert.alert('Erro', resultado?.mensagem || 'Não foi possível cadastrar.');
    }
  }

  function confirmarRemocao(id, nomeUsuario) {
    Alert.alert('Remover usuário', `Deseja remover ${nomeUsuario}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => remover(id) },
    ]);
  }

  function remover(id) {
    const resultado = excluirUsuario(id);

    if (resultado?.sucesso) {
      carregarUsuarios();
      Alert.alert('Sucesso', resultado.mensagem);
    } else {
      Alert.alert('Erro', resultado?.mensagem || 'Não foi possível remover.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>👤 Usuários</Text>
      <Text style={styles.subtitulo}>Cadastre os leitores da biblioteca comunitária.</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Nome do usuário"
          value={nome}
          onChangeText={setNome}
        />

        <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
          <Text style={styles.textoBotao}>Salvar Usuário</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum usuário cadastrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nomeUsuario}>{item.nome}</Text>
            <Text style={styles.idUsuario}>ID: {item.id}</Text>

            <TouchableOpacity
              style={styles.botaoRemover}
              onPress={() => confirmarRemocao(item.id, item.nome)}
            >
              <Text style={styles.textoRemover}>Remover</Text>
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
    padding: 18,
    backgroundColor: '#f4f6f8',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
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
    marginBottom: 12,
  },
  botaoSalvar: {
    backgroundColor: '#27ae60',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  nomeUsuario: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  idUsuario: {
    color: '#777',
    marginTop: 4,
    marginBottom: 10,
  },
  botaoRemover: {
    alignSelf: 'flex-start',
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  textoRemover: {
    color: '#fff',
    fontWeight: 'bold',
  },
  vazio: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});