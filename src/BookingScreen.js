import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from './supabase';

export default function BookingScreen({navigation}) {
  const [places, setPlaces] = useState(null);
  const [data, setData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sectionModalVisible, setSectionModalVisible] = useState(false)

  useEffect(() => {
    supabase
      .from('booking_places')
      .select('*')
      .then(placesData => {
        let tmpPlaes = null;
        if (!placesData.error && placesData.data && placesData.data.length != 0) {
          tmpPlaes = placesData.data;
        }

        setPlaces(tmpPlaes);
        setData(tmpPlaes);
      })
      .catch(error => {
        //console.log(error);
      });
  }, []);

  function filterMenu(sortBy) {
    setSectionModalVisible(false);
    let fitered = null;
    if (sortBy == 'all') {
      fitered = data;
    } else {
      fitered = data.filter((item) => item.place_type == sortBy);
    }
    setPlaces(fitered);
  }

  function filterPrices(filterType) {
    setModalVisible(false);
    let fitered = null;
    if(filterType == 'low'){
      fitered = data.sort((a, b) => a.price - b.price)
    } else {
      fitered = data.sort((a, b) => b.price - a.price)
    }

    setPlaces(fitered);
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'white',
            padding: 15,
            width: '100%',
          }}>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => filterPrices('low')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Sort by price: low to high
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => filterPrices('high')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Sort by price: high to low
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => setModalVisible(false)}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={sectionModalVisible}
        onRequestClose={() => {
          setSectionModalVisible(false);
        }}
        >
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'white',
            padding: 15,
            width: '100%',
          }}
          >
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => filterMenu('all')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => filterMenu('Hotels')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Hotels
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => filterMenu('Apartments')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Apartments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => filterMenu('Restaurants')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Restaurants
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{borderBottomColor: 'green', borderBottomWidth: 0.2}} onPress={() => filterMenu('Caffes')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Caffes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => setSectionModalVisible(false)}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 5}}>
        <TouchableOpacity
          style={{
            padding: 5,
            paddingHorizontal: 15,
            margin: 3,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'green',
            width: '25%',
            marginVertical: 15,
          }}
          onPress={() => setSectionModalVisible(true)}>
          <Text style={{color: 'green', textAlign: 'center'}}>Sections</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 5,
            paddingHorizontal: 15,
            margin: 3,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'green',
            width: '25%',
            marginVertical: 15,
          }}
          onPress={() => setModalVisible(true)}>
          <Text style={{color: 'green', textAlign: 'center'}}>Filter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={places}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{margin: 5, position: 'relative'}}
            onPress={() => navigation.navigate('Booking Place', {place: item})}>
            <Image
              source={{
                uri:
                  'https://hxzcbifllmwvlpyuiznh.supabase.co/storage/v1/object/public/files/' +
                  item.image,
              }}
              style={{
                borderRadius: 25,
                width: '100%',
                height: 340,
                resizeMode: 'cover',
              }}
            />
          <View
            style={{
              position: 'absolute',
              width: '95%',
              top: 2,
              right: 0,
              padding: 5,
              margin: 15,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <Text style={{ color: 'black', fontSize: 12, fontWeight:'bold', backgroundColor: '#ffffff7c', padding: 3, borderRadius: 8 }}>{item.place_type.toUpperCase()}</Text>
              <Text style={{ color: 'black', fontSize: 18, fontWeight:'bold', backgroundColor: 'yellow', padding: 3, borderRadius: 8 }}>OMR {item.price}</Text>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 2,
                backgroundColor: '#ffffff7c',
                padding: 5,
                margin: 15,
                borderRadius: 15,
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  padding: 5,
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        style={{ marginBottom: 75 }}
        removeClippedSubviews={false}
      />

    </View>
  );
}
