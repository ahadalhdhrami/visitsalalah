import React from 'react';
import { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import 'react-native-url-polyfill/auto';
import { TouchableOpacity, Text } from 'react-native';
import { supabase } from './src/supabase';
//Import Screens
import SignupScreen from './src/SignupScreen';
import SigninScreen from './src/SigninScreen';
import HomeScreen from './src/HomeScreen';
import AboutScreen from './src/AboutScreen';
import DiscoverScreen from './src/DiscoverScreen';
import EventsScreen from './src/EventsScreen';
import MyProfile from './src/MyProfile';
import PlaceDetails from './src/PlaceDetails';
import Splash from './src/Splash';
import VideoDetails from './src/VideoDetails';
import EventDetails from './src/EventDetails';
import AdminScreen from './src/AdminScreen';
import VideosManagment from './src/VideosManagment';
import EventManagement from './src/EventManagement';
import PlacesManagement from './src/PlacesManagement';
import ReviewsMangemet from './src/ReviewsMangemet';
import NewEvent from './src/NewEvent';
import NewPlace from './src/NewPlace';
import NewVideo from './src/NewVideo';
import BookingScreen from './src/BookingScreen';
import BookingPlace from './src/BookingPlace';
import BookScreen from './src/BookScreen';
import MyReservations from './src/MyReservations';
import ManageReservations from './src/ManageReservations';
import BookingPlacesManagement from './src/BookingPlacesManagement';
import NewBookingPlace from './src/NewBookingPlace';
import ManageUsers from './src/ManageUsers';
import Feedback from './src/Feedback';
import ManageFeedback from './src/ManageFeedback';
import Chatbot from './src/Chatbot';
import ManageChatbot from './src/ManageChatbot';
import NewChatbot from './src/NewChatbot';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs({ navigation }) {

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('My Profile')}
          style={{
            backgroundColor: 'green',
            padding: 5,
            paddingHorizontal: 25,
            margin: 3,
            borderRadius: 8,
          }}>
          <Text style={{ color: 'white' }}>My Profile</Text>
        </TouchableOpacity>
      ),
    });
  }, [])
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        tabBarItemStyle: { width: 100 },
        tabBarIndicatorStyle: { backgroundColor: 'green' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch(err => {
        console.log(err);
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} initialParams={{ session: session }} />
          <Stack.Screen
            name="Switzerland Gulf"
            component={MainTabs}
            options={{ headerShown: true, headerBackVisible: false }}
          />
          <Stack.Screen name="My Profile" component={MyProfile} initialParams={{ user_id: (session && session.user) ? session.user : null }} />
          <Stack.Screen name="Chatbot" component={Chatbot} initialParams={{ user_id: (session && session.user) ? session.user : null }} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="My Reservations" component={MyReservations} initialParams={{ user_id: (session && session.user) ? session.user : null }} />
          <Stack.Screen name="Feedback" component={Feedback} initialParams={{ user_id: (session && session.user) ? session.user : null }} />
          <Stack.Screen name="Book" options={{ title: 'Booking Details' }} component={BookScreen} initialParams={{ user_id: (session && session.user) ? session.user : null }} />
          <Stack.Screen name="Place Details" component={PlaceDetails} initialParams={{ place: null, user_id: (session && session.user) ? session.user : null }} options={{ title: '' }} />
          <Stack.Screen name="Video Details" component={VideoDetails} initialParams={{ video: null }} />
          <Stack.Screen name="Event Details" component={EventDetails} initialParams={{ event: null }} />
          <Stack.Screen name="Booking Place" component={BookingPlace} />
          <Stack.Screen name="Admin Access" component={AdminScreen} />
          <Stack.Screen name="Videos Managemnet" component={VideosManagment} />
          <Stack.Screen name="New Video" component={NewVideo} />
          <Stack.Screen name="Events Management" component={EventManagement} />
          <Stack.Screen name="New Event" component={NewEvent} />
          <Stack.Screen name="Places Managemnet" component={PlacesManagement} />
          <Stack.Screen name="New Place" component={NewPlace} />
          <Stack.Screen name="Reviews Managemnet" component={ReviewsMangemet} />
          <Stack.Screen name="Booking Places Management" component={BookingPlacesManagement} />
          <Stack.Screen name="New Booking Place" component={NewBookingPlace} />
          <Stack.Screen name="Manage Reservations" component={ManageReservations} />
          <Stack.Screen name="Manage Users" component={ManageUsers} />
          <Stack.Screen name="Manage Feedback" component={ManageFeedback} />
          <Stack.Screen name="New Chatbot" component={NewChatbot} />
          <Stack.Screen name="Manage Chatbot" component={ManageChatbot} />
          <Stack.Screen name="Sign in" component={SigninScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Sign up" component={SignupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>);
}
