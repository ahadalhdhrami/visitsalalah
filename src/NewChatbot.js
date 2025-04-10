import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from './supabase';

export default function NewChatbot({navigation}) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  function saveNew() {
    supabase
      .from('chatbot')
      .insert([
        {
          question: question,
          answer: answer,
        },
      ])
      .then(({data, error}) => {
        if (error) {
          console.error('Error inserting record:', error);
        } else {
          navigation.navigate('Manage Chatbot');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <ScrollView style={{backgroundColor: 'white', padding: 15}}>
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>question</Text>
        <TextInput
          onChangeText={text => setQuestion(text)}
          value={question}
          placeholder="Question"
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
      <View style={{padding: 5, margin: 5}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Answer</Text>
        <TextInput
          onChangeText={text => setAnswer(text)}
          value={answer}
          multiline
          placeholder="Answer"
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
      
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 5,
          marginBottom: 45,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'green',
            padding: 15,
            paddingHorizontal: 45,
            margin: 3,
            borderRadius: 8,
            marginTop: 25,
          }}
          onPress={saveNew}>
          <Text style={{color: 'white'}}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
