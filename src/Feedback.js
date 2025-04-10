import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from './supabase';

export default function Feedback({navigation, route}) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const {user_id} = route.params;

  useEffect(() => {
    if (user_id && user_id.identities) {
      supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id.identities[0].id)
        .then(response => {
          if (!response.error && response.data && response.data.length != 0) {
            let data = response.data[0];
            setPhone(String(data.phone));
            setName(data.name);
            setEmail(data.email);
          }
        })
        .catch(error => {
          //console.log(error);
        });
    }
  }, []);

  function sendEmail() {
    if (email != '' || subject != '' || name != '' || message != '') {
      if (phone.length < 8 || phone.length > 8) {
        Alert.alert('Enter a valid phone number');
      } else {
        supabase
          .from('feedback')
          .insert([
            {
              name: name,
              phone: phone,
              email: email,
              message: message,
              subject: subject,
            },
          ])
          .then(({data, error}) => {
            if (error) {
              console.log('Error inserting record:', error);
            } else {
              mailer();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    } else {
      Alert.alert('Enter required fields first');
    }
  }

  function mailer() {
    fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: 'ahadalhdhrami@gmail.com',
              Name: name,
            },
            To: [
              {
                Email: 'ahadalhdhrami@gmail.com',
                Name: 'Visit Salalah',
              },
            ],
            Subject: subject,
            TextPart:
              message +
              '\n Name:' +
              name +
              '\n E-mail: ' +
              +email +
              '\n Phone:' +
              phone,
          },
        ],
      }),
      headers: new Headers({
        Authorization:
          'Basic ' +
          btoa(
            '621687d4f8ebec29bf951542c7828c33:729347cfa27a0370cbbac980bebbedcf',
          ),
        'Content-Type': 'application/json',
      }),
    })
      .then(res => res.json())
      .then((response) => {
        navigation.navigate('My Profile');
      })
      .catch(err => {        
        Alert.alert('Something went wrong...');
      });
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
          readOnly={true}
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
        <Text style={{color: 'black', fontWeight: 'bold'}}>Subject</Text>
        <TextInput
          onChangeText={text => setSubject(text)}
          value={subject}
          placeholder="Subject"
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
        <Text style={{color: 'black', fontWeight: 'bold'}}>Message</Text>
        <TextInput
          onChangeText={text => setMessage(text)}
          value={message}
          multiline={true}
          placeholder="Message"
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
          onPress={sendEmail}>
          <Text style={{color: 'white'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
