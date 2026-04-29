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
    const lista = listarUsuarios();
    setUsuarios(lista);
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
      Alert.alert('Erro', resultado?.mensagem || 'Não foi possível cadastrar o usuário.');
    }
  }

  function confirmarRemocao(id, nomeUsuario) {
    Alert.alert(
      'Remover usuário',
      `Deseja remover o usuário ${nomeUsuario}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => remover(id),
        },
      ]
    );
  }

  function remover(id) {
    const resultado = excluirUsuario(id);

    if (!resultado?.sucesso) {
      Alert.alert('Não foi possível remover', resultado?.mensagem || 'Erro ao remover usuário.');
      return;
    }

    carregarUsuarios();
    Alert.alert('Sucesso', resultado.mensagem || 'Usuário removido com sucesso.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Usuários</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do usuário"
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
        <Text style={styles.textoBotao}>Salvar Usuário</Text>
      </TouchableOpacity>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.idUsuario}>ID: {item.id}</Text>
            <Text style={styles.nomeUsuario}>{item.nome}</Text>

            <TouchableOpacity
              style={styles.botaoRemover}
              onPress={() => confirmarRemocao(item.id, item.nome)}
            >
              <Text style={styles.textoRemover}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum usuário cadastrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  botaoSalvar: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  idUsuario: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nomeUsuario: {
    fontSize: 16,
    marginBottom: 8,
  },
  botaoRemover: {
    alignSelf: 'flex-start',
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  textoRemover: {
    color: '#fff',
    fontWeight: 'bold',
  },
});