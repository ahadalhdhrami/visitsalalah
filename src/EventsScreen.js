import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {supabase} from './supabase';

export default function EventsScreen({navigation}) {
  const [places, setPlaces] = useState(null);

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .then(response => {        
        if (!response.error && response.data && response.data.length != 0) {
          setPlaces(response.data);
        }
      })
      .catch(error => {
        //console.log(error);
      });
  }, []);

  return (
    <View>
      <FlatList
        data={places}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{backgroundColor: 'white', margin: 5, borderRadius: 15}}
            onPress={() => navigation.navigate('Event Details', {event: item})}>
            <Image
              source={{
                uri:
                  'https://hxzcbifllmwvlpyuiznh.supabase.co/storage/v1/object/public/files/' +
                  item.image,
              }}
              style={{width: '100%', height: 300, resizeMode: 'cover'}}
            />
            <Text style={{padding: 5, color: 'black', fontWeight: 'bold'}}>
              {item.title}
            </Text>
            <Text style={{padding: 5, color: 'black'}}>
              {item.event_date_start} ~ {item.event_date_end}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
