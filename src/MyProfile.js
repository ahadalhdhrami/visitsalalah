import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from './supabase';
import { launchImageLibrary } from 'react-native-image-picker';

export default function MyProfile({route, navigation}) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassord] = useState('');
  const {user_id} = route.params;

  useEffect(() => {
    if (user_id && user_id.identities) {
      setUser(user_id.identities[0].id);
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
            
            if(data.photo && data.photo != ''){
              setImage(data.photo)
            } else {
              setImage('profile.jpeg')
            }
          }
        })
        .catch(error => {
          //console.log(error);
        });
    }

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
  }, [user_id]);

  function updateProfileInfo() {
    if (name != '') {
      if (phone.length < 8 || phone.length > 8) {
        Alert.alert('Enter a valid phone number');
      } else {
        supabase
          .from('users')
          .update({
            name: name,
            phone: phone,
            photo: image
          })
          .eq('user_id', user)
          .then(({data, error}) => {
            if (error) {
              Alert.alert('There is an error occured.');
            } else {
              if(password != ''){
                supabase
                .auth
                .updateUser({
                  password: password
                })
                .then(() => {
                  signOut();
                })
                .catch((err) => {
                  Alert.alert('There is an error occured.');
                });
              } else {
                Alert.alert('Updated Successfully.');
              }
            }
          })
          .catch(err => {
            Alert.alert('There is an error occured.');
          });
      }
    } else {
      Alert.alert('Enter required fields first');
    }
  }

  function signOut() {
    supabase
      .auth
      .signOut()
      .then(res => {
        //navigation.navigate('Sign in');
      })
      .catch(err => {
        console.log(err);
      });
  }

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        uploadImage(uri);
        setImageUri(uri)
      }
    });
  };

  const uploadImage = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = uri.split('/').pop();
    setImage(fileName);

    const formData = new FormData();

    formData.append('file', {
      name: fileName,
      type: 'image/jpg',
      uri: uri,
    });

    supabase.storage
      .from('files')
      .upload(`${fileName}`, formData)
      .then(data => {
        Alert.alert('Image uploaded successfully:');
      })
      .catch(error => {
        Alert.alert('Error uploading image:');
      });
  };


  return (
    <ScrollView style={{backgroundColor: 'white', padding: 15}}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{uri: imageUri ? imageUri : 'https://hxzcbifllmwvlpyuiznh.supabase.co/storage/v1/object/public/files/' + image}} style={{ resizeMode: 'cover', alignSelf: 'center', margin: 5, width: 100, height: 100, borderRadius: 50 }} />
      </TouchableOpacity>

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
          value={email}
          autoCapitalize={'none'}
          readOnly
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
        <Text style={{color: 'black', fontWeight: 'bold'}}>New Password</Text>
        <TextInput
          onChangeText={text => setPassord(text)}
          value={password}
          placeholder="Leave empty if you don't want to change password"
          autoCapitalize={'none'}
          secureTextEntry={true}
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
          onPress={updateProfileInfo}>
          <Text style={{color: 'white'}}>Update</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginVertical: 55,
          alignSelf: 'center',
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            borderBottomColor: '#000000',
            borderBottomWidth: 1,
            padding: 15,
          }}
          onPress={() => navigation.navigate('My Reservations')}>
          <Text style={{color: '#000000'}}>
            My Reservations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderBottomColor: '#000000',
            borderBottomWidth: 1,
            padding: 15,
          }}
          onPress={() => navigation.navigate('Feedback')}>
          <Text style={{color: '#000000'}}>
            Feedback
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderBottomColor: '#000000',
            borderBottomWidth: 1,
            padding: 15,
          }}
          onPress={() => navigation.navigate('About')}>
          <Text style={{color: '#000000'}}>
            About Visit Salalah
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
