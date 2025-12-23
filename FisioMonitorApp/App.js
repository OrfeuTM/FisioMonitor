import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.corpo}>
      <Text style={styles.titulo}>Monitor de Fisioterapia</Text>
      <Text>Agora sim! Conectado com sucessso.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  corpo: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
});