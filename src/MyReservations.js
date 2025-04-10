import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import {supabase} from './supabase';

export default function MyReservations({route, navigation}) {
  const [data, setData] = useState(null);
  const {user_id} = route.params;

  useEffect(() => {
    if (user_id && user_id.identities) {
      supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user_id.identities[0].id)
        .then(response => {
          if (!response.error && response.data && response.data.length != 0) {
            setData(response.data);
          }
        })
        .catch(error => {
          //console.log(error);
        });
    }
  }, [user_id]);

  return (
    <ScrollView style={{backgroundColor: 'white', padding: 15}}>
      {data &&
        data.map(item => (
          <View
            key={item.id}
            style={{
              padding: 5,
              borderColor: 'green',
              borderWidth: 1,
              borderRadius: 15,
              margin: 4
            }}>
            <Text style={{padding: 5, color: 'black', fontWeight: 'bold'}}>{item.title}</Text>
            <Text style={{padding: 5, color: 'black'}}>Booking Date: {new Date(item.created_at).toDateString('en-GB')}</Text>
            <Text style={{padding: 5, color: 'black'}}>Reservation Date: {item.date}</Text>
            <Text style={{padding: 5, color: 'black'}}>Booking No: {item.booking_no}</Text>
            <Text style={{padding: 5, color: 'black'}}>Payment Method: {item.payment_method}</Text>
          </View>
        ))}
    </ScrollView>
  );
}
