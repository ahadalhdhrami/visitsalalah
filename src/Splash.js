import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import {supabase} from './supabase';

export default function Splash({navigation}) {
  const [session, setSession] = useState(false);
  const [userType, setUserType] = useState(false);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({data: {session}}) => {
        if (session && session.user) {
            setSession(true);
            if (session.user.identities) {
            supabase
                .from('users')
                .select('*')
                .eq('user_id', session.user.identities[0].id)
                .then(response => {
                if(!response.error && response.data && response.data.length != 0){
                    let data = response.data[0];              
                    setUserType(data.user_type);
                }
                })
                .catch(error => {
                //console.log(error);
                });
            }
        } else {
          setSession(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  function goToScreen(name) {
    if (name == 'Home') {
      if (session) {
        navigation.navigate('Switzerland Gulf');
      } else {
        navigation.navigate('Sign in');
      }
    } else {
      if (session) {
        if(userType == 'admin'){
            navigation.navigate('Admin Access');
        } else {
            supabase.auth.signOut()
            .then(res => {
                navigation.navigate('Sign in');
            })
            .catch(err => {
                console.log(err);
            })
        }
      } else {
        navigation.navigate('Sign in');
      }
    }
  }

  return (
    <ImageBackground
        source={require("./images/splashbg.jpeg")}
        style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            resizeMode: 'cover'
        }}

    >
        <View style={{ borderRadius: 15, padding: 15, backgroundColor: '#ffffff9c', alignItems: 'center',}}>
      <Image
        source={require('./images/vslogo.png')}
        style={{width: 130, height: 130, resizeMode: 'contain', backgroundColor: '#fff', borderRadius: 50, padding: 15 }}
      />
      <Text
        style={{
          color: '#000',
          padding: 15,
          fontWeight: 'bold',
          fontSize: 26,
          textAlign: 'center',
          margin: 15,
        }}>
        Switzerland Gulf
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: 'green',
          padding: 15,
          paddingHorizontal: 45,
          margin: 3,
          borderRadius: 8,
          marginVertical: 25
        }}
        onPress={() => goToScreen('Home')}>
        <Text style={{color: 'white'}}>Discover Salalah</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: 'green',
          padding: 15,
          paddingHorizontal: 56,
          margin: 3,
          borderRadius: 8,
        }}
        onPress={() => goToScreen('Admin')}>
        <Text style={{color: 'white'}}>Staff Access</Text>
      </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
