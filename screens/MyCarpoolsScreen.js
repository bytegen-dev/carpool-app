// MyCarpoolsScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, where, query, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function MyCarpoolsScreen({ navigation }) {
  const [carpools, setCarpools] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, 'carpools'), where('owner', '==', auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, snapshot => {
        setCarpools(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return unsubscribe;
    }
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.carpoolCard}
      onPress={() => navigation.navigate('Carpool', { id: item.id })}
    >
      <Text>From: {item.fromLocation}</Text>
      <Text>To: {item.toLocation}</Text>
      <Text>Car: {item.carModel}</Text>
      <Text>Meetup Location: {item.meetupLocation}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={carpools}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  carpoolCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#0001",
    backgroundColor: '#fffd',
    borderRadius: 10,
    marginBottom: 10
  },
  list: {
    gap: 10,
    padding: 10,
  }
});
