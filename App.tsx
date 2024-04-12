import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FilmesScreen from './filmes';
import ViagemScreen from './viagem';
import RoupaScreen from './Roupa';

const Tab = createMaterialBottomTabNavigator();

const KEY_GPT = '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';

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Receita"
          component={ReceitaScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="restaurant" size={24} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Livros"
          component={FilmesScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="book" size={24} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Viagem"
          component={ViagemScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="flight" size={24} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Beleza"
          component={RoupaScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="spa" size={24} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function ReceitaScreen() {
  const [load, setLoad] = useState(false);
  const [receita, setReceita] = useState("");
  const [ingr1, setIngr1] = useState("");
  const [ingr2, setIngr2] = useState("");
  const [ingr3, setIngr3] = useState("");
  const [ingr4, setIngr4] = useState("");
  const [ocasiao, setOcasiao] = useState("");

  async function gerarReceita() {
    if (ingr1 === "" || ingr2 === "" || ingr3 === "" || ingr4 === "" || ocasiao === "") {
      Alert.alert("Atenção", "Informe todos os ingredientes!", [{ text: "Beleza!" }]);
      return;
    }
    setReceita("");
    setLoad(true);
    Keyboard.dismiss();

    const prompt = `Sugira uma receita detalhada para o ${ocasiao} usando os ingredientes: ${ingr1}, ${ingr2}, ${ingr3} e ${ingr4} e pesquise a receita no YouTube. Caso encontre, informe o link.`;

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
        top_p: 1,
      })
    })
    .then(response => response.json())
    .then((data) => {
      setReceita(data.choices[0].message.content);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoad(false);
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={styles.header}>Cozinha fácil</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Insira os ingredientes abaixo:</Text>
        <TextInput
          placeholder="Ingrediente 1"
          style={styles.input}
          value={ingr1}
          onChangeText={(text) => setIngr1(text)}
        />
        <TextInput
          placeholder="Ingrediente 2"
          style={styles.input}
          value={ingr2}
          onChangeText={(text) => setIngr2(text)}
        />
        <TextInput
          placeholder="Ingrediente 3"
          style={styles.input}
          value={ingr3}
          onChangeText={(text) => setIngr3(text)}
        />
        <TextInput
          placeholder="Ingrediente 4"
          style={styles.input}
          value={ingr4}
          onChangeText={(text) => setIngr4(text)}
        />
        <TextInput
          placeholder="Almoço ou Jantar"
          style={styles.input}
          value={ocasiao}
          onChangeText={(text) => setOcasiao(text)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={gerarReceita}>
        <Text style={styles.buttonText}>Gerar receita</Text>
        <MaterialIcons name="travel-explore" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={styles.containerScroll} showsVerticalScrollIndicator={false} >
        {load && (
          <View style={styles.content}>
            <Text style={styles.title}>Produzindo receita...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {receita && (
          <View style={styles.content}>
            <Text style={styles.title}>Sua receita 👇</Text>
            <Text style={{ lineHeight: 24 }}>{receita} </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 54
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF5656',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }
});

