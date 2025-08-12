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
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { buildApiUrl, initializeApi } from './config/api';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  featured: boolean;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  price: {
    min: number;
    max: number;
    currency: string;
  };
  area: {
    min: number;
    max: number;
    unit: string;
  };
  bedrooms: {
    min: number;
    max: number;
  };
  images: Array<{
    url: string;
    caption?: string;
  }>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsScreenProps {
  onNavigateBack: () => void;
}

function ProjectsScreen({ onNavigateBack }: ProjectsScreenProps): React.JSX.Element {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'featured'>('all');

  useEffect(() => {
    console.log('🚀 ProjectsScreen mounted');
    initializeApi().then(() => {
      console.log('🌐 Current API URL:', buildApiUrl('/projects'));
      fetchProjects();
    });
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const url = buildApiUrl('/projects');
      console.log('🔗 Fetching projects from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Raw response data:', data);
        console.log('📦 Projects array:', data.projects || data);
        console.log('📦 Number of projects:', (data.projects || data).length);
        
        setProjects(data.projects || data);
        console.log('✅ Successfully set projects in state');
        console.log('📋 Sample project data:', (data.projects || data)[0]);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch projects. Status:', response.status);
        console.error('❌ Error response:', errorText);
        Alert.alert('Error', `Failed to load projects: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Network error fetching projects:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Network error while loading projects: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  const formatPrice = (price: Project['price']) => {
    if (!price) return 'Price not available';
    const min = price.min?.toLocaleString() || '0';
    const max = price.max?.toLocaleString() || '0';
    const currency = price.currency || 'INR';
    return `${currency} ${min} - ${max}`;
  };

  const formatArea = (area: Project['area']) => {
    if (!area) return 'Area not available';
    const min = area.min?.toLocaleString() || '0';
    const max = area.max?.toLocaleString() || '0';
    const unit = area.unit || 'sqft';
    return `${min} - ${max} ${unit}`;
  };

  const getFilteredProjects = () => {
    console.log('🔍 Filtering projects. Current filter:', filter);
    console.log('🔍 Total projects in state:', projects.length);
    
    let filtered;
    switch (filter) {
      case 'active':
        filtered = projects.filter(p => p.status === 'active');
        break;
      case 'featured':
        filtered = projects.filter(p => p.featured);
        break;
      default:
        filtered = projects;
    }
    
    console.log('🔍 Filtered projects count:', filtered.length);
    return filtered;
  };

  const renderProjectCard = (project: Project) => (
    <View key={project._id} style={styles.projectCard}>
      {/* Project Image */}
      {project.images && project.images.length > 0 && (
        <Image
          source={{ uri: buildApiUrl(project.images[0].url) }}
          style={styles.projectImage}
          resizeMode="cover"
        />
      )}
      
      {/* Project Info */}
      <View style={styles.projectInfo}>
        <View style={styles.projectHeader}>
          <Text style={styles.projectName}>{project.name}</Text>
          {project.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color="#FADB43" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.projectDescription} numberOfLines={2}>
          {project.description || 'No description available'}
        </Text>
        
        <View style={styles.projectDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#7f8c8d" />
            <Text style={styles.detailText}>
              {project.location?.city || 'N/A'}, {project.location?.state || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color="#7f8c8d" />
            <Text style={styles.detailText}>
              {formatPrice(project.price)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="resize-outline" size={16} color="#7f8c8d" />
            <Text style={styles.detailText}>
              {formatArea(project.area)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="bed-outline" size={16} color="#7f8c8d" />
            <Text style={styles.detailText}>
              {project.bedrooms?.min || 'N/A'} - {project.bedrooms?.max || 'N/A'} BHK
            </Text>
          </View>
        </View>
        
        <View style={styles.projectStatus}>
          <View style={[styles.statusBadge, { backgroundColor: project.status === 'active' ? '#d4edda' : '#fff3cd' }]}>
            <Text style={[styles.statusText, { color: project.status === 'active' ? '#155724' : '#856404' }]}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const filteredProjects = getFilteredProjects();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Projects</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.debugButton} onPress={() => {
          console.log('🔧 Debug info:');
          console.log('🔧 API URL:', buildApiUrl('/projects'));
          console.log('🔧 Projects in state:', projects.length);
          console.log('🔧 Current filter:', filter);
          Alert.alert('Debug Info', `API: ${buildApiUrl('/projects')}\nProjects: ${projects.length}\nFilter: ${filter}`);
        }}>
          <Ionicons name="bug-outline" size={20} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{projects.length}</Text>
          <Text style={styles.statLabel}>Total Projects</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {projects.filter(p => p.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {projects.filter(p => p.featured).length}
          </Text>
          <Text style={styles.statLabel}>Featured</Text>
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
            style={[styles.filterButton, filter === 'active' && styles.activeFilter]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.filterText, filter === 'active' && styles.activeFilterText]}>
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'featured' && styles.activeFilter]}
            onPress={() => setFilter('featured')}
          >
            <Text style={[styles.filterText, filter === 'featured' && styles.activeFilterText]}>
              Featured
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
            <Text style={styles.loadingText}>Loading projects...</Text>
          </View>
        ) : filteredProjects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyTitle}>No Projects</Text>
            <Text style={styles.emptyText}>
              {filter === 'all' 
                ? 'No projects found. Add some projects to get started!'
                : `No ${filter} projects found.`
              }
            </Text>
          </View>
        ) : (
          <View style={styles.projectsList}>
            {filteredProjects.map(renderProjectCard)}
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
  debugButton: {
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
  projectsList: {
    paddingVertical: 8,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: 200,
  },
  projectInfo: {
    padding: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  featuredText: {
    fontSize: 10,
    color: '#856404',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 20,
  },
  projectDetails: {
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
  projectStatus: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProjectsScreen; 