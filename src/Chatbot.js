import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from './supabase';

export default function Chatbot({navigation, route}) {
  const [message, setMessage] = useState(null);
  const [name, setName] = useState('');
  const [messagesList, setMessagesList] = useState([]);
  const {user_id} = route.params;
  const chatbotContainer = useRef();

  useEffect(() => {
    if (user_id && user_id.identities) {
      supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id.identities[0].id)
        .then(response => {
          if (!response.error && response.data && response.data.length != 0) {
            let data = response.data[0];
            try {
              setName(data.name);
              setMessagesList([
                {
                  id: Date.now().toString(),
                  message: 'Hello ' + data.name + ', How can I help you, ',
                  type: 'bot',
                },
              ]);
            } catch (error) {
              //              
            }
          }
        })
        .catch(error => {
          //console.log(error);
        });
    }
  }, []);

  function sendMessage() {
    let tmpArray = [...messagesList];
    let answer = null;

    if (message != '') {
      tmpArray.push({
        id: Date.now().toString(),
        message: message,
        type: 'user',
      });
      setMessagesList(tmpArray);

      supabase
        .from('chatbot')
        .select('*')
        .ilike('question', '%'+message+'%')
        .then(res => {
          if (!res.error && res.data && res.data.length != 0) {
            try {
              setMessagesList(oldData => [
                ...oldData,
                {
                  id: (Date.now() * 678764).toString(),
                  message: res.data[0].answer,
                  type: 'bot',
                },
              ]);
            } catch (error) {
              //
            }
          } else {
              setMessagesList(ol => [
                ...ol,
                {
                  id: (Date.now() * 4577).toString(),
                  message: "Sorry, I can't find any info about this in my database...",
                  type: 'bot',
                },
              ]);
          }
        })
        .catch(error => {
          //console.log(error);
        });

      setMessage('');
    }
  }

  return (
    <View style={{ flex: 1}}>
      <FlatList
        renderItem={({item}) => (
          <View
            style={{
              backgroundColor: item.type == 'bot' ? 'green' : 'gray',
              padding: 15,
              margin: 5,
              borderRadius: 15,
              width: '75%',
              right: item.type === 'user' ? 1 : 'auto',
            }}>
            <Text style={{ color: item.type === 'user' ? '#000':'#fff' }}>{item.message}</Text>
          </View>
        )}
        data={messagesList}
        //contentContainerStyle={{height: 660}}
        keyExtractor={item => item.id}
        removeClippedSubviews={false}
        ref={chatbotContainer}
        onContentSizeChange={() => chatbotContainer.current.scrollToEnd({animated: true})}
        onLayout={() => chatbotContainer.current.scrollToEnd({animated: true})}
      />

      <View style={{position: 'relative'}}></View>
      <TextInput
        onChangeText={setMessage}
        value={message}
        placeholder="Enter your question..."
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          width: '98%',
          margin: 4,
          borderRadius: 15,
          padding: 15,
        }}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          zIndex: 3,
          right: 0,
          margin: 5,
          bottom: 0,
        }}
        onPress={sendMessage}>
        <Image
          source={require('./images/sendicon.png')}
          style={{width: 50, height: 40, resizeMode: 'contain', margin: 5}}
        />
      </TouchableOpacity>
    </View>
  );
}
