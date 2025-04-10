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

export default function DiscoverScreen({navigation}) {
  const [places, setPlaces] = useState(null);
  const [shadowData, setShadowData] = useState(null);
  const [data, setData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sectionModalVisible, setSectionModalVisible] = useState(false)
  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    supabase
      .from('places')
      .select('*')
      .then(placesData => {
        supabase
          .from('reviews')
          .select('*')
          .then(ratingData => {
            let tmpPlaes = [];
            if (
              !placesData.error &&
              placesData.data &&
              placesData.data.length != 0
            ) {
              tmpPlaes = placesData.data;
            }

            if (
              !ratingData.error &&
              ratingData.data &&
              ratingData.data.length != 0
            ) {
              let ratings = ratingData.data;

              //loop
              tmpPlaes.forEach((placeItem, index) => {
                let ratingsForPlace = ratings.filter(
                  ratingItem => placeItem.id === ratingItem.place_id,
                );
                if (ratingsForPlace.length > 0) {
                  //total
                  let ratingTotal = ratingsForPlace.reduce(
                    (total, ratingItem) => total + parseInt(ratingItem.review),
                    0,
                  );
                  // avg
                  let raingValue = ratingTotal / ratingsForPlace.length;
                  tmpPlaes[index].average_rating = raingValue;
                } else {
                  tmpPlaes[index].average_rating = 0;
                }
              });

              setPlaces(tmpPlaes);
              setData(tmpPlaes);
            }
          })
          .catch(err => {});
      })
      .catch(error => {
        //console.log(error);
      });
  }, []);

  function filterMenu(sortBy) {
    setModalVisible(false);
    let fitered = null;
    if (sortBy == 'name') {
      fitered = places.sort((a, b) => a.title.localeCompare(b.title));
      setPlaces(fitered);
    } else {
      fitered = places.sort((a, b) => b.average_rating - a.average_rating);
      setPlaces(fitered);
    }
  }

  function filterPlaceByType(filterType) {
    setSectionModalVisible(false);
    let fitered = null;
    if (filterType == 'all') {
      fitered = data;
    } else {
      fitered = data.filter((item) => item.place_type == filterType);
    }
    setPlaces(fitered);
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={sectionModalVisible}
        onRequestClose={() => {
          setSectionModalVisible(false);
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
            onPress={() => filterPlaceByType('all')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              All Places
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => filterPlaceByType('historical sites')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
            Historical Sites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => filterPlaceByType('nature reserves')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
            Nature Reserves
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => filterPlaceByType('family-friendly activities')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
            Family-friendly Activities
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
            onPress={() => filterMenu('name')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Sort by name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderBottomColor: 'green', borderBottomWidth: 0.2}}
            onPress={() => filterMenu('rating')}>
            <Text style={{color: 'green', padding: 15, textAlign: 'center'}}>
              Sort by rating
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 5,
        }}>
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
            onPress={() => navigation.navigate('Place Details', {place: item.id})}>
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
                top: 2,
                right: 0,
                padding: 5,
                margin: 15,
                borderRadius: 15,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              {stars &&
                stars.map((star, index) =>
                  star <= parseInt(item.average_rating) ? (
                    <Image
                      key={'star-' + index}
                      source={require('./images/staricon.png')}
                      style={{resizeMode: 'contain', width: 26, height: 26}}
                    />
                  ) : (
                    <Image
                      key={'star-' + index}
                      source={require('./images/stariconunselected.png')}
                      style={{resizeMode: 'contain', width: 26, height: 26}}
                    />
                  ),
                )}
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
        style={{marginBottom: 75}}
      />
    </View>
  );
}
