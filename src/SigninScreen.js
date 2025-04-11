import React, {useState} from 'react';
import {
  Alert,
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from './supabase';

export default function SigninScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signInWithEmail() {
    if(email != "" || password != ""){
      const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
        
      if (error) {
        Alert.alert(error.message);
      } else {
        supabase
        .from('users')
        .select("*")
        .eq('user_id', data.session.user.id)
        .then(response => {          
          if (!response.error && response.data && response.data.length != 0) {
            if(response.data[0].active !== true){
              supabase
              .auth
              .signOut()
              navigation.navigate("Sign in")
            } else {
              navigation.navigate("Splash")
            }
          }

        })
        .catch(() => {
          Alert.alert("Sorry, Something went wrong...");
          //
        });
      }
    } else {
      Alert.alert("Enter your email and password first");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 15, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: 'black', padding: 5, fontWeight: 'bold', fontSize: 26, marginVertical: 35 }}>Sign in to your account:</Text>
      <View style={{padding: 5, margin: 5, width: '75%'}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Email</Text>
        <TextInput
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          style={{color: 'black', backgroundColor: 'white', borderRadius: 8,borderBottomColor: 'green', borderBottomWidth: 2,}}
        />
      </View>
      <View style={{padding: 5, margin: 5, width: '75%', marginBottom: 25}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Password</Text>
        <TextInput
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Your account Password"
          autoCapitalize={'none'}
          style={{color: 'black', backgroundColor: 'white', borderRadius: 8, borderBottomColor: 'green', borderBottomWidth: 2}}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          onPress={() => signInWithEmail()}
          style={{
            backgroundColor: 'green',
            padding: 15,
            paddingHorizontal: 45,
            margin: 3,
            borderRadius: 8,
          }}>
          <Text style={{color: 'white'}}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'green',
            padding: 15,
            paddingHorizontal: 45,
            margin: 3,
            borderRadius: 8,
          }}
          onPress={() => navigation.navigate('Sign up')}>
          <Text style={{color: 'white'}}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
