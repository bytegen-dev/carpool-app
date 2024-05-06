// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import SignInScreen from './screens/SignInScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CarpoolScreen from './screens/CarpoolScreen';
import CreateCarpoolScreen from './screens/CreateCarpoolScreen';
import MyCarpoolsScreen from './screens/MyCarpoolsScreen';
import UpdateProfileScreen from './screens/UpdateProfileScreen';
import { auth, db } from './firebaseConfig'; // Ensure `db` is imported from firebaseConfig
import LoaderOverlay from './components/LoaderOverlay';
import LoaderOverlayX from './components/LoaderOverlayX';
import { Image } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs({ route }) {
  const [userProfile, setUserProfile] = React.useState({})

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userDoc = await fetchUserData(authUser.uid);
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
      } else {
        setUserProfile({});
      }
    });
    return unsubscribe;
  }, []);

  const fetchUserData = async (uid) => {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() : null;
  };

  const { isCreator } = route.params;
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      {isCreator ? (
        <>
          <Tab.Screen
            name="Create Carpool"
            component={CreateCarpoolScreen}
            options={{ tabBarIcon: ({ color }) => <FontAwesome name="plus" size={24} color={color} /> }}
          />
          <Tab.Screen
            name="My Carpools"
            component={MyCarpoolsScreen}
            options={{ tabBarIcon: ({ color }) => <FontAwesome name="car" size={24} color={color} /> }}
          />
        </>
      ) : (
        <Tab.Screen
          name="Active Carpools"
          component={HomeScreen}
          options={{ tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} /> }}
        />
      )}
      <Tab.Screen
        name="My Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color }) => {
          return (
            <>
              {userProfile?.profileImageUrl ? <Image style={{
              width: 30,
              height: 30,
              borderRadius: 50,
              backgroundColor: "#0001",
              borderWidth: 1,
              borderColor: "#0001",
            }} source={{ uri: userProfile?.profileImageUrl }} /> : <FontAwesome name="user-circle" size={24} color={color} />}
            </>
          )
        } }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = React.useState(null);
  const [isCreator, setIsCreator] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState({})
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setLoading(true)
      if (authUser) {
        const userDoc = await fetchUserData(authUser.uid);
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
        if (userDoc) {
          setIsCreator(userDoc.isCreator);
        }
        setUser(authUser);
        setLoading(false)
      } else {
        setUser(null);
        setLoading(false)
      }
    });
    return unsubscribe;
  }, []);

  const fetchUserData = async (uid) => {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() : null;
  };

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {loading ? <Stack.Screen name='Loading' component={LoaderOverlayX}>
          </Stack.Screen> : <>
          {user ? (
            <Stack.Screen name="AppTabs" component={AppTabs} initialParams={{ isCreator }} />
          ) : (
            <>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
          </>}
          <Stack.Screen name="Carpool" component={CarpoolScreen} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
