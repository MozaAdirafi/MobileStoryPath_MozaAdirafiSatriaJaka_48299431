/**
 * QRScannerScreen.tsx
 * 
 * Screen for scanning QR codes using the device's camera. The scanned data can be processed
 * for verification or to unlock additional features within the project.
 * 
 * Functions:
 * - `handleBarCodeScanned`: Callback triggered upon successful QR scan, processes scanned data.
 */


// app/project-list/[id]/qr-scanner.tsx
import React, { useEffect, useState } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { BarCodeScanner, BarCodeScannedCallback } from 'expo-barcode-scanner';
import tw from 'twrnc';

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned: BarCodeScannedCallback = ({ type, data }) => {
    setScanned(true);
    console.log(data)
    Alert.alert('QR Code Scanned', `Data: ${data}`);
    // Process the scanned data as needed
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={tw`flex-1`}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={tw`flex-1`}
      />
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}
