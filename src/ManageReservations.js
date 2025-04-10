import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {supabase} from './supabase';

export default function ManageReservations({route, navigation}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    supabase
      .from('reservations')
      .select('*')
      .then(response => {
        if (!response.error && response.data && response.data.length != 0) {
          setData(response.data);
        }
      })
      .catch(error => {
        //console.log(error);
      });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 15}}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View
            key={item.id}
            style={{
              padding: 5,
              borderColor: 'green',
              borderWidth: 1,
              borderRadius: 15,
              margin: 3
            }}>
            <Text style={{padding: 5, color: 'black', fontWeight: 'bold'}}>
              {item.title}
            </Text>
            <Text style={{padding: 5, color: 'black'}}>
              Booking Date: {new Date(item.created_at).toDateString('en-GB')}
            </Text>
            <Text style={{padding: 5, color: 'black'}}>
              Reservation Date: {item.date}
            </Text>
            <Text style={{padding: 5, color: 'black'}}>
              Booking No: {item.booking_no}
            </Text>
            <Text style={{padding: 5, color: 'black'}}>
              Payment Method: {item.payment_method}
            </Text>
            <Text style={{padding: 5, color: 'black'}}>Name: {item.name}</Text>
            <Text style={{padding: 5, color: 'black'}}>
              Phone: {item.phone}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
        removeClippedSubviews={false}
      />
    </View>
  );
}
