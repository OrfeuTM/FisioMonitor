import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Keyboard 
} from 'react-native';

export default function App() {
  // --- Nossas "caixas" de memória (States) ---
  const [nome, setNome] = useState(''); 
  const [seriesAlvo, setSeriesAlvo] = useState(''); 
  const [repeticoes, setRepeticoes] = useState(''); 
  const [listaExercicios, setListaExercicios] = useState([]); 

  // --- Função para criar o exercício novo ---
  const adicionarExercicio = () => {
    if (nome === '' || seriesAlvo === '' || repeticoes === '') {
      alert("Preencha todos os campos!");
      return;
    }

    const novoExercicio = {
      id: Math.random().toString(), 
      nome: nome,
      metaSeries: seriesAlvo,
      metaRepeticoes: repeticoes,
      progresso: new Array(parseInt(seriesAlvo)).fill(false) 
    };

    setListaExercicios([...listaExercicios, novoExercicio]); 
    
    // Limpa os campos e fecha o teclado
    setNome('');
    setSeriesAlvo('');
    setRepeticoes('');
    Keyboard.dismiss(); 
  };

  // --- Função para marcar a bolinha ---
  const marcarConcluido = (idExercicio, indexBolinha) => {
    const novaLista = listaExercicios.map(ex => {
      if (ex.id === idExercicio) {
        let novoProgresso = [...ex.progresso];
        novoProgresso[indexBolinha] = !novoProgresso[indexBolinha];
        return { ...ex, progresso: novoProgresso };
      }
      return ex;
    });
    setListaExercicios(novaLista);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fisio Monitor</Text>

      {/* ÁREA DE CADASTRO */}
      <View style={styles.formulario}>
        <TextInput 
          style={styles.input} 
          placeholder="Nome do exercício" 
          value={nome}
          onChangeText={setNome} 
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput 
            style={[styles.input, { width: '45%' }]} 
            placeholder="Séries" 
            keyboardType="numeric"
            value={seriesAlvo}
            onChangeText={setSeriesAlvo}
          />
          <TextInput 
            style={[styles.input, { width: '45%' }]} 
            placeholder="Reps" 
            keyboardType="numeric"
            value={repeticoes}
            onChangeText={setRepeticoes}
          />
        </View>
        <TouchableOpacity style={styles.botao} onPress={adicionarExercicio}>
          <Text style={styles.textoBotao}>ADICIONAR EXERCÍCIO</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE EXERCÍCIOS ADICIONADOS */}
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
        {listaExercicios.map((ex) => {
          const tudoPronto = ex.progresso.every(item => item === true);

          return (
            <View key={ex.id} style={[styles.card, tudoPronto && styles.cardSucesso]}>
              <Text style={styles.tituloExercicio}>{ex.nome}</Text>
              <Text style={styles.subtitulo}>{ex.metaSeries} séries de {ex.metaRepeticoes} reps</Text>
              
              {!tudoPronto ? (
                <View style={styles.areaBolinhas}>
                  {ex.progresso.map((feito, index) => (
                    <TouchableOpacity 
                      key={index} 
                      onPress={() => marcarConcluido(ex.id, index)}
                      style={[styles.bolinha, feito && styles.bolinhaFeita]}
                    >
                      <Text style={{ fontWeight: 'bold', color: feito ? '#fff' : '#000' }}>
                        {feito ? "✓" : index + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.areaParabens}>
                  <Text style={styles.textoParabens}>🎉 Exercício Completo! Parabéns!</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', alignItems: 'center', paddingTop: 50 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  formulario: { width: '90%', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 4 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 15, padding: 8, fontSize: 16 },
  botao: { backgroundColor: '#3498db', padding: 12, borderRadius: 8, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', width: '90%', padding: 20, borderRadius: 15, marginBottom: 15, borderLeftWidth: 8, borderLeftColor: '#3498db' },
  cardSucesso: { borderLeftColor: '#2ecc71', backgroundColor: '#e8f8f0' },
  tituloExercicio: { fontSize: 18, fontWeight: 'bold' },
  subtitulo: { color: '#7f8c8d', marginBottom: 10 },
  areaBolinhas: { flexDirection: 'row', flexWrap: 'wrap' },
  bolinha: { width: 45, height: 45, backgroundColor: '#eee', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 10 },
  bolinhaFeita: { backgroundColor: '#2ecc71' },
  areaParabens: { marginTop: 10, padding: 10, backgroundColor: '#d4edda', borderRadius: 8, alignItems: 'center' },
  textoParabens: { color: '#155724', fontWeight: 'bold' }
});