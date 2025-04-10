import React, {useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from './supabase';
import {launchImageLibrary} from 'react-native-image-picker';

export default function NewBookingPlace({navigation}) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [placeTypeModal, setPlaceTypeModalVisible] = useState(false);
  const [placeType, setPlaceType] = useState('Hotels');

  function saveNew() {
    supabase
      .from('booking_places')
      .insert([
        {
          title: title,
          description: desc,
          image: image,
          place_type: placeType,
          price: price,
          location: location,
        },
      ])
      .then(({data, error}) => {
        if (error) {
          console.error('Error inserting record:', error);
        } else {
          navigation.navigate('Places Managemnet');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        console.log(response.assets);
        const uri = response.assets[0].uri;
        setImageUri(uri);
        uploadImage(uri);
      }
    });
  };

  const uploadImage = async (uri) => {
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

  function selectPlaceType(place_type) {
    setPlaceType(place_type);
    setPlaceTypeModalVisible(false)
  }

  return (
    <ScrollView style={{backgroundColor: 'white', padding: 15}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={placeTypeModal}
        onRequestClose={() => {
          setPlaceTypeModalVisible(false);
        }}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'white',
            padding: 15,
            width: '100%',
          }}>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => selectPlaceType('Hotels')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Hotel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => selectPlaceType('Apartments')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Apartments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => selectPlaceType('Restaurants')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Restaurants
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => selectPlaceType('Caffes')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Cafes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => setPlaceTypeModalVisible(false)}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Title</Text>
        <TextInput
          onChangeText={text => setTitle(text)}
          value={title}
          placeholder="Place Title"
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
          placeholder="Place Description"
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
        <Text style={{color: 'black', fontWeight: 'bold'}}>Price</Text>
        <TextInput
          onChangeText={text => setPrice(text)}
          value={price}
          multiline
          placeholder="Price"
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
        <Text style={{color: 'black', fontWeight: 'bold'}}>Google Map URL</Text>
        <TextInput
          onChangeText={text => setLocation(text)}
          value={setLocation}
          multiline
          placeholder="Location URL"
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
        <Text style={{color: 'black', fontWeight: 'bold'}}>Plact Type</Text>
        <Text
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
            paddingVertical: 15
          }}
          onPress={() => setPlaceTypeModalVisible(true)}
          >
          {placeType.toUpperCase()}
        </Text>
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
          justifyContent: 'space-between',
          margin: 5,
          marginBottom: 45,
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
          onPress={pickImage}>
          <Text style={{color: 'white'}}>Upload Photo</Text>
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
          onPress={saveNew}>
          <Text style={{color: 'white'}}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
