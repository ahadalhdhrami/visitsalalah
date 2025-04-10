import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {supabase} from './supabase';

export default function ManageFeedback({navigation}) {
  const [data, setData] = useState(null);
  const [refresh, setRefresh] = useState(null);

  useEffect(() => {
    supabase
      .from('feedback')
      .select('*')
      .then(response => {
        if (!response.error && response.data && response.data.length != 0) {
          setData(response.data);
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
            .from('feedback')
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
      {data &&
        data.map(item => (
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
                Name: {item.name}
              </Text>
              <Text style={{padding: 5, color: 'black'}}>
                Phone: {item.phone}
              </Text>
              <Text style={{padding: 5, color: 'black'}}>
                E-mail: {item.email}
              </Text>
              <Text style={{padding: 5, color: 'black'}}>
                Subject: {item.subject}
              </Text>
              <Text style={{padding: 5, color: 'black'}}>
                {item.message}
              </Text>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
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
