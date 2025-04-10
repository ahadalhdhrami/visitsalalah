import React, {useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {supabase} from './supabase';

export default function AdminScreen({navigation}) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={signOut}
          style={{
            backgroundColor: 'green',
            padding: 5,
            paddingHorizontal: 25,
            margin: 3,
            borderRadius: 8,
          }}>
          <Text style={{color: 'white'}}>Sign Out</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  function signOut(params) {
    supabase.auth
      .signOut()
      .then(res => {
        navigation.navigate('Sign in');
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <ScrollView style={{padding: 15, backgroundColor: 'white'}}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Videos Managemnet")}
        style={{
          borderColor: 'green',
          borderWidth: 1,
          padding: 15,
          paddingHorizontal: 25,
          marginVertical: 15,
          margin: 3,
          borderRadius: 8,
        }}>
        <Text style={{color: 'green'}}>Videos Managmnet</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Places Managemnet")}
        style={{
          borderColor: 'green',
          borderWidth: 1,
          padding: 15,
          paddingHorizontal: 25,
          marginVertical: 15,
          margin: 3,
          borderRadius: 8,
        }}>
        <Text style={{color: 'green'}}>Places Managmnet</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Reviews Managemnet")}
        style={{
          borderColor: 'green',
          borderWidth: 1,
          padding: 15,
          paddingHorizontal: 25,
          margin: 3,
          marginVertical: 15,
          borderRadius: 8,
        }}>
        <Text style={{color: 'green'}}>User Reviews Managmnet</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Events Management")}
        style={{
          borderColor: 'green',
          borderWidth: 1,
          padding: 15,
          paddingHorizontal: 25,
          marginVertical: 15,
          margin: 3,
          borderRadius: 8,
        }}>
        <Text style={{color: 'green'}}>Events Managmnet</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Booking Places Management")}
        style={{
          borderColor: 'green',
          borderWidth: 1,
          padding: 15,
          paddingHorizontal: 25,
          marginVertical: 15,
          margin: 3,
          borderRadius: 8,
        }}>
        <Text style={{color: 'green'}}>Manage Booking Places</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Manage Reservations")}
        style={{
          borderColor: 'green',
          borderWidth: 1,
          padding: 15,
          paddingHorizontal: 25,
          marginVertical: 15,
          margin: 3,
          borderRadius: 8,
        }}>
        <Text style={{color: 'green'}}>Manage Reservations</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Manage Feedback")}
        style={{
          borderColor: 'green',
          borderWidth: 1,
          padding: 15,
          paddingHorizontal: 25,
          marginVertical: 15,
          margin: 3,
          borderRadius: 8,
        }}>
        <Text style={{color: 'green'}}>Manage Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Manage Users")}
        style={{
          borderColor: 'green',
          borderWidth: 1,
          padding: 15,
          paddingHorizontal: 25,
          marginVertical: 15,
          margin: 3,
          borderRadius: 8,
        }}>
        <Text style={{color: 'green'}}>Manage Users</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Manage Chatbot")}
        style={{
          borderColor: 'green',
          borderWidth: 1,
          padding: 15,
          paddingHorizontal: 25,
          marginVertical: 15,
          margin: 3,
          borderRadius: 8,
        }}>
        <Text style={{color: 'green'}}>Manage Chatbot</Text>
      </TouchableOpacity>
      <View style={{ paddingBottom: 25 }}></View>
    </ScrollView>
  );
}
