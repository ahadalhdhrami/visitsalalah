import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {supabase} from './supabase';

export default function ReviewsMangemet({navigation}) {
  const [places, setPlaces] = useState(null);
  const [refresh, setRefresh] = useState(null);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .then(response => {
        if (!response.error && response.data && response.data.length != 0) {
          setPlaces(response.data);
        }
      })
      .catch(error => {
        //console.log(error);
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
            .from('reviews')
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
            <View>
              <Text style={{padding: 5, color: 'black'}}>
                {item.user_name} - {item.review} Stars
              </Text>
              <Text style={{padding: 5, color: 'black', width: 260, textAlign: 'justify'}}>
                {item.review_content}
              </Text>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{
                    margin: 3,
                    backgroundColor: 'green',
                    borderRadius: 5,
                    padding: 5,
                  }}
                  onPress={() =>
                    navigation.navigate('Place Details', {place: item.place_id})
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
                  onPress={() => deleteItem(item.id)}>
                  <Text style={{color: 'white'}}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
    </ScrollView>
  );
}
