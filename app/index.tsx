/**
 * Index.tsx
 * 
 * Welcome screen for the app, offering options to create a profile or explore projects.
 * Provides introductory information about StoryPath and navigation buttons for key features.
 */


// app/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';


export default function Index() {
  const router = useRouter();

  return (
    <View style={tw`flex-1 bg-white items-center justify-center p-6`}>
      <Image
        source={require('../assets/images/storypathlogo.png')}
        style={tw`w-62 h-52 mb-6`}
      />
      <Text style={tw`text-2xl font-bold text-red-500 mb-2`}>
        Welcome to StoryPath
      </Text>
      <Text style={tw`text-center text-gray-500 mb-6 px-4`}>
        Explore Unlimited Location-based Experiences
      </Text>
      <Text style={tw`text-center text-gray-400 mb-8 px-6`}>
        With StoryPath, you can discover and create amazing location-based
        adventures. From city tours to treasure hunts, the possibilities are
        endless!
      </Text>

      <TouchableOpacity
        style={tw`bg-red-500 w-full py-3 rounded-full mb-4`}
        onPress={() => router.push('/profile')}
      >
        <Text style={tw`text-white text-center text-lg`}>Create Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-gray-300 w-full py-3 rounded-full`}
        onPress={() => router.push('/project-list')}
      >
        <Text style={tw`text-gray-700 text-center text-lg`}>Explore Projects</Text>
      </TouchableOpacity>
    </View>
  );
}
