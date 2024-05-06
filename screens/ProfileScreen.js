// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import LoaderOverlay from '../components/LoaderOverlay';
import { useRoute } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('SignIn');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!userProfile) {
    return <LoaderOverlay visible={true} />;
  }

  return (
    <View style={styles.container}>
      {userProfile.profileImageUrl ? (
        <Image style={styles.profileImage} source={{ uri: userProfile.profileImageUrl }} />
      ) : (
        <FontAwesome name="user-circle" size={100} color="gray" style={styles.profileImage} />
      )}
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Display Name</Text>
        <Text style={styles.detail}>{userProfile.displayName}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.detail}>{userProfile.email}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.detail}>{userProfile.phone}</Text>
      </View>
      {userProfile?.isCreator && <>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Car Model</Text>
          <Text style={styles.detail}>{userProfile.carModel}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>City</Text>
          <Text style={styles.detail}>{userProfile.city}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.detail}>{userProfile.age}</Text>
        </View>
      </>}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateProfile')}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
  detailContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileImage: {
    alignSelf: 'center',
    alignContent: "center",
    marginBottom: 16,
    width: 104,
    height: 105,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#0002",
    backgroundColor: "#0001",
  },
  label: {
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "#0001",
    width: "100%",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#0002",
    borderRadius: 5,
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    marginTop: 8,
  },
});
