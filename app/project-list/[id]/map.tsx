/**
 * MapScreen.tsx
 * 
 * Interactive map screen showing project locations and user location. Allows users
 * to interact with project markers, check-in at locations, and earn points for visits.
 * 
 * Functions:
 * - `parsePosition`: Parses location coordinates from string format to usable object.
 * - `calculateDistance`: Calculates the distance between two GPS coordinates.
 * - `addPoints`: Adds points for the user upon successful check-in at a location.
 */


// MapScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Modal, Button, Text, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import tw from "twrnc";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProjectLocations, getParticipants, addParticipant } from "../../api";
import { TouchableOpacity } from 'react-native';

let WebView: any = null;
try {
  WebView = require("react-native-webview").WebView;
} catch (err) {
  console.warn("WebView not available:", err);
}

type LocationType = {
  id: number;
  project_id: number;
  location_name: string;
  location_position: string;
  location_content: string;
  clue: string;
  score_points: number;
};

export default function MapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [visitedLocations, setVisitedLocations] = useState<Set<number>>(new Set());
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userCoords);
      setInitialRegion({
        ...userCoords,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    async function fetchLocations() {
      try {
        if (!id) {
          console.error("No project ID provided");
          setLoading(false);
          return;
        }

        const data = await getProjectLocations(id);
        setLocations(data || []);
        
        // Fetch already visited locations
        const participantsData = await getParticipants(id);
        const visitedLocationIds = new Set(participantsData.map(p => p.location_id));
        setVisitedLocations(visitedLocationIds);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (userLocation && !isCheckingLocation) {
        setIsCheckingLocation(true);
        try {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });

          for (const location of locations) {
            const position = parsePosition(location.location_position);
            const distance = calculateDistance(
              { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
              position
            );
            
            if (distance < 100 && !visitedLocations.has(location.id)) {
              await addPoints(location);
              setVisitedLocations(prev => new Set([...prev, location.id]));
              break;
            }
          }
        } catch (error) {
          console.error("Error checking location:", error);
        } finally {
          setIsCheckingLocation(false);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userLocation, locations, visitedLocations, isCheckingLocation]);

  const parsePosition = (position: string) => {
    try {
      const [latitude, longitude] = position
        .replace("(", "")
        .replace(")", "")
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      return { latitude, longitude };
    } catch (error) {
      console.error("Error parsing position:", error);
      return { latitude: -27.470125, longitude: 153.021072 };
    }
  };

  const calculateDistance = (coord1: { latitude: number; longitude: number }, coord2: { latitude: number; longitude: number }) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Radius of Earth in meters
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.latitude)) * Math.cos(toRad(coord2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const addPoints = async (location: LocationType) => {
    try {
      const participantData = {
        project_id: location.project_id,
        location_id: location.id,
        points: location.score_points,
        username: "studentUsername", 
        participant_username: "participantUsername" 
      };
      
      const response = await addParticipant(participantData);
      console.log("data:", participantData)
      console.log("response:", response)
      if (!response.ok) {
        throw new Error('Failed to add points');
      }
      
      Alert.alert(
        "Location Entered",
        `You have received ${location.score_points} points for visiting ${location.location_name}`,
      );
    } catch (error) {
      Alert.alert("Error", "Failed to add points. Please try again.");
    }
  };

  const handleMarkerPress = async (location: LocationType) => {
    setSelectedLocation(location);
    try {
      const data = await getParticipants(location.project_id);
      setParticipantsCount(data.length);
    } catch (error) {
      console.error("Error fetching participants:", error);
      setParticipantsCount(0);
    }
  };

  if (loading || !initialRegion) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderContent = () => {
    if (!WebView) {
      return (
        <Text style={tw`p-4`}>
          {selectedLocation?.location_content?.replace(/<[^>]*>/g, "") || "No content available"}
        </Text>
      );
    }

    return (
      <WebView
        source={{ html: selectedLocation?.location_content || "<p>No content available</p>" }}
        style={tw`flex-1`}
      />
    );
  };

  return (
    <View style={tw`flex-1`}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {userLocation && (
          <Circle
            center={userLocation}
            radius={100}
            strokeColor="rgba(0, 112, 255, 0.5)"
            fillColor="rgba(0, 112, 255, 0.2)"
          />
        )}

        {locations.map((location) => {
          const position = parsePosition(location.location_position);
          const isVisited = visitedLocations.has(location.id);
          return (
            <Marker
              key={location.id}
              coordinate={position}
              title={location.location_name}
              description={location.clue}
              onPress={() => handleMarkerPress(location)}
              pinColor={isVisited ? "green" : "red"}
            />
          );
        })}
      </MapView>

      <Modal visible={!!selectedLocation} animationType="slide" transparent={true}>
  <View style={[tw`flex-1 justify-center items-center bg-gray-900 bg-opacity-50`]}>
    <View style={[tw`bg-white rounded-lg p-6 w-4/5`, { shadowOpacity: 0.3, shadowRadius: 10 }]}>
      <Text style={tw`text-2xl font-semibold text-center mb-4`}>{selectedLocation?.location_name}</Text>
      
      <Text style={tw`text-sm text-gray-500 text-center mb-2`}>Participants who visited: {participantsCount}</Text>

      <View style={tw`border-t border-gray-200 mt-4 pt-4`}>
        <Text style={tw`text-base text-gray-700 leading-relaxed text-center`}>
          {selectedLocation?.location_content?.replace(/<[^>]*>/g, "") || "No content available"}
        </Text>
      </View>
      
      <TouchableOpacity onPress={() => setSelectedLocation(null)} style={tw`mt-6`}>
        <Text style={tw`text-blue-600 text-center text-sm`}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
}