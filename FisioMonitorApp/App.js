import { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function App() {
  // --- States ---
  const [apelido, setApelido] = useState(''); 
  const [nomeTecnico, setNomeTecnico] = useState('');
  
  // AQUI: Agora começamos com '3' e '13' em vez de vazio ''
  const [seriesAlvo, setSeriesAlvo] = useState('3'); 
  const [repeticoes, setRepeticoes] = useState('13'); 
  
  const [listaExercicios, setListaExercicios] = useState([]); 

  // --- Lógica de Reset Diário ---
  useEffect(() => {
    const hoje = new Date().toLocaleDateString();
    const listaAtualizada = listaExercicios.map(ex => {
      if (ex.ultimaData && ex.ultimaData !== hoje) {
        return { ...ex, progresso: new Array(parseInt(ex.metaSeries)).fill(false), ultimaData: hoje };
      }
      return ex;
    });

    if (JSON.stringify(listaAtualizada) !== JSON.stringify(listaExercicios)) {
      setListaExercicios(listaAtualizada);
    }
  }, [listaExercicios]);

  // --- Criar Exercício ---
  const adicionarExercicio = () => {
    if (apelido === '' || seriesAlvo === '' || repeticoes === '') {
      alert("Ops! Preencha o Nome e as Quantidades.");
      return;
    }

    const novoExercicio = {
      id: Math.random().toString(), 
      apelido: apelido,
      nomeTecnico: nomeTecnico || 'Não informado',
      metaSeries: seriesAlvo,
      metaRepeticoes: repeticoes,
      progresso: new Array(parseInt(seriesAlvo)).fill(false),
      ultimaData: new Date().toLocaleDateString()
    };

    setListaExercicios([...listaExercicios, novoExercicio]); 
    
    // LIMPEZA: Voltamos para os valores padrão após adicionar
    setApelido('');
    setNomeTecnico('');
    setSeriesAlvo('3');   // Volta para 3
    setRepeticoes('13');  // Volta para 13
    Keyboard.dismiss(); 
  };

  // --- Marcar Bolinha ---
  const marcarConcluido = (idExercicio, indexBolinha) => {
    const novaLista = listaExercicios.map(ex => {
      if (ex.id === idExercicio) {
        if (ex.progresso[indexBolinha] === true) return ex;
        let novoProgresso = [...ex.progresso];
        novoProgresso[indexBolinha] = true;
        return { ...ex, progresso: novoProgresso };
      }
      return ex;
    });
    setListaExercicios(novaLista);
  };

  // --- Remover Exercício ---
  const removerExercicio = (id) => {
    Alert.alert("Apagar", "Deseja remover este exercício?", [
      { text: "Cancelar" },
      { text: "Sim", onPress: () => setListaExercicios(listaExercicios.filter(ex => ex.id !== id)) }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fisio Monitor 🩺</Text>

      {/* ÁREA DE CADASTRO */}
      <View style={styles.formulario}>
        <Text style={styles.labelInput}>O que o paciente vai fazer?</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Sentar na cadeira" 
          value={apelido}
          onChangeText={setApelido} 
        />
        
        <Text style={styles.labelInput}>Nome oficial (opcional):</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Agachamento Livre" 
          value={nomeTecnico}
          onChangeText={setNomeTecnico} 
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '45%' }}>
            <Text style={styles.labelInput}>Séries:</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              value={seriesAlvo}
              onChangeText={setSeriesAlvo}
            />
          </View>
          <View style={{ width: '45%' }}>
            <Text style={styles.labelInput}>Reps:</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              value={repeticoes}
              onChangeText={setRepeticoes}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.botao} onPress={adicionarExercicio}>
          <Text style={styles.textoBotao}>ADICIONAR PLANO</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
        {listaExercicios.map((ex) => {
          const tudoPronto = ex.progresso.every(item => item === true);

          return (
            <View key={ex.id} style={[styles.card, tudoPronto && styles.cardSucesso]}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tituloExercicio}>{ex.apelido}</Text>
                  <Text style={styles.subtituloTecnico}>Fisio: {ex.nomeTecnico}</Text>
                </View>
                <TouchableOpacity onPress={() => removerExercicio(ex.id)}>
                  <Text style={{ fontSize: 20 }}>🗑️</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.infoSeries}>{ex.metaSeries}x de {ex.metaRepeticoes} reps</Text>
              
              {!tudoPronto ? (
                <View style={styles.areaBolinhas}>
                  {ex.progresso.map((feito, index) => (
                    <TouchableOpacity 
                      key={index} 
                      onPress={() => marcarConcluido(ex.id, index)}
                      disabled={feito}
                      style={[styles.bolinha, feito && styles.bolinhaFeita]}
                    >
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: feito ? '#fff' : '#2c3e50' }}>
                        {feito ? "✓" : index + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.areaParabens}>
                  <Text style={styles.textoParabens}>✅ Concluído hoje!</Text>
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
  container: { flex: 1, backgroundColor: '#f8f9fa', alignItems: 'center', paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  formulario: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 20, elevation: 5 },
  labelInput: { fontSize: 14, color: '#7f8c8d', marginBottom: 5, fontWeight: 'bold' },
  input: { backgroundColor: '#f1f3f5', borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16 },
  botao: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#fff', width: '92%', padding: 20, borderRadius: 20, marginBottom: 15, borderLeftWidth: 10, borderLeftColor: '#3498db', elevation: 3 },
  cardSucesso: { borderLeftColor: '#2ecc71' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tituloExercicio: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  subtituloTecnico: { color: '#95a5a6', fontSize: 14, fontStyle: 'italic', marginBottom: 10 },
  infoSeries: { fontSize: 16, color: '#34495e', marginBottom: 15 },
  areaBolinhas: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  bolinha: { width: 55, height: 55, backgroundColor: '#f1f3f5', borderRadius: 27.5, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginBottom: 12, borderWidth: 1, borderColor: '#dcdde1' },
  bolinhaFeita: { backgroundColor: '#2ecc71', borderColor: '#27ae60' },
  areaParabens: { marginTop: 5, padding: 15, backgroundColor: '#e8f8f0', borderRadius: 12, alignItems: 'center' },
  textoParabens: { color: '#2ecc71', fontWeight: 'bold', fontSize: 18 }
});