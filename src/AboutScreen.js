import React from 'react'
import { Image, ScrollView, Text } from 'react-native'
import { supabase } from './supabase'

export default function AboutScreen() {

  return (<ScrollView style={{ backgroundColor: "white" }}>
      <Image source={require("./images/vslogo.png")} style={{ width: 100, height: 100, resizeMode: 'contain', alignSelf: 'center', margin: 15 }} />
      <Text style={{ color: 'green', padding: 15, fontWeight: 'bold', fontSize: 20, textAlign: 'center', margin: 15 }}>Switzerland Gulf</Text>
      <Text style={{ color: 'black', padding: 15, margin: 5, textAlign: 'justify', fontSize: 18 }}>This application enable travelers to discover and explore Salalah, offering a convenient gateway to the city's natural beauty, cultural landmarks, and hidden gems. Apps specifically designed for tourism in Salalah provide users with detailed maps, itineraries, and recommendations for must-see attractions, users can access information on local events and nearby dining or shopping options. Additionally, feature user-generated reviews, enabling visitors to find authentic experiences and off-the-beaten-path destinations that might otherwise be overlooked.</Text>
    </ScrollView>)
}
