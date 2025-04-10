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

export default function BookingPlace({route, navigation}) {
  const {place} = route.params;

  return (
    <ScrollView style={{backgroundColor: 'white', margin: 0, padding: 0}}>
      {place && (
        <View style={{margin: 0}}>
          <Image
            source={{
              uri:
                'https://hxzcbifllmwvlpyuiznh.supabase.co/storage/v1/object/public/files/' +
                place.image,
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
            {place.title}
          </Text>
          <Text
            style={{
              padding: 15,
              fontSize: 14,
              color: 'black',
              fontWeight: 'bold',
            }}>
            Price: OMR {place.price}
          </Text>
          <Text
            style={{
              padding: 15,
              fontSize: 16,
              color: 'black',
              textAlign: 'justify',
            }}>
            {place.description && place.description.replaceAll('\\n', '\n')}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
            onPress={() => navigation.navigate("Book", {place: place})}>
            <Text style={{color: 'white', textAlign: 'center'}}>Book</Text>
          </TouchableOpacity>

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
            onPress={() => Linking.openURL(place.location)}>
            <Text style={{color: 'white', textAlign: 'center'}}>Location</Text>
          </TouchableOpacity>
          </View>

        </View>
      )}
    </ScrollView>
  );
}
