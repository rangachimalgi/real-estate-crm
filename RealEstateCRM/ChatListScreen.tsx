import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Dimensions,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ChatConversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'online' | 'offline' | 'away';
  projectName?: string;
  leadStatus: 'hot' | 'warm' | 'cold';
}

const { width, height } = Dimensions.get('window');
const isLargeScreen = height > 800;

function ChatListScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ChatConversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [searchQuery, selectedFilter, conversations]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real app, fetch from API
      const mockConversations: ChatConversation[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'John Doe',
          customerAvatar: 'https://via.placeholder.com/50',
          lastMessage: 'I\'m very interested in the 3BHK apartment. Can you share more details?',
          lastMessageTime: new Date(Date.now() - 300000), // 5 minutes ago
          unreadCount: 2,
          status: 'online',
          projectName: 'Sunrise Residency',
          leadStatus: 'hot',
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Sarah Wilson',
          customerAvatar: 'https://via.placeholder.com/50',
          lastMessage: 'Thank you for the brochure. I\'ll review it and get back to you.',
          lastMessageTime: new Date(Date.now() - 1800000), // 30 minutes ago
          unreadCount: 0,
          status: 'offline',
          projectName: 'Green Valley',
          leadStatus: 'warm',
        },
        {
          id: '3',
          customerId: '3',
          customerName: 'Mike Johnson',
          customerAvatar: 'https://via.placeholder.com/50',
          lastMessage: 'What are the payment terms for the villa?',
          lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
          unreadCount: 1,
          status: 'away',
          projectName: 'Luxury Villas',
          leadStatus: 'hot',
        },
        {
          id: '4',
          customerId: '4',
          customerName: 'Emily Brown',
          customerAvatar: 'https://via.placeholder.com/50',
          lastMessage: 'I\'m still considering the options. Will let you know soon.',
          lastMessageTime: new Date(Date.now() - 86400000), // 1 day ago
          unreadCount: 0,
          status: 'offline',
          projectName: 'City Center',
          leadStatus: 'cold',
        },
        {
          id: '5',
          customerId: '5',
          customerName: 'David Lee',
          customerAvatar: 'https://via.placeholder.com/50',
          lastMessage: 'Can you schedule a site visit for next week?',
          lastMessageTime: new Date(Date.now() - 7200000), // 2 hours ago
          unreadCount: 3,
          status: 'online',
          projectName: 'Sunrise Residency',
          leadStatus: 'hot',
        },
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      Alert.alert('Error', 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const filterConversations = () => {
    let filtered = conversations;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(conv =>
        conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by lead status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(conv => conv.leadStatus === selectedFilter);
    }

    setFilteredConversations(filtered);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#27ae60';
      case 'away':
        return '#f39c12';
      case 'offline':
        return '#95a5a6';
      default:
        return '#95a5a6';
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return '#e74c3c';
      case 'warm':
        return '#f39c12';
      case 'cold':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const handleConversationPress = (conversation: ChatConversation) => {
    navigation.navigate('Chat' as never, {
      customerId: conversation.customerId,
      customerName: conversation.customerName,
    } as never);
  };

  const renderConversation = ({ item }: { item: ChatConversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.customerAvatar }} style={styles.avatar} />
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.lastMessageTime}>{formatTime(item.lastMessageTime)}</Text>
        </View>
        
        <View style={styles.conversationDetails}>
          <Text style={styles.projectName}>{item.projectName}</Text>
          <View style={[styles.leadStatusBadge, { backgroundColor: getLeadStatusColor(item.leadStatus) + '20' }]}>
            <Text style={[styles.leadStatusText, { color: getLeadStatusColor(item.leadStatus) }]}>
              {item.leadStatus.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={2}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: 'all' | 'hot' | 'warm' | 'cold', label: string) => (
    <TouchableOpacity
      style={[styles.filterButton, selectedFilter === filter && styles.activeFilterButton]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="add" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#7f8c8d" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#7f8c8d"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#7f8c8d" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('hot', 'Hot Leads')}
          {renderFilterButton('warm', 'Warm Leads')}
          {renderFilterButton('cold', 'Cold Leads')}
        </ScrollView>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        style={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conversationsContainer}
      />

      {/* Empty State */}
      {filteredConversations.length === 0 && !isLoading && (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyTitle}>No Conversations</Text>
          <Text style={styles.emptyText}>
            {searchQuery || selectedFilter !== 'all'
              ? 'No conversations match your search criteria.'
              : 'Start chatting with your customers to see conversations here.'
            }
          </Text>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: isLargeScreen ? 16 : 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: isLargeScreen ? 24 : 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: isLargeScreen ? 16 : 14,
    color: '#2c3e50',
    marginLeft: 8,
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: isLargeScreen ? 20 : 16,
    paddingVertical: isLargeScreen ? 10 : 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f1f2f6',
  },
  activeFilterButton: {
    backgroundColor: '#FADB43',
  },
  filterText: {
    fontSize: isLargeScreen ? 14 : 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  conversationsList: {
    flex: 1,
  },
  conversationsContainer: {
    paddingVertical: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: isLargeScreen ? 16 : 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  lastMessageTime: {
    fontSize: isLargeScreen ? 12 : 10,
    color: '#7f8c8d',
  },
  conversationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  projectName: {
    fontSize: isLargeScreen ? 12 : 10,
    color: '#7f8c8d',
    marginRight: 8,
  },
  leadStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  leadStatusText: {
    fontSize: isLargeScreen ? 10 : 8,
    fontWeight: 'bold',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: isLargeScreen ? 14 : 12,
    color: '#7f8c8d',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#FADB43',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: isLargeScreen ? 10 : 8,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: isLargeScreen ? 20 : 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
  },
  emptyText: {
    fontSize: isLargeScreen ? 14 : 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});

export default ChatListScreen;
