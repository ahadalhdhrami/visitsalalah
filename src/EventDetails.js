import React, {useEffect, useState} from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EventDetails({route, navigation}) {
  const {event} = route.params;

  return (
    <ScrollView style={{backgroundColor: 'white', margin: 0, padding: 0}}>
      {event && (
        <View style={{margin: 0}}>
          <Image
            source={{
              uri:
                'https://hxzcbifllmwvlpyuiznh.supabase.co/storage/v1/object/public/files/' +
                event.image,
            }}
            style={{
              width: '100%',
              height: 327,
              resizeMode: 'cover',
              margin: 0,
            }}
          />
          <Text
            style={{
              padding: 15,
              fontSize: 18,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {event.title}
          </Text>
          <Text
            style={{
              padding: 15,
              fontSize: 14,
              color: 'black',
            }}>
            Event Date: {event.event_date_start} ~ {event.event_date_end} @{' '}
            {event.event_time}
          </Text>
          <Text
            style={{
              padding: 15,
              fontSize: 14,
              color: 'black',
            }}>
            Avenue: {event.avenue}
          </Text>
          <Text
            style={{
              padding: 15,
              fontSize: 16,
              color: 'black',
              textAlign: 'justify',
            }}>
            {event.description && event.description.replaceAll('\\n', '\n')}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              padding: 15,
              paddingHorizontal: 45,
              margin: 3,
              borderRadius: 8,
              marginVertical: 25,
              width: '45%',
              alignSelf: 'center'
            }}
            onPress={() => Linking.openURL(event.location)}>
            <Text style={{color: 'white', textAlign: 'center'}}>Location</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
