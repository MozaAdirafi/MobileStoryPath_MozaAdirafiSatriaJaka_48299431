/**
 * ProjectListScreen.tsx
 * 
 * Displays a list of available projects for the user to explore. Fetches project data
 * from an API and includes a pull-to-refresh feature to reload the project list.
 * 
 * Functions:
 * - `fetchProjects`: Fetches the list of available projects from the API.
 * - `onRefresh`: Refreshes the project list.
 * - `handleProjectPress`: Navigates to the selected project’s details screen.
 */


import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import { getProjects } from '../api';

type Project = {
  id: number;
  title: string;
  participants_count: number;
};

export default function ProjectListScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  }, []);

  const handleProjectPress = (projectId: number) => {
    router.push({
      pathname: '/project-list/[id]',
      params: { id: projectId }
    });
  };

  const renderItem = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={tw`bg-white p-4 rounded-lg mb-4 shadow`}
      onPress={() => handleProjectPress(item.id)}
    >
      <Text style={tw`text-lg font-bold`}>{item.title}</Text>
      <Text style={tw`text-gray-500`}>
        Participants: {item.participants_count || 0}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>Published Projects</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}