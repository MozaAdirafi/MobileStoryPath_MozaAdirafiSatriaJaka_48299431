/**
 * ProjectLayout.tsx
 * 
 * Tab navigation layout for project-related screens, including Home, Map, and QR
 * Scanner. Uses `expo-router` to manage tab navigation and display icons for each tab.
 * 
 * Props:
 * - `id`: Passed as initialParams to manage navigation between tabs based on project ID.
 */


import React from 'react';
import { Tabs } from 'expo-router/tabs';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProjectLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Project Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
        initialParams={{ id }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }} 
        initialParams={{ id }} 
      />
      <Tabs.Screen 
        name="qr-scanner" 
        options={{ 
          title: 'QR Scanner',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code" size={size} color={color} />
          ),
        }} 
        initialParams={{ id }} 
      />
    </Tabs>
  );
}
