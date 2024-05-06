// SignInScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import LoaderOverlay from '../components/LoaderOverlay';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)

  const signIn = () => {
    setError(null)
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        navigation.replace('AppTabs');
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        setError(error)
      });
  };

  return (
    <View style={styles.container}>
      <LoaderOverlay visible={loading} />
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error?.message || "An Error Occured"}</Text>}
      <Button title="Sign In" onPress={signIn} color={(email && password) ? "#44f" : "#999"} />
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: "#0001",
  },
  error: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
    color: "red",
  },
  input: {
    height: 40,
    borderColor: '#0002',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    backgroundColor: "#0001",
    borderRadius: 5,
  },
  link: {
    marginTop: 16,
    color: '#555',
  },
});
