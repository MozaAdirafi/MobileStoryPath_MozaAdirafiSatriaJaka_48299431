/**
 * CustomDrawerContent.tsx
 * 
 * Custom content for the navigation drawer, displaying user profile details
 * including username and profile image. Provides navigation options to various screens.
 * 
 * Functions:
 * - `CustomDrawerContent`: Custom drawer layout displaying user details and navigation items.
 */


import React, { useContext } from "react";
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from "expo-router/drawer";
import { UserProvider, UserContext, useUserContext} from "./context/UserContext";
import { View, Text, Image, StyleSheet } from "react-native";
import tw from "twrnc";
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import AboutPage from "./about";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useUserContext();

  return (
    <DrawerContentScrollView {...props}>
      {/* Custom Header for User Info */}
      <View style={tw`p-4 bg-red-500 items-center`}>
        <Image
          source={{
            uri: user.imageUri || "https://via.placeholder.com/150/000000/FFFFFF/?text=Profile",
          }}
          style={tw`w-16 h-16 rounded-full mb-2`}
        />
        <Text style={tw`text-white text-lg`}>Current User: {user.username || "Guest"}</Text>
      </View>
      {/* Default Drawer Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}


export default function Layout() {
  return (
    <UserProvider>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="index"
          options={{
            title: "Homepage",
            drawerLabel: "Welcome",
          }}
        />
        <Drawer.Screen
          name="profile/index"
          options={{
            title: "Profile",
            drawerLabel: "Profile",
          }}
        />
        <Drawer.Screen
          name="project-list/index"
          options={{
            title: "Projects",
            drawerLabel: "Projects",
          }}
        />
          {/* <Drawer.Screen
          name="project-list/[id]" 
          options={{
            title: "About",
            drawerLabel: "About",
          }}
        /> */}
      </Drawer>
    </UserProvider>
  );
}
