/**
 * api.js
 * 
 * Defines API requests for interacting with the backend, including fetching project details,
 * tracking participants, and managing project locations. Uses a base URL and a JWT token
 * for authentication.
 * 
 * Functions:
 * - `getProjects`: Fetches the list of all projects.
 * - `getParticipants`: Fetches participant data for a given project.
 * - `addParticipant`: Posts participant data to track location visits and scores.
 * - `getProjectDetails`: Fetches details for a specific project.
 * - `getProjectLocations`: Fetches all locations associated with a specific project.
 */


// app/api.js
import { Alert } from 'react-native';

const BASE_URL = 'https://0b5ff8b0.uqcloud.net/api';

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ4Mjk5NDMifQ.jum7KkebzPe_pkxkzhmqVYRd5ydWYLq9XBkE_tMbzw4`, // Replace with your actual JWT token
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    Alert.alert('Error', error.message);
    return null;
  }
};

export const getProjects = () => request('/project');
export const getParticipants = (projectId) => request(`/tracking?project_id=eq.${projectId}`);
export const addParticipant = (data) =>
  request('/tracking', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const getProjectDetails = (id) => request(`/project?id=eq.${id}`);
export const getProjectLocations = (projectId) => request(`/location?project_id=eq.${projectId}`);
