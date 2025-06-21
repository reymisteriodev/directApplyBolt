import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useJobs } from '../contexts/JobContext';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'applied' | 'viewed' | 'in-review' | 'interview' | 'rejected' | 'offered';
  logo: string;
  isVerified: boolean;
  matchScore: number;
}

const MatchesScreen: React.FC = () => {
  const { applications, jobs } = useJobs();
  const [refreshing, setRefreshing] = useState(false);

  // Create application objects from applied job IDs
  const appliedJobs: Application[] = applications.map(jobId => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return null;
    
    return {
      id: jobId,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toLocaleDateString(),
      status: 'applied' as const,
      logo: job.logo,
      isVerified: job.isVerified,
      matchScore: job.matchScore,
    };
  }).filter(Boolean) as Application[];

  // Add some mock applications for demo
  const mockApplications: Application[] = [
    {
      id: 'mock-1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      appliedDate: new Date(Date.now() - 86400000).toLocaleDateString(),
      status: 'in-review',
      logo: '🚀',
      isVerified: true,
      matchScore: 92,
    },
    {
      id: 'mock-2',
      jobTitle: 'Product Manager',
      company: 'StartupXYZ',
      appliedDate: new Date(Date.now() - 172800000).toLocaleDateString(),
      status: 'viewed',
      logo: '💼',
      isVerified: false,
      matchScore: 78,
    },
    {
      id: 'mock-3',
      jobTitle: 'UX Designer',
      company: 'Design Studio Pro',
      appliedDate: new Date(Date.now() - 259200000).toLocaleDateString(),
      status: 'interview',
      logo: '🎨',
      isVerified: true,
      matchScore: 85,
    },
  ];

  const allApplications = [...appliedJobs, ...mockApplications];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return ['#F59E0B', '#D97706'];
      case 'viewed': return ['#3B82F6', '#2563EB'];
      case 'in-review': return ['#8B5CF6', '#7C3AED'];
      case 'interview': return ['#10B981', '#059669'];
      case 'rejected': return ['#EF4444', '#DC2626'];
      case 'offered': return ['#059669', '#047857'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'viewed': return 'Viewed';
      case 'in-review': return 'In Review';
      case 'interview': return 'Interview';
      case 'rejected': return 'Rejected';
      case 'offered': return 'Offered';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return 'paper-plane-outline';
      case 'viewed': return 'eye-outline';
      case 'in-review': return 'time-outline';
      case 'interview': return 'people-outline';
      case 'rejected': return 'close-circle-outline';
      case 'offered': return 'checkmark-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderApplicationItem = ({ item }: { item: Application }) => (
    <TouchableOpacity style={styles.applicationCard} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.companyInfo}>
          <View style={styles.logoContainer}>
            <Text style={styles.companyLogo}>{item.logo}</Text>
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{item.jobTitle}</Text>
            <View style={styles.companyRow}>
              <Text style={styles.companyName}>{item.company}</Text>
              {item.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#10B981" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.matchScore}>{item.matchScore}% Match</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <LinearGradient
            colors={getStatusColor(item.status)}
            style={styles.statusBadge}
          >
            <Ionicons 
              name={getStatusIcon(item.status) as any} 
              size={14} 
              color="white" 
            />
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </LinearGradient>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.dateInfo}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text style={styles.dateText}>Applied {item.appliedDate}</Text>
        </View>
        
        {item.isVerified && (
          <View style={styles.guaranteeInfo}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.guaranteeText}>Response Guaranteed</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📱</Text>
      <Text style={styles.emptyTitle}>No Applications Yet</Text>
      <Text style={styles.emptyText}>
        Start swiping right on jobs you like to see your applications here!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Text style={styles.headerSubtitle}>{allApplications.length} applications</Text>
      </View>

      <FlatList
        data={allApplications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#FF6B35"
            colors={['#FF6B35']}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  applicationCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  companyLogo: {
    fontSize: 24,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  matchScore: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  guaranteeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guaranteeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});

export default MatchesScreen;