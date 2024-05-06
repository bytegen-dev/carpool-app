// UpdateProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function UpdateProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfile(data);
          setDisplayName(data.displayName || '');
          setPhone(data.phone || '');
          setCarModel(data.carModel || '');
          setCity(data.city || '');
          setAge(data.age || '');
          setProfileImage(data.profileImageUrl || '');
        }
      }
    };
    fetchUserProfile();
  }, []);

  const updateProfile = async () => {
    setError('');
    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { displayName, carModel, city, phone, age, profileImageUrl: profileImage });
        navigation.navigate("My Profile", {replace: true});
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      try{
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
    
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, blob)
        
        const downloadUrl = await getDownloadURL(storageRef)
        setProfileImage(downloadUrl);
      } catch(error){
        console.error(error)
      }
    }
  };
  

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity onPress={pickImage}>
        {profileImage ? (
          <Image style={styles.profileImage} source={{ uri: profileImage }} />
        ) : (
          <FontAwesome name="user-circle" size={100} color="gray" style={styles.profileImage} />
        )}
      </TouchableOpacity>
      <Text style={styles.label}>Display Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      {userProfile?.isCreator && <>
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
      </>}
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  profileImage: {
    width: 104,
    height: 104,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: "#0001",
    borderWidth: 1,
    borderColor: "#0001",
  },
  label: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  input: {
    height: 40,
    borderColor: '#0002',
    borderWidth: 1,
    width: "100%",
    marginTop: 5,
    marginBottom: 12,
    paddingLeft: 8,
    backgroundColor: "#0001",
    borderRadius: 5,
  },
});
