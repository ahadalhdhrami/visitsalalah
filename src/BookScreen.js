import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {supabase} from './supabase';

export default function BookScreen({route, navigation}) {
  const [date, setDate] = useState(new Date());
  const [payment, setPayment] = useState('Cash');
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const {place, user_id} = route.params;
  useEffect(() => {
    if (user_id && user_id.identities) {
      setUserId(user_id.identities[0].id);
      supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id.identities[0].id)
        .then(response => {
          if (!response.error && response.data && response.data.length != 0) {
            let data = response.data[0];
            setPhone(String(data.phone));
            setName(data.name);
          }
        })
        .catch(error => {
          //console.log(error);
        });
    }
  }, [user_id]);

  function handleBooking() {
    Alert.alert(
      'Confirm',
      `Are you sure you to book ${place && place.title}?`,
      [
        {
          text: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            /*
            supabase
              .from('reservations')
              .select('*')
              .eq('date', date.toLocaleDateString('en-GB'))
              .get()
              .then(response => {
                if (
                  !response.error &&
                  response.data &&
                  response.data.length != 0
                ) {
                  Alert.alert('Already booked try another date.');
                  return false;
                }

                console.log(date);
                */
                supabase
                  .from('reservations')
                  .insert([
                    {
                      place_id: place.id,
                      title: place.title,
                      date: date.toLocaleDateString('en-GB'),
                      user_id: userId,
                      name: name,
                      phone: phone,
                      booking_no: Date.now(),
                      payment_method: payment
                    },
                  ])
                  .then(({data, error}) => {
                    if (error) {
                      Alert.alert('Error while try to book this place...');
                    } else {
                      navigation.navigate('Visit Salalah');
                    }
                  })
                  .catch(err => {
                    Alert.alert('Error while try to book this place...');
                  });
              /*
                })
              .catch(err => {
                Alert.alert('Error while try to book this place...');
              });
              */
          },
        },
      ],
    );
  }

  return (
    <ScrollView style={{backgroundColor: '#ffffff', padding: 5}}>
      <View style={{padding: 15, marginVertical: 15}}>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            fontWeight: 'bold',
            marginVertical: 5,
          }}>
          {place && place.title}
        </Text>
        <Text style={{color: 'black', marginVertical: 5}}>
          {place && place.description}
        </Text>
        <Text style={{color: 'black'}}>Price: OMR {place && place.price}</Text>
      </View>

      <Text
        style={{
          color: 'black',
          fontSize: 16,
          fontWeight: 'bold',
          padding: 15,
          margin: 5,
        }}>
        Personal Details
      </Text>
      <View style={{padding: 15, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Name</Text>
        <TextInput
          onChangeText={text => setName(text)}
          value={name}
          placeholder="Your name"
          autoCapitalize={'none'}
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
          }}
        />
      </View>
      <View style={{padding: 15, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Phone</Text>
        <TextInput
          onChangeText={text => setPhone(text)}
          value={phone}
          placeholder="Your phone number"
          autoCapitalize={'none'}
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 8,
            borderBottomColor: 'green',
            borderBottomWidth: 2,
          }}
        />
      </View>

      <Text
        style={{
          color: 'black',
          margin: 5,
          padding: 15,
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        Select Booking Date:
      </Text>
      <Text
        style={{
          color: 'black',
          backgroundColor: 'white',
          borderRadius: 8,
          borderBottomColor: 'green',
          borderBottomWidth: 2,
          margin: 15,
          padding: 15,
          textAlign: 'center',
        }}
        onPress={() => setOpen(true)}>
        {date.toLocaleString('en-GB')}
      </Text>

      <View style={{ flexDirection: 'row', margin: 5,  }}>
        <TouchableOpacity style={{ padding: 5, margin: 1, width: 100, borderWidth: payment == 'Cash' ?1:0, borderRadius: 15, borderColor: 'green' }} onPress={() => setPayment('Cash')}>
          <Text style={{ textAlign: 'center', color: 'black' }}>Cash</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ padding: 5, margin: 1, width: 100, borderWidth: payment == 'Debit Card' ?1:0, borderRadius: 15, borderColor: 'green'  }} onPress={() => setPayment('Debit Card')}>
          <Text style={{ textAlign: 'center', color: 'black' }}>Debit Card</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: 'green',
          padding: 15,
          paddingHorizontal: 45,
          margin: 3,
          borderRadius: 8,
          marginVertical: 25,
          width: '65%',
          alignSelf: 'center',
        }}
        onPress={handleBooking}>
        <Text style={{color: 'white', textAlign: 'center'}}>
          Confirm Booking
        </Text>
      </TouchableOpacity>
      
      <DatePicker
        modal
        mode={'date'}
        open={open}
        date={new Date()}
        onConfirm={date => {
          console.log(date.toLocaleDateString('en-GB'));
          
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </ScrollView>
  );
}
