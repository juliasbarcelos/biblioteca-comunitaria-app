import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { initDatabase } from '../database';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sistema da Biblioteca</Text>
      <Text style={styles.subtitulo}>Gerencie livros, usuários e empréstimos</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('/livros')}
      >
        <Text style={styles.textoBotao}>Cadastrar / Listar Livros</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('/usuarios')}
      >
        <Text style={styles.textoBotao}>Cadastrar Usuários</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('/emprestimos')}
      >
        <Text style={styles.textoBotao}>Registrar Empréstimos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  botao: {
    backgroundColor: '#2e86de',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  textoBotao: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});