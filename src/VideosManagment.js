import React, { useLayoutEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {supabase} from './supabase';

export default function VideosManagment({navigation}) {
  const [places, setPlaces] = useState(null);
  const [refresh, setRefresh] = useState(null);

  useLayoutEffect(() => {
    supabase
      .from('videos')
      .select('*')
      //.order('id', 'desc')
      .then(response => {
        if (!response.error && response.data && response.data.length != 0) {
          setPlaces(response.data);
        }
      })
      .catch(error => {
        //console.log(error);
      });
          navigation.setOptions({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("New Video")}
                style={{
                  backgroundColor: 'green',
                  padding: 5,
                  paddingHorizontal: 25,
                  margin: 3,
                  borderRadius: 8,
                }}>
                <Text style={{color: 'white'}}>+ New</Text>
              </TouchableOpacity>
            ),
          });
  }, [refresh]);

  function deleteItem(itemId) {
    Alert.alert('Delete', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          supabase
            .from('videos')
            .delete()
            .eq('id', itemId)
            .then(() => {
              setRefresh(Date.now());
            })
            .catch(error => {
              //console.log(error);
            });
        },
      },
    ]);
  }

  return (
    <ScrollView style={{padding: 5, backgroundColor: 'white'}}>
      {places &&
        places.map(item => (
          <View
            key={item.id}
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              padding: 5,
              borderBottomColor: 'green',
              borderBottomWidth: 1,
            }}>
            <Text style={{ padding: 5, color: 'black' }}>{item.title}</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  margin: 3,
                  backgroundColor: 'green',
                  borderRadius: 5,
                  padding: 5,
                }}
                onPress={() =>
                  navigation.navigate('Video Details', {video: item})
                }>
                <Text style={{color: 'white'}}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{
                  margin: 3,
                  backgroundColor: 'red',
                  borderRadius: 5,
                  padding: 5,
                }}
                onPress={() => deleteItem(item.id)}
              >
                <Text style={{color: 'white'}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
    </ScrollView>
  );
}
