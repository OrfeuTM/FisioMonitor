import { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal // Importamos o Modal
  ,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function App() {
  // --- Estados ---
  const [modalVisivel, setModalVisivel] = useState(false); // Controla se o formulário aparece
  const [apelido, setApelido] = useState(''); 
  const [nomeTecnico, setNomeTecnico] = useState('');
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
    
    // LIMPEZA E FECHAR MODAL
    setApelido('');
    setNomeTecnico('');
    setSeriesAlvo('3');
    setRepeticoes('13');
    setModalVisivel(false); // Fecha a telinha de cadastro
    Keyboard.dismiss(); 
  };

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

  const removerExercicio = (id) => {
    Alert.alert("Apagar", "Deseja remover este exercício?", [
      { text: "Cancelar" },
      { text: "Sim", onPress: () => setListaExercicios(listaExercicios.filter(ex => ex.id !== id)) }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fisio Monitor 🩺</Text>

      {/* BOTÃO PARA ABRIR O CADASTRO - Bem visível para idosos */}
      {!modalVisivel && (
        <TouchableOpacity 
          style={styles.botaoAbrir} 
          onPress={() => setModalVisivel(true)}
        >
          <Text style={styles.textoBotaoAbrir}>+ ADICIONAR EXERCÍCIO</Text>
        </TouchableOpacity>
      )}

      {/* MODAL DE CADASTRO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.formulario}>
            <View style={styles.headerModal}>
              <Text style={styles.tituloModal}>Novo Exercício</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Text style={{fontSize: 24, color: '#e74c3c'}}>X</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.labelInput}>O que o paciente vai fazer?</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ex: Sentar na cadeira" 
              value={apelido}
              onChangeText={setApelido} 
            />
            
            <Text style={styles.labelInput}>Nome técnico (opcional):</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ex: Agachamento" 
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
                <Text style={styles.labelInput}>Repetições:</Text>
                <TextInput 
                  style={styles.input} 
                  keyboardType="numeric"
                  value={repeticoes}
                  onChangeText={setRepeticoes}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.botaoSalvar} onPress={adicionarExercicio}>
              <Text style={styles.textoBotao}>SALVAR NO PLANO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LISTA DE EXERCÍCIOS */}
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
        {listaExercicios.length === 0 && (
          <Text style={styles.textoVazio}>Nenhum exercício hoje. Clique no botão acima para começar! 👇</Text>
        )}
        
        {listaExercicios.map((ex) => {
          const tudoPronto = ex.progresso.every(item => item === true);

          return (
            <View key={ex.id} style={[styles.card, tudoPronto && styles.cardSucesso]}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tituloExercicio}>{ex.apelido}</Text>
                  <Text style={styles.subtituloTecnico}>{ex.nomeTecnico}</Text>
                </View>
                <TouchableOpacity onPress={() => removerExercicio(ex.id)}>
                  <Text style={{ fontSize: 24 }}>🗑️</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.infoSeries}>{ex.metaSeries} séries de {ex.metaRepeticoes} repetições</Text>
              
              {!tudoPronto ? (
                <View style={styles.areaBolinhas}>
                  {ex.progresso.map((feito, index) => (
                    <TouchableOpacity 
                      key={index} 
                      onPress={() => marcarConcluido(ex.id, index)}
                      disabled={feito}
                      style={[styles.bolinha, feito && styles.bolinhaFeita]}
                    >
                      <Text style={[styles.textoBolinha, feito && {color: '#fff'}]}>
                        {feito ? "✓" : index + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.areaParabens}>
                  <Text style={styles.textoParabens}>✅ Parabéns! Concluído.</Text>
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
  container: { flex: 1, backgroundColor: '#F0F2F5', alignItems: 'center', paddingTop: 60 },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#1A1A1A' },
  
  // Botão de Abrir Cadastro
  botaoAbrir: { backgroundColor: '#3498db', width: '90%', padding: 18, borderRadius: 15, marginBottom: 20, alignItems: 'center', elevation: 4 },
  textoBotaoAbrir: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  
  // Modal e Formulário
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  formulario: { width: '90%', backgroundColor: '#fff', padding: 25, borderRadius: 30, elevation: 10 },
  headerModal: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  tituloModal: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  labelInput: { fontSize: 16, color: '#555', marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#F0F2F5', borderRadius: 15, padding: 15, marginBottom: 20, fontSize: 18 },
  botaoSalvar: { backgroundColor: '#2ecc71', padding: 20, borderRadius: 15, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

  // Cards
  card: { backgroundColor: '#fff', width: '92%', padding: 20, borderRadius: 25, marginBottom: 15, borderLeftWidth: 12, borderLeftColor: '#3498db', elevation: 2 },
  cardSucesso: { borderLeftColor: '#2ecc71' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tituloExercicio: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  subtituloTecnico: { color: '#95a5a6', fontSize: 16 },
  infoSeries: { fontSize: 18, color: '#34495e', marginVertical: 15, fontWeight: '500' },
  
  // Bolinhas
  areaBolinhas: { flexDirection: 'row', flexWrap: 'wrap' },
  bolinha: { width: 65, height: 65, backgroundColor: '#F0F2F5', borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', marginRight: 15, marginBottom: 15, borderWidth: 2, borderColor: '#D1D8E0' },
  bolinhaFeita: { backgroundColor: '#2ecc71', borderColor: '#27ae60' },
  textoBolinha: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  
  areaParabens: { marginTop: 10, padding: 20, backgroundColor: '#E8F8F0', borderRadius: 20, alignItems: 'center' },
  textoParabens: { color: '#2ecc71', fontWeight: 'bold', fontSize: 20 },
  textoVazio: { textAlign: 'center', color: '#95a5a6', fontSize: 18, padding: 40 }
});