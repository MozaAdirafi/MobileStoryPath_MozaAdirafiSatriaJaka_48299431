/**
 * ProfileScreen.tsx
 * 
 * Screen allowing users to view and edit their profile, including setting
 * a username and uploading a profile image. Uses the `UserContext` to save
 * user data globally.
 * 
 * Functions:
 * - `pickImage`: Opens the device's image library for selecting a profile image.
 * - `handleSaveProfile`: Validates and saves username and image URI in context.
 */


import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Image, Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import tw from "twrnc";
import { UserContext, useUserContext } from "../context/UserContext"; // Import context to manage user data

export default function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { setUser } = useUserContext(); // Get setUser function from context

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    if (username.trim() === "") {
      Alert.alert("Please enter a username");
      return;
    }
    setUser({ username, imageUri }); // Save the username and image URI to the global context
    Alert.alert("Profile Saved", `Welcome, ${username}!`);
  };

  return (
    <View style={tw`flex-1 p-4 items-center`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Your Profile</Text>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{
            uri: imageUri || "https://via.placeholder.com/150/000000/FFFFFF/?text=Profile",
          }}
          style={tw`w-32 h-32 rounded-full mb-4`}
        />
      </TouchableOpacity>
      <TextInput
        style={tw`border rounded p-2 w-full mb-4 border-gray-300`}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
      />
      <Button title="Save Profile" onPress={handleSaveProfile} />
    </View>
  );
}
