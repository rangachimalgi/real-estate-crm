import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { buildApiUrl, API_CONFIG } from './config/api';

interface SiteVisit {
  _id: string;
  name: string;
  phoneNumber: string;
  occupation: string;
  location: string;
  timeOfVisit: string;
  projectName: string;
  scheduled: boolean;
  createdAt: string;
}

interface DeskPanelScreenProps {
  onNavigateBack: () => void;
}

function DeskPanelScreen({ onNavigateBack }: DeskPanelScreenProps): React.JSX.Element {
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'project'>('date');

  useEffect(() => {
    fetchSiteVisits();
  }, []);

  const fetchSiteVisits = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('/site-visits'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSiteVisits(data);
        console.log('Fetched site visits:', data);
      } else {
        console.error('Failed to fetch site visits');
        Alert.alert('Error', 'Failed to load site visits');
      }
    } catch (error) {
      console.error('Error fetching site visits:', error);
      Alert.alert('Error', 'Network error while loading site visits');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSiteVisits();
    setRefreshing(false);
  };

  const handleStatusToggle = async (visitId: string, currentStatus: boolean) => {
    try {
      // For now, just update local state without backend call
      // TODO: Implement backend PATCH endpoint for updating visit status
      
      // Update local state immediately
      setSiteVisits(prev => 
        prev.map(visit => 
          visit._id === visitId 
            ? { ...visit, scheduled: !currentStatus }
            : visit
        )
      );
      
      const newStatus = !currentStatus;
      const statusMessage = newStatus ? 'Visit scheduled successfully!' : 'Visit moved to pending!';
      Alert.alert('Success', statusMessage);
      
      // Optional: You can implement the backend call later like this:
      /*
      const response = await fetch(buildApiUrl(`/site-visits/${visitId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduled: !currentStatus }),
      });

      if (!response.ok) {
        // Revert local state if backend fails
        setSiteVisits(prev => 
          prev.map(visit => 
            visit._id === visitId 
              ? { ...visit, scheduled: currentStatus }
              : visit
          )
        );
        Alert.alert('Error', 'Failed to update status on server');
      }
      */
      
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Network error while updating status');
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    Alert.alert(
      'Delete Visit',
      'Are you sure you want to delete this site visit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(buildApiUrl(`/site-visits/${visitId}`), {
                method: 'DELETE',
              });

              if (response.ok) {
                setSiteVisits(prev => prev.filter(visit => visit._id !== visitId));
                Alert.alert('Success', 'Site visit deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete site visit');
              }
            } catch (error) {
              console.error('Error deleting visit:', error);
              Alert.alert('Error', 'Network error while deleting visit');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFilteredAndSortedVisits = () => {
    let filtered = siteVisits;

    // Apply filter
    switch (filter) {
      case 'scheduled':
        filtered = siteVisits.filter(visit => visit.scheduled);
        break;
      case 'pending':
        filtered = siteVisits.filter(visit => !visit.scheduled);
        break;
      default:
        filtered = siteVisits;
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'project':
        return filtered.sort((a, b) => a.projectName.localeCompare(b.projectName));
      case 'date':
      default:
        return filtered.sort((a, b) => new Date(b.timeOfVisit).getTime() - new Date(a.timeOfVisit).getTime());
    }
  };

  const filteredVisits = getFilteredAndSortedVisits();

  const renderVisitCard = (visit: SiteVisit) => (
    <View key={visit._id} style={styles.visitCard}>
      <View style={styles.cardHeader}>
        <View style={styles.nameSection}>
          <Text style={styles.visitName}>{visit.name}</Text>
          <Text style={styles.visitPhone}>{visit.phoneNumber}</Text>
        </View>
        <View style={styles.statusSection}>
          <TouchableOpacity
            style={[styles.statusBadge, visit.scheduled ? styles.scheduledBadge : styles.pendingBadge]}
            onPress={() => handleStatusToggle(visit._id, visit.scheduled)}
          >
            <Text style={styles.statusText}>
              {visit.scheduled ? 'Scheduled' : 'Pending'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="briefcase-outline" size={16} color="#7f8c8d" />
          <Text style={styles.detailText}>{visit.occupation}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#7f8c8d" />
          <Text style={styles.detailText}>{visit.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={16} color="#7f8c8d" />
          <Text style={styles.detailText}>{visit.projectName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#7f8c8d" />
          <Text style={styles.detailText}>{formatDate(visit.timeOfVisit)}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {!visit.scheduled && (
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={() => handleStatusToggle(visit._id, visit.scheduled)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.scheduleButtonText}>Schedule</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Edit', 'Edit functionality coming soon')}
        >
          <Ionicons name="create-outline" size={20} color="#FADB43" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteVisit(visit._id)}
        >
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Desk Panel</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{siteVisits.length}</Text>
          <Text style={styles.statLabel}>Total Visits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {siteVisits.filter(v => v.scheduled).length}
          </Text>
          <Text style={styles.statLabel}>Scheduled</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {siteVisits.filter(v => !v.scheduled).length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'scheduled' && styles.activeFilter]}
            onPress={() => setFilter('scheduled')}
          >
            <Text style={[styles.filterText, filter === 'scheduled' && styles.activeFilterText]}>
              Scheduled
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>
              Pending
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const options = ['date', 'name', 'project'];
            const currentIndex = options.indexOf(sortBy);
            const nextIndex = (currentIndex + 1) % options.length;
            setSortBy(options[nextIndex] as 'date' | 'name' | 'project');
          }}
        >
          <Ionicons name="funnel-outline" size={20} color="#2c3e50" />
          <Text style={styles.sortText}>
            Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FADB43" />
            <Text style={styles.loadingText}>Loading site visits...</Text>
          </View>
        ) : filteredVisits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyTitle}>No Site Visits</Text>
            <Text style={styles.emptyText}>
              {filter === 'all' 
                ? 'No site visits found. Add some visits to get started!'
                : `No ${filter} visits found.`
              }
            </Text>
          </View>
        ) : (
          <View style={styles.visitsList}>
            {filteredVisits.map(renderVisitCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  refreshButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f1f2f6',
  },
  activeFilter: {
    backgroundColor: '#FADB43',
  },
  filterText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  activeFilterText: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f2f6',
    borderRadius: 20,
  },
  sortText: {
    fontSize: 12,
    color: '#2c3e50',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7f8c8d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  visitsList: {
    paddingVertical: 8,
  },
  visitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameSection: {
    flex: 1,
  },
  visitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  visitPhone: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statusSection: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scheduledBadge: {
    backgroundColor: '#d4edda',
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 8,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  deleteButton: {
    // Additional styling if needed
  },
  actionText: {
    fontSize: 12,
    color: '#FADB43',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#e74c3c',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  scheduleButtonText: {
    fontSize: 12,
    color: '#ffffff',
    marginLeft: 4,
    fontWeight: 'bold',
  },
});

export default DeskPanelScreen; 