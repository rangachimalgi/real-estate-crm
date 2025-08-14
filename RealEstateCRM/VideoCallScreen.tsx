import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface VideoCallScreenProps {
  customerId?: string;
  customerName?: string;
}

const { width, height } = Dimensions.get('window');
const isLargeScreen = height > 800;

function VideoCallScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();
  const { customerId, customerName } = route.params as VideoCallScreenProps || {};
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Mock customer data
  const customer = {
    id: customerId || '1',
    name: customerName || 'John Doe',
    avatar: 'https://via.placeholder.com/100',
  };

  useEffect(() => {
    // Start call timer when call becomes active
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const startCall = () => {
    Alert.alert(
      'Start Video Call',
      `Start video call with ${customer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Call',
          onPress: () => {
            setIsCallActive(true);
            // In real app, this would initialize video call
            Alert.alert('Call Started', 'Connecting to video call...');
          },
        },
      ]
    );
  };

  const endCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end the call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => {
            setIsCallActive(false);
            setCallDuration(0);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In real app, this would mute/unmute audio
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // In real app, this would enable/disable video
  };

  const toggleRecording = () => {
    if (isRecording) {
      Alert.alert('Stop Recording', 'Stop recording this call?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop Recording',
          style: 'destructive',
          onPress: () => {
            setIsRecording(false);
            Alert.alert('Recording Stopped', 'Call recording has been saved.');
          },
        },
      ]);
    } else {
      Alert.alert('Start Recording', 'Start recording this call?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Recording',
          onPress: () => {
            setIsRecording(true);
            Alert.alert('Recording Started', 'Call is now being recorded.');
          },
        },
      ]);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Video Call Interface */}
      <View style={styles.videoContainer}>
        {/* Remote Video (Customer) */}
        <View style={styles.remoteVideoContainer}>
          <View style={styles.remoteVideoPlaceholder}>
            <Ionicons name="person" size={80} color="#ffffff" />
            <Text style={styles.customerName}>{customer.name}</Text>
            {!isCallActive && (
              <Text style={styles.callStatus}>Connecting...</Text>
            )}
          </View>
        </View>

        {/* Local Video (User) */}
        <View style={styles.localVideoContainer}>
          <View style={styles.localVideoPlaceholder}>
            <Ionicons name="person" size={40} color="#ffffff" />
          </View>
        </View>

        {/* Call Info */}
        {isCallActive && (
          <View style={styles.callInfo}>
            <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <Ionicons name="radio-button-on" size={12} color="#e74c3c" />
                <Text style={styles.recordingText}>REC</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Call Controls */}
      <View style={styles.controlsContainer}>
        {!isCallActive ? (
          <TouchableOpacity style={styles.startCallButton} onPress={startCall}>
            <Ionicons name="call" size={32} color="#ffffff" />
            <Text style={styles.startCallText}>Start Call</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.callControls}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={toggleMute}
            >
              <Ionicons 
                name={isMuted ? "mic-off" : "mic"} 
                size={24} 
                color={isMuted ? "#e74c3c" : "#ffffff"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, !isVideoEnabled && styles.controlButtonActive]}
              onPress={toggleVideo}
            >
              <Ionicons 
                name={isVideoEnabled ? "videocam" : "videocam-off"} 
                size={24} 
                color={isVideoEnabled ? "#ffffff" : "#e74c3c"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isRecording && styles.controlButtonActive]}
              onPress={toggleRecording}
            >
              <Ionicons 
                name={isRecording ? "stop-circle" : "radio-button-on"} 
                size={24} 
                color={isRecording ? "#e74c3c" : "#ffffff"} 
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
              <Ionicons name="call" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerName: {
    fontSize: isLargeScreen ? 24 : 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  callStatus: {
    fontSize: isLargeScreen ? 16 : 14,
    color: '#ffffff',
    marginTop: 8,
    opacity: 0.8,
  },
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2c3e50',
  },
  localVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callDuration: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  recordingText: {
    fontSize: isLargeScreen ? 12 : 10,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: isLargeScreen ? 40 : 20,
  },
  startCallButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  startCallText: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
  },
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoCallScreen;
