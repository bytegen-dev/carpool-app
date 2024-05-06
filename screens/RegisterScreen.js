// RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Switch } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import LoaderOverlay from '../components/LoaderOverlay';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('Guest');
  const [isCreator, setIsCreator] = useState(false);
  const [carModel, setCarModel] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const register = async () => {
    setLoading(true);
    setError(null);
    if(displayName && email && password){
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName });
        const userDoc = {
          email,
          displayName,
          isCreator,
          phone,
          ...(isCreator && { carModel, city, age }),
        };
        await setDoc(doc(db, 'users', user.uid), userDoc);
        setLoading(false);
        navigation.replace('AppTabs', { isCreator });
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    } else{
      setLoading(false);
      setError({message: "Please add your details"})
    }
  };

  return (
    <View style={styles.container}>
      <LoaderOverlay visible={loading} />
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.label}>Display Name*</Text>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
        maxLength={16}
      />
      <Text style={styles.label}>Email*</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        maxLength={30}
      />
      <Text style={styles.label}>Password*</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        maxLength={16}
      />
      <Text style={styles.label}>Phone*</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone number for contact"
        value={phone}
        onChangeText={setPhone}
        maxLength={16}
        keyboardType="numeric"
      />
      <View style={styles.switchContainer}>
        <Text>Carpool Creator</Text>
        <Switch value={isCreator} onValueChange={setIsCreator} />
      </View>
      {isCreator && (
        <>
          <Text style={styles.label}>Car Model</Text>
          <TextInput
            style={styles.input}
            placeholder="Car Model"
            value={carModel}
            onChangeText={setCarModel}
          />
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </>
      )}
      {error && <Text style={styles.error}>{error?.message || "An Error Occured"}</Text>}
      <Button title="Register" onPress={register} disabled={!displayName || !email || !password || !phone} />
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
  input: {
    height: 40,
    borderColor: '#0002',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    backgroundColor: "#0001",
    borderRadius: 5,
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
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});
