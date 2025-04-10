import React, {useState} from 'react';
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
import {launchImageLibrary} from 'react-native-image-picker';

export default function NewVideo({navigation}) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [imageUri, setImageUri] = useState(null);

  function saveNew() {
    supabase
      .from('videos')
      .insert([
        {
          title: title,
          description: desc,
          video: video,
          image: image,
        },
      ])
      .then(({data, error}) => {
        if (error) {
          console.error('Error inserting record:', error);
        } else {
          navigation.navigate('Videos Managemnet');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const pickImage = op => {
    let type = op == 'video' ? 'video':'photo';
    launchImageLibrary({mediaType: type}, response => {
      if (response.assets && response.assets.length > 0) {
        console.log(response.assets);
        const uri = response.assets[0].uri;
        if (op !== 'video') {
          setImageUri(uri);
        }
        uploadImage(uri, op);
      }
    });
  };

  const uploadImage = async (uri, op) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const extension = uri.split('.').pop();
    const fileName = Date.now() + '.' + extension;

    if (op == 'video') {
      setVideo(fileName);
    } else {
      setImage(fileName);
    }
    
    const formData = new FormData();

    formData.append('file', {
      name: fileName,
      type: op == 'video' ? 'video/'+extension:'image/'+extension,
      uri: uri,
    });

    supabase.storage
      .from('files')
      .upload(`${fileName}`, formData)
      .then(data => {
        console.log(data);

        Alert.alert(op+' uploaded successfully:');
      })
      .catch(error => {
        console.log(fileName, error);

        Alert.alert('Error uploading image:');
      });
  };

  return (
    <ScrollView style={{backgroundColor: 'white', padding: 15}}>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Title</Text>
        <TextInput
          onChangeText={text => setTitle(text)}
          value={title}
          placeholder="Event Title"
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
        <Text style={{color: 'black', fontWeight: 'bold'}}>Description</Text>
        <TextInput
          onChangeText={text => setDesc(text)}
          value={desc}
          multiline
          placeholder="Event Description"
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

      {imageUri && (
        <Image
          source={{uri: imageUri}}
          style={{
            resizeMode: 'contain',
            width: 100,
            height: 100,
            alignSelf: 'center',
          }}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          margin: 15,
          marginBottom: 45,
          alignItems: 'center',
          
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'green',
            padding: 15,
            paddingHorizontal: 45,
            margin: 3,
            borderRadius: 8,
            marginTop: 25,
          }}
          onPress={() => pickImage('video')}>
          <Text style={{color: 'white'}}>Upload Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'green',
            padding: 15,
            paddingHorizontal: 45,
            margin: 3,
            borderRadius: 8,
            marginTop: 25,
          }}
          onPress={pickImage}>
          <Text style={{color: 'white'}}>Upload Photo</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: 'green',
          padding: 15,
          paddingHorizontal: 45,
          margin: 5,
          borderRadius: 8,
          width: '45%',
          alignSelf: 'center',
        }}
        onPress={saveNew}>
        <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
