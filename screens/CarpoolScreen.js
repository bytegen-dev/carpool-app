// CarpoolScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert, Pressable, Linking } from 'react-native';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import LoaderOverlay from '../components/LoaderOverlay';

export default function CarpoolScreen({ route, navigation }) {
  const { id } = route.params;
  const [carpool, setCarpool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    const fetchCarpool = async () => {
      setIsLoading(true)
      const docSnap = await getDoc(doc(db, 'carpools', id));
      setCarpool(docSnap.data());
      setIsLoading(false)
    };
    fetchCarpool();
  }, [id]);
  
  const deleteCarpool = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this carpool?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          if (auth.currentUser && carpool.owner === auth.currentUser.uid) {
            setIsLoading(true)
            await deleteDoc(doc(db, 'carpools', id));
            setIsLoading(false)
            navigation.goBack(); // Navigate back after deletion
          }
        }}
      ]
    );
  };


  const updateCarpool = async () => {
    setIsLoading(true)
    if (auth.currentUser && carpool.owner === auth.currentUser.uid) {
      await updateDoc(doc(db, 'carpools', id), carpool);
      setIsLoading(false)
      navigation.goBack()
    }
  };

  const renderItem = ({ item, index }) => (
    <Pressable style={styles.member} onPress={()=>{
      const url = `tel:${item.phone}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        console.log('Phone number is not supported or invalid');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error('An error occurred', err));
    }}>
      <Text>Name: {item.displayName}</Text>
      <Text>Contact: {item.phone}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {isLoading && <LoaderOverlay visible={isLoading} />}
      {carpool && <>
        <Text style={styles.title}>Carpool Details</Text>
        <TextInput
          style={styles.input}
          placeholder="From"
          value={carpool?.fromLocation}
          onChangeText={(text) => setCarpool({ ...carpool, fromLocation: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          value={carpool?.toLocation}
          onChangeText={(text) => setCarpool({ ...carpool, toLocation: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Car Model"
          value={carpool.carModel}
          onChangeText={(text) => setCarpool({ ...carpool, carModel: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Meetup Location"
          value={carpool.meetupLocation}
          onChangeText={(text) => setCarpool({ ...carpool, meetupLocation: text })}
        />
        <Button title="Save Changes" onPress={updateCarpool} />
        {carpool.members && <>
          <Text style={styles.title}>Joined Members</Text>
          <FlatList
            data={carpool.members}
            renderItem={renderItem}
            keyExtractor={(item) => item.uid}
          />
        </>}
        <Text style={styles.title}></Text>
        <Button
          title="Delete"
          color={"red"}
          onPress={() =>
            deleteCarpool()
          }
        />
      </>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 50,
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
  member: {
    padding: 20,
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: "#0001",
    borderColor: "#0004",
  },
});
