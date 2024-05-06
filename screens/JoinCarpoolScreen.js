import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function JoinCarpoolScreen({ route, navigation }) {
  const { id } = route.params;
  const [carpool, setCarpool] = useState(null);

  useEffect(() => {
    const fetchCarpool = async () => {
      const docSnap = await getDoc(doc(db, 'carpools', id));
      setCarpool(docSnap.data());
    };
    fetchCarpool();
  }, [id]);

  const joinCarpool = async () => {
    if (auth.currentUser) {
      await updateDoc(doc(db, 'carpools', id), {
        members: arrayUnion({
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || '',
          contact: auth.currentUser.email || '',
        }),
      });
      navigation.goBack();
    }
  };

  return carpool ? (
    <View>
      <Text>Owner: {carpool.owner}</Text>
      <Text>Car: {carpool.carModel}</Text>
      <Text>Meetup Location: {carpool.meetupLocation}</Text>
      <Button title="Join Carpool" onPress={joinCarpool} />
    </View>
  ) : (
    <Text>Loading...</Text>
  );
}
