import React, {useRef} from 'react';
import {ScrollView, Text, View} from 'react-native';
import Video, {VideoRef} from 'react-native-video';

export default function VideoDetails({route, navigation}) {
  const playerRef = useRef(null);
  const {video} = route.params;

  return (
    <ScrollView>
      {video && (
        <View>
          <Video
            source={{
              uri:
                'https://hxzcbifllmwvlpyuiznh.supabase.co/storage/v1/object/public/files/' +
                video.video,
            }}
            thumbnail={{
              uri:
                'https://hxzcbifllmwvlpyuiznh.supabase.co/storage/v1/object/public/files/' +
                video.image,
            }}
            ref={playerRef}
            style={{
              height: 300,
            }}
            controls={true}
          />
          <Text
            style={{
              padding: 15,
              fontSize: 18,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {video.title}
          </Text>
          <Text
            style={{
              padding: 15,
              fontSize: 12,
              color: 'black',
            }}>
            {new Date(video.created_at).toLocaleDateString('en-GB')}
          </Text>
          <Text
            style={{
              padding: 15,
              fontSize: 16,
              color: 'black',
              textAlign: 'justify',
            }}>
            {video.description}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
