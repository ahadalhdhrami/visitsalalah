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
import DatePicker from 'react-native-date-picker'

export default function NewEvent({navigation}) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [start_date, setStartDate] = useState(new Date());
  const [end_date, setEndDate] = useState(new Date());
  const [event_time, setEventTime] = useState(new Date());
  const [avenue, setAvenue] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [dateType, setDateType] = useState('start');
  const [open, setOpen] = useState(false);

  function saveNew() {
    supabase
      .from('events')
      .insert([
        {
          title: title,
          description: desc,
          event_date_start: start_date,
          event_date_end: end_date,
          event_time: event_time.toLocaleTimeString(),
          location: location,
          avenue: avenue,
          image: image,
        },
      ])
      .then(({data, error}) => {
        if (error) {
          console.error('Error inserting record:', error);
        } else {
          navigation.navigate('Events Management');
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
        console.log(data);

        Alert.alert('Image uploaded successfully:');
      })
      .catch(error => {
        console.log(fileName, error);

        Alert.alert('Error uploading image:');
      });
  };

  function selectDate(option) {
    setDateType(option)
    setOpen(true);
  }

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
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>
          Event start date
        </Text>
        <Text
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
          }}
          onPress={() => selectDate('start')}
        >
          {start_date.toLocaleDateString('en-GB')}
        </Text>
          <DatePicker
            modal
            mode={dateType == 'time' ? 'time' : 'date'}
            open={open}
            date={new Date()}
            onConfirm={(date) => {
              setOpen(false);
              switch (dateType) {
                case 'start':
                  setStartDate(date)
                break;
                case 'end':
                  setEndDate(date)
                break;
                case 'time':
                  setEventTime(date)
                break;
              }
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />
      </View>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Event end date</Text>

        <Text
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
          }} 
          onPress={() => selectDate('end')}
        >
          {end_date.toLocaleDateString('en-GB')}
        </Text>
      </View>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Event time</Text>

        <Text
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
          }}
          onPress={() => selectDate('time')}
        >
          {event_time.toLocaleTimeString('en-GB')}
        </Text>
      </View>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Avenue</Text>
        <TextInput
          onChangeText={text => setAvenue(text)}
          value={avenue}
          placeholder="Avenue"
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
        <Text style={{color: 'black', fontWeight: 'bold'}}>Location URL</Text>
        <TextInput
          onChangeText={text => setLocation(text)}
          value={location}
          placeholder="Event Location URL"
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
