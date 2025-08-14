import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { buildApiUrl } from './config/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'customer';
  timestamp: Date;
  type: 'text' | 'image' | 'document' | 'note';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface ChatScreenProps {
  customerId?: string;
  customerName?: string;
}

const { width, height } = Dimensions.get('window');
const isLargeScreen = height > 800;

function ChatScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();
  const { customerId, customerName } = route.params as ChatScreenProps || {};
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<FlatList<Message>>(null);

  // Mock customer data - in real app, this would come from props or API
  const customer = {
    id: customerId || '1',
    name: customerName || 'John Doe',
    avatar: 'https://via.placeholder.com/50',
    status: 'online',
    lastSeen: new Date(),
  };

  useEffect(() => {
    loadChatHistory();
  }, [customerId]);

  const loadChatHistory = async () => {
    setIsLoading(true);
    try {
      // Mock chat history - in real app, fetch from API
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'Hi! I\'m interested in the new project you mentioned.',
          sender: 'customer',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text',
        },
        {
          id: '2',
          text: 'Great! I\'d be happy to help you with that. Let me share some details.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3500000),
          type: 'text',
        },
        {
          id: '3',
          text: 'Here\'s our latest brochure with all the project details.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3400000),
          type: 'document',
          fileName: 'Project_Brochure.pdf',
          fileSize: 2048576,
        },
        {
          id: '4',
          text: 'Thank you! This looks very promising.',
          sender: 'customer',
          timestamp: new Date(Date.now() - 3300000),
          type: 'text',
        },
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
      Alert.alert('Error', 'Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Mock response after 2 seconds
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! I\'ll get back to you soon.',
        sender: 'customer',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const pickDocument = async () => {
    try {
      // For now, we'll use a simple alert since document picker is complex
      // In a real app, you'd integrate with react-native-file-picker
      Alert.alert(
        'Document Sharing',
        'Document sharing feature will be available soon. For now, you can share images.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Share Image Instead',
            onPress: pickImage,
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const pickImage = async () => {
    Alert.alert(
      'Select Image',
      'Choose image source',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Camera',
          onPress: () => launchCamera({
            mediaType: 'photo',
            quality: 0.8,
          }, (response) => {
            if (response.assets && response.assets[0]) {
              const asset = response.assets[0];
              const newMessage: Message = {
                id: Date.now().toString(),
                text: 'Shared photo',
                sender: 'user',
                timestamp: new Date(),
                type: 'image',
                mediaUrl: asset.uri,
              };
              setMessages(prev => [...prev, newMessage]);
            }
          }),
        },
        {
          text: 'Gallery',
          onPress: () => launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
          }, (response) => {
            if (response.assets && response.assets[0]) {
              const asset = response.assets[0];
              const newMessage: Message = {
                id: Date.now().toString(),
                text: 'Shared photo',
                sender: 'user',
                timestamp: new Date(),
                type: 'image',
                mediaUrl: asset.uri,
              };
              setMessages(prev => [...prev, newMessage]);
            }
          }),
        },
      ]
    );
  };

  const startVideoCall = () => {
    Alert.alert(
      'Video Call',
      'Start video call with customer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Call',
          onPress: () => {
            // Navigate to video call screen
            (navigation as any).navigate('VideoCall', {
              customerId: customer.id,
              customerName: customer.name,
            });
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.customerMessage]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.customerBubble]}>
          {item.type === 'image' && item.mediaUrl && (
            <Image source={{ uri: item.mediaUrl }} style={styles.messageImage} />
          )}
          
          {item.type === 'document' && (
            <View style={styles.documentContainer}>
              <Ionicons name="document-outline" size={24} color="#2c3e50" />
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{item.fileName}</Text>
                <Text style={styles.documentSize}>{item.fileSize && formatFileSize(item.fileSize)}</Text>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Ionicons name="download-outline" size={20} color="#FADB43" />
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.customerMessageText]}>
            {item.text}
          </Text>
          
          <Text style={[styles.messageTime, isUser ? styles.userMessageTime : styles.customerMessageTime]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        
        <View style={styles.customerInfo}>
          <Image source={{ uri: customer.avatar }} style={styles.customerAvatar} />
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerStatus}>
              {customer.status === 'online' ? '🟢 Online' : '⚪ Last seen recently'}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={startVideoCall}>
            <Ionicons name="videocam-outline" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call-outline" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#2c3e50" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={scrollViewRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
            <Ionicons name="document-outline" size={24} color="#7f8c8d" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color="#7f8c8d" />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#7f8c8d"
              multiline
              maxLength={1000}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#ffffff" : "#7f8c8d"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: isLargeScreen ? 16 : 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  customerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: isLargeScreen ? 16 : 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  customerStatus: {
    fontSize: isLargeScreen ? 12 : 10,
    color: '#7f8c8d',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  customerMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#FADB43',
    borderBottomRightRadius: 4,
  },
  customerBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: isLargeScreen ? 16 : 14,
    lineHeight: isLargeScreen ? 22 : 20,
  },
  userMessageText: {
    color: '#2c3e50',
  },
  customerMessageText: {
    color: '#2c3e50',
  },
  messageTime: {
    fontSize: isLargeScreen ? 10 : 8,
    marginTop: 4,
  },
  userMessageTime: {
    color: '#2c3e50',
    textAlign: 'right',
  },
  customerMessageTime: {
    color: '#7f8c8d',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  documentName: {
    fontSize: isLargeScreen ? 14 : 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  documentSize: {
    fontSize: isLargeScreen ? 10 : 8,
    color: '#7f8c8d',
    marginTop: 2,
  },
  downloadButton: {
    padding: 8,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  textInput: {
    fontSize: isLargeScreen ? 16 : 14,
    color: '#2c3e50',
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#FADB43',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#f1f2f6',
  },
});

export default ChatScreen;
