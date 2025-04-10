import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {supabase} from './supabase';

export default function ManageUsers({navigation}) {
  const [usersList, setUsersList] = useState(null);
  const [refresh, setRefresh] = useState(null);

  useEffect(() => {
    supabase
      .from('users')
      .select('*')
      .eq('active', true)
      .then(response => {
        if (!response.error && response.data && response.data.length != 0) {
          setUsersList(response.data);
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
            .from('users')
            .update({
              active: false
            })
            .eq('user_id', itemId)
            .then(() => {
                setRefresh(Date.now());
            })
            .catch(error => {
              console.log(error);
            });
        },
      },
    ]);
  }

  return (
    <ScrollView style={{padding: 5, backgroundColor: 'white'}}>
      {usersList &&
        usersList.map(item => (
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
                {item.name}
              </Text>
              <Text style={{padding: 5, color: 'black'}}>
                {item.phone}
              </Text>
              <Text style={{padding: 5, color: 'black'}}>
                {item.email}
              </Text>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
                {item.user_type != 'admin' && <TouchableOpacity
                  style={{
                    margin: 3,
                    backgroundColor: 'red',
                    borderRadius: 5,
                    padding: 5,
                  }}
                  onPress={() => deleteItem(item.user_id)}>
                  <Text style={{color: 'white'}}>Delete</Text>
                </TouchableOpacity>}
              </View>
            </View>
          </View>
        ))}
    </ScrollView>
  );
}
