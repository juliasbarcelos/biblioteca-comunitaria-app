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
      <View style={styles.card}>
        <Text style={styles.icone}>📚</Text>
        <Text style={styles.titulo}>Biblioteca Comunitária</Text>
        <Text style={styles.subtitulo}>
          Gerencie livros, usuários e empréstimos de forma simples.
        </Text>

        <TouchableOpacity style={styles.botaoAzul} onPress={() => router.push('/livros')}>
          <Text style={styles.textoBotao}>📖 Livros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoVerde} onPress={() => router.push('/usuarios')}>
          <Text style={styles.textoBotao}>👤 Usuários</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoLaranja} onPress={() => router.push('/emprestimos')}>
          <Text style={styles.textoBotao}>🔄 Empréstimos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  icone: {
    fontSize: 44,
    textAlign: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
  },
  botaoAzul: {
    backgroundColor: '#2e86de',
    padding: 15,
    borderRadius: 10,
    marginBottom: 14,
  },
  botaoVerde: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    marginBottom: 14,
  },
  botaoLaranja: {
    backgroundColor: '#d35400',
    padding: 15,
    borderRadius: 10,
  },
  textoBotao: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});