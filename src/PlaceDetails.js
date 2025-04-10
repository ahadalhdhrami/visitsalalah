import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking
} from 'react-native';
import { supabase } from './supabase';

export default function PlaceDetails({route, navigation}) {
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [review, setReview] = useState(1);
  const [reviewContent, setReviewContent] = useState('');
  const [user, setUser] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(null);
  const [user_name, setUserName] = useState('');

  const {user_id, place} = route.params;
  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (place) {
      supabase
        .from('places')
        .select('*')
        .eq('id', place)
        .then(res => {
          if (!res.error && res.data && res.data.length != 0) {
            setData(res.data[0]);
          }
          supabase
            .from('reviews')
            .select('*')
            .order('id', {ascending: false})
            .eq('place_id', place)
            .then(response => {
              if (!response.error && response.data && response.data.length != 0) {
                setReviews(response.data);
              }
            })
            .catch(error => {
              //console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (user_id && user_id.identities) {
      setUser(user_id.identities[0].id);
      supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id.identities[0].id)
        .then(response => {
          if (!response.error && response.data && response.data.length != 0) {
            let data = response.data[0];
            setUserName(data.name);
          }
        })
        .catch(error => {
          //console.log(error);
        });
    }
  }, [place, user_id, refreshReviews]);

  function addReview() {
    supabase
      .from('reviews')
      .insert([
        {
          user_name: user_name,
          place_id: place,
          review: review,
          review_content: reviewContent,
          user_id: user,
        },
      ])
      //.execute()
      .then(({data, error}) => {
        if (error) {
          console.error('Error inserting record:', error);
        } else {
          setRefreshReviews(Date.now());
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <ScrollView style={{backgroundColor: 'white', margin: 0, padding: 0}}>
      {data && (
        <View style={{margin: 0}}>
          <Image
            source={{
              uri:
                'https://hxzcbifllmwvlpyuiznh.supabase.co/storage/v1/object/public/files/' +
                data.image,
            }}
            style={{
              width: '100%',
              height: 327,
              resizeMode: 'contain',
              margin: 0,
            }}
          />
          <Text
            style={{
              padding: 15,
              fontSize: 18,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {data.title}
          </Text>
          <Text
            style={{
              padding: 15,
              fontSize: 16,
              color: 'black',
              textAlign: 'justify',
            }}>
            {data.description && data.description.replaceAll('\\n', '\n')}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              padding: 15,
              paddingHorizontal: 45,
              margin: 3,
              borderRadius: 8,
              marginVertical: 25,
              width: '45%',
              alignSelf: 'center'
            }}
            onPress={() => Linking.openURL(data.location)}>
            <Text style={{color: 'white', textAlign: 'center'}}>Location</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text
        style={{padding: 15, fontSize: 20, fontWeight: 'bold', color: 'black'}}>
        Travelers Reviews
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: 'green',
          borderRadius: 5,
          margin: 15,
        }}>
        <TextInput
          placeholder="Add your review"
          style={{color: 'black'}}
          multiline
          onChangeText={setReviewContent}
          value={reviewContent}
        />
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', margin: 15}}>
          {stars &&
            stars.map(star => (
              <TouchableOpacity
                key={'star-' + star}
                onPress={() => setReview(star)}>
                {star <= review ? (
                  <Image
                    source={require('./images/staricon.png')}
                    style={{resizeMode: 'contain', width: 26, height: 26}}
                  />
                ) : (
                  <Image
                    source={require('./images/stariconunselected.png')}
                    style={{resizeMode: 'contain', width: 26, height: 26}}
                  />
                )}
              </TouchableOpacity>
            ))}
          <Text
            style={{
              color: 'green',
              marginHorizontal: 5,
              fontSize: 12,
              padding: 5,
              borderRadius: 8,
            }}>
            ({review}/5)
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: 'green',
            padding: 5,
            paddingHorizontal: 15,
            margin: 15,
            borderRadius: 8,
            width: '35%',
          }}
          onPress={addReview}>
          <Text style={{color: 'white', textAlign: 'center'}}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginBottom: 45}}>
        {reviews &&
          reviews.map(item => (
            <View
              style={{
                borderWidth: 1,
                margin: 15,
                borderRadius: 15,
                borderColor: 'green',
                padding: 15,
              }}
              key={item.id}>
              <Text style={{color: 'black', marginVertical: 5}}>
                {item.user_name}
              </Text>
              <Text style={{color: 'black', fontSize: 12, marginVertical: 5}}>
                {new Date(item.created_at).toLocaleDateString('en-GB')}
              </Text>
              <View style={{flexDirection: 'row'}}>
                {stars &&
                  stars.map(star =>
                    star <= item.review ? (
                      <Image
                        key={'star-' + star}
                        source={require('./images/staricon.png')}
                        style={{resizeMode: 'contain', width: 16, height: 16}}
                      />
                    ) : (
                      <Image
                        key={'star-' + star}
                        source={require('./images/stariconunselected.png')}
                        style={{resizeMode: 'contain', width: 16, height: 16}}
                      />
                    ),
                  )}
              </View>
              <Text style={{color: 'black', marginVertical: 5}}>
                {item.review_content}
              </Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}
