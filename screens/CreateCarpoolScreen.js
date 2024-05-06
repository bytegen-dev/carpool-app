// CreateCarpoolScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import LoaderOverlay from '../components/LoaderOverlay';
import { Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

export default function CreateCarpoolScreen({ navigation }) {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [carModel, setCarModel] = useState('');
  const [meetupLocation, setMeetupLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({})

  const route = useRoute();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      }
    };
    fetchUserProfile();
  }, [navigation, route]);

  const createCarpool = async () => {
    try{
      if (auth.currentUser) {
        Alert.alert(
          "Please Confirm",
          "Are you sure you want to create this carpool?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Proceed", style: "default", onPress: async () => {
              try{
                setLoading(true);
                await addDoc(collection(db, 'carpools'), {
                  owner: auth.currentUser.uid || userProfile?.phone,
                  fromLocation: fromLocation || "",
                  toLocation: toLocation || "",
                  carModel: carModel || "",
                  meetupLocation: meetupLocation || "",
                  createdAt: new Date(),
                  poster: userProfile?.displayName || "Guest",
                });
                setLoading(false);
                navigation.navigate("My Carpools");
                Alert.alert('Carpool created successfully');
              } catch(error){
                console.error(error)
                setLoading(false)
              }
            }}
          ]
        );
      } else{
        setLoading(false);
      }
    } catch(error){
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoaderOverlay visible={loading} />
      <Text style={styles.title}>Carpool details</Text>
      <TextInput
        style={styles.input}
        placeholder="From"
        value={fromLocation}
        onChangeText={setFromLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="To"
        value={toLocation}
        onChangeText={setToLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Car Model"
        value={carModel}
        onChangeText={setCarModel}
      />
      <TextInput
        style={styles.input}
        placeholder="Meetup Location"
        value={meetupLocation}
        onChangeText={setMeetupLocation}
      />
      <Button title="Create Carpool" disabled={!fromLocation || !toLocation || !meetupLocation} onPress={createCarpool} />
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
  input: {
    height: 40,
    borderColor: '#0002',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    backgroundColor: "#0001",
    borderRadius: 5,
  },
});
