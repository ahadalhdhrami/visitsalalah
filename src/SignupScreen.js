import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from './supabase';

export default function SignupScreen({navigation}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  function signUpWithEmail() {
    if (email != '' || password != '' || name != '') {
      if (password != repeatPassword) {
        Alert.alert('Password does not match.');
      } else if (password.length < 6) {
        Alert.alert('Password should be a least 6 characters.');
      } else if (phone.length < 8 || phone.length > 8) {
        Alert.alert('Enter a valid phone number');
      } else if (!email.includes('@' || !email.includes('.'))) {
        Alert.alert('Enter a valid email address');
      } else {
        supabase.auth
          .signUp({
            email: email,
            password: password,
          })
          .then(response => {
            console.log(response);
            if (response.error) {
              Alert.alert(response.error.message);
            }
            if (
              response.data.user.identities &&
              response.data.user.identities.length > 0
            ) {
              supabase
                .from('users')
                .insert([
                  {
                    name: name,
                    phone: phone,
                    email: email,
                    user_id: response.data.user.id,
                    user_type: 'user'
                  },
                ])
                //.execute()
                .then(({data, error}) => {
                  if (error) {
                    console.error('Error inserting record:', error);
                  } else {
                    navigation.navigate('Sign in');
                    console.log('Record inserted:', data);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              Alert.alert('Email address is already taken.');
            }
          })
          .catch(err => {
            console.log(err);

            //Alert.alert(err.message);
          });
        /*
            if (error) Alert.alert(error.message);
            if (!session) {
              //Alert.alert('Please check your inbox for email verification!');
            }
              */
      }
    } else {
      Alert.alert('Enter required fields first');
    }
  }

  return (
    <ScrollView style={{backgroundColor: 'white', padding: 15}}>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Name</Text>
        <TextInput
          onChangeText={text => setName(text)}
          value={name}
          placeholder="Your name"
          autoCapitalize={'none'}
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
          }}
        />
      </View>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Phone</Text>
        <TextInput
          onChangeText={text => setPhone(text)}
          value={phone}
          placeholder="Your phone number"
          autoCapitalize={'none'}
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
          }}
        />
      </View>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Email</Text>
        <TextInput
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
          }}
        />
      </View>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Password</Text>
        <TextInput
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
          }}
        />
      </View>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>
          Repeat Password
        </Text>
        <TextInput
          onChangeText={text => setRepeatPassword(text)}
          value={repeatPassword}
          secureTextEntry={true}
          placeholder="Repeat Password"
          autoCapitalize={'none'}
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
          }}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          style={{
            backgroundColor: 'green',
            padding: 15,
            paddingHorizontal: 45,
            margin: 3,
            borderRadius: 8,
            marginTop: 25,
          }}
          onPress={signUpWithEmail}>
          <Text style={{color: 'white'}}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
