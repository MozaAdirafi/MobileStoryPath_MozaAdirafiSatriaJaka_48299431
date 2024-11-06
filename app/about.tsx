/**
 * AboutPage.tsx
 * 
 * Static screen displaying information about the StoryPath app, its mission, and features.
 * Provides a background for users on the purpose and functionality of the app.
 */


// app/about.tsx
import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import tw from 'twrnc';

export default function AboutPage() {
  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw`p-6`}>
        <Image
          source={require('../assets/images/storypathlogo.png')}
          style={tw`w-62 h-52 mb-6 self-center`}
        />
        <Text style={tw`text-2xl font-bold text-center text-red-500 mb-4`}>
          About StoryPath
        </Text>
        <Text style={tw`text-gray-700 text-lg mb-6`}>
          StoryPath is an innovative platform that allows you to explore and create unique location-based adventures. Whether you're interested in city tours, treasure hunts, or custom experiences, StoryPath opens up endless possibilities for exploration and fun.
        </Text>
        <Text style={tw`text-gray-700 text-lg mb-4`}>
          Our mission is to provide users with engaging and interactive experiences that blend the digital and physical worlds. Through our app, you can not only explore existing adventures but also craft your own stories, guiding others through the locations you love.
        </Text>
        <Text style={tw`text-gray-700 text-lg mb-4`}>
          Join our community of explorers and storytellers today, and start your journey with StoryPath!
        </Text>
      </View>
    </ScrollView>
  );
}
