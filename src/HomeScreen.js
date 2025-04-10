import React, { useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import {supabase} from './supabase';

export default function HomeScreen({ navigation }) {
  const [places, setPlaces] = useState(null);

    useEffect(() => {
        supabase
          .from('videos')
          .select('*')
          .then(response => {            
            if(!response.error && response.data && response.data.length != 0){
              setPlaces(response.data)
            }
          })
          .catch(error => {
            //console.log(error);
          });
    }, []);

  return (<View>
    <TouchableOpacity 
      onPress={() => navigation.navigate("Chatbot")}
      style={{ position: 'absolute', zIndex: 1, bottom: 4, backgroundColor: 'green', borderRadius: 50, margin: 15, right: 0 }}
    >
      <Image 
        source={require('./images/chaticon.png')} 
        style={{
          resizeMode: 'contain',
          width: 70,
          height: 70
        }}
      />
    </TouchableOpacity>
    <FlatList
      data={places}
      renderItem={({item}) => <TouchableOpacity style={{ backgroundColor: 'white', margin: 5, borderRadius: 15 }} onPress={() => navigation.navigate("Video Details", {video: item})}>
      <Image source={{uri: 'https://hxzcbifllmwvlpyuiznh.supabase.co/storage/v1/object/public/files/'+item.image}} style={{ width: '100%', height: 340, resizeMode: 'cover' }} />
      <Text style={{ padding: 5, color: 'black', fontWeight: 'bold' }}>{item.title}</Text>
      <Text style={{ padding: 5, color: 'black' }}>{item.description}</Text>
    </TouchableOpacity>}
      keyExtractor={(item) => item.id}
    />
    
  </View>)
}
