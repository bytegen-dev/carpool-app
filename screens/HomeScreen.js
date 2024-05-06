// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import LoaderOverlay from '../components/LoaderOverlay';
import { formatDistanceToNow } from 'date-fns';
import { useRoute } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [carpools, setCarpools] = useState([]);
  const [joinedCarpools, setJoinedCarpools] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userProfile, setUserProfile] = useState(null);

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

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'carpools'), snapshot => {
      setCarpools(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribeUser = onSnapshot(userRef, docSnap => {
        setJoinedCarpools(docSnap.data()?.joined || []);
      });
      return () => unsubscribeUser();
    }

    return unsubscribe;
  }, []);

  const joinCarpool = async (id) => {
    if (joinedCarpools.includes(id)) {
      Alert.alert('You have already joined this carpool');
      return;
    }else{
      Alert.alert(
        "Please Confirm",
        "Are you sure you want to join this carpool?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Confirm", style: "default", onPress: async () => {
            setLoading(true);
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
              joined: [...joinedCarpools, id],
            });
            const docSnap = await getDoc(doc(db, 'carpools', id));
            const carpool = docSnap.data()
            const members = carpool.members || []
            await updateDoc(doc(db, 'carpools', id), {
              members: [
                ...members,
                {
                  ...userProfile
                }
              ]
            });
            setLoading(false);
            Alert.alert('Carpool owner will contact you with your provided contact details');
          }}
        ]
      );
    }
  };

  const renderItem = ({ item }) => {
    const alreadyJoined = joinedCarpools.includes(item.id);
    const createdAt = item.createdAt?.toDate()
    const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    return (
      <TouchableOpacity
        style={[styles.carpoolCard, alreadyJoined && styles.joinedCard]}
        onPress={() => joinCarpool(item.id)}
      >
        <Text>From: {item.fromLocation}</Text>
        <Text>To: {item.toLocation}</Text>
        <Text>Car: {item.carModel}</Text>
        <Text>Posted {timeAgo} by {item.poster || "Guest"} </Text>
        {alreadyJoined && <Text style={styles.joinedText}>Joined</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LoaderOverlay visible={loading} />
      <FlatList
        data={carpools}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 10,
  },
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
  },
  joinedCard: {
    opacity: 0.6,
  },
  joinedText: {
    color: 'green',
    fontWeight: 'bold',
  },
});
