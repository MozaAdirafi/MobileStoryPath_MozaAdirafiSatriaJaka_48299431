/**
 * ProjectHomeScreen.tsx
 * 
 * Displays the main screen for a selected project, showing project details,
 * instructions, and tracking the user's progress through the project.
 * Data is fetched from the API, including project details, total locations, and points.
 * 
 * Functions:
 * - `fetchProjectData`: Fetches project details, locations, and participant progress.
 * - `onRefresh`: Refreshes the project data on pull-down.
 */


// ProjectHomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import tw from 'twrnc';
import { useLocalSearchParams } from 'expo-router';
import { getProjectDetails, getProjectLocations, getParticipants } from '../../api';

type Project = {
  id: number;
  title: string;
  description: string;
  is_published: boolean;
  participant_scoring: string;
  username: string;
  instructions: string;
  initial_clue: string;
  homescreen_display: string;
};

type LocationData = {
  score_points: number;
};

type TrackingData = {
  points: number;
};

export default function ProjectHomeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [totalLocations, setTotalLocations] = useState(0);
  const [locationsVisited, setLocationsVisited] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProjectData = async () => {
    if (!id) return;
    
    setIsLoading(true);

    try {
      // Fetch project details
      const projectData = await getProjectDetails(id);
      if (projectData.length > 0) {
        setProject(projectData[0]);
      }

      // Fetch all locations for the project
      const locationsData: LocationData[] = await getProjectLocations(id);
      const totalLocs = locationsData.length;
      const pointsSum = locationsData.reduce((sum: number, loc: LocationData) => sum + loc.score_points, 0);
      setTotalLocations(totalLocs);
      setTotalPoints(pointsSum);

      // Fetch user tracking data
      const trackingData: TrackingData[] = await getParticipants(id);
      const userVisitedLocations = trackingData.length;
      const userAccumulatedPoints = trackingData.reduce((sum: number, track: TrackingData) => sum + track.points, 0);
      
      setLocationsVisited(userVisitedLocations);
      setUserPoints(userAccumulatedPoints);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProjectData();
  }, []);

  if (isLoading && !refreshing) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>No project found</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={tw`flex-1`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={tw`p-4`}>
        <Text style={tw`text-xl font-bold mb-4`}>{project.title}</Text>
        <View style={tw`bg-white p-4 rounded-lg shadow mb-4`}>
          <Text style={tw`text-gray-800 mb-2 font-bold`}>Instructions</Text>
          <Text style={tw`text-gray-600 mb-4`}>{project.instructions}</Text>
          <Text style={tw`text-gray-800 mb-2 font-bold`}>Initial Clue</Text>
          <Text style={tw`text-gray-600`}>{project.initial_clue}</Text>
        </View>

        <View style={tw`flex-row mb-4`}>
          <View style={tw`flex-1 bg-purple-500 p-4 rounded-lg mr-2`}>
            <Text style={tw`text-white text-center text-lg font-bold`}>
              Points: {userPoints}/{totalPoints}
            </Text>
          </View>
          <View style={tw`flex-1 bg-purple-500 p-4 rounded-lg`}>
            <Text style={tw`text-white text-center text-lg font-bold`}>
              Locations Visited: {locationsVisited}/{totalLocations}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
