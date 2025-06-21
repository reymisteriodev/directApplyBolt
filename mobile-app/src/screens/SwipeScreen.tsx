import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useJobs } from '../contexts/JobContext';

const { width, height } = Dimensions.get('window');

const SwipeScreen: React.FC = () => {
  const { getCurrentJob, swipeRight, swipeLeft, jobs, currentJobIndex } = useJobs();
  const currentJob = getCurrentJob();

  const handleSwipeRight = () => {
    if (currentJob) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      swipeRight(currentJob.id);
    }
  };

  const handleSwipeLeft = () => {
    if (currentJob) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      swipeLeft(currentJob.id);
    }
  };

  if (!currentJob) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noMoreJobs}>
          <Text style={styles.noMoreJobsIcon}>🎉</Text>
          <Text style={styles.noMoreJobsTitle}>No More Jobs!</Text>
          <Text style={styles.noMoreJobsText}>
            You've seen all available jobs. Check back later!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DirectApply</Text>
        <Text style={styles.headerSubtitle}>
          {currentJobIndex + 1} of {jobs.length} jobs
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <LinearGradient
            colors={currentJob.isVerified ? ['#10B981', '#059669'] : ['#F59E0B', '#D97706']}
            style={styles.cardHeader}
          >
            <View style={styles.companyInfo}>
              <Text style={styles.companyLogo}>{currentJob.logo}</Text>
              <View style={styles.companyDetails}>
                <Text style={styles.companyName}>{currentJob.company}</Text>
                <Text style={styles.verificationText}>
                  {currentJob.isVerified ? '🛡️ Verified' : '⚠️ Unverified'}
                </Text>
              </View>
            </View>
            
            <View style={styles.matchScore}>
              <Text style={styles.matchScoreText}>{currentJob.matchScore}%</Text>
              <Text style={styles.matchLabel}>MATCH</Text>
            </View>
          </LinearGradient>

          <View style={styles.cardBody}>
            <Text style={styles.jobTitle}>{currentJob.title}</Text>
            
            <View style={styles.jobDetails}>
              <Text style={styles.detailText}>📍 {currentJob.location}</Text>
              {currentJob.salary && (
                <Text style={styles.detailText}>💰 {currentJob.salary}</Text>
              )}
              {currentJob.remote && (
                <Text style={styles.remoteTag}>🌐 Remote</Text>
              )}
            </View>

            <View style={styles.skillsContainer}>
              <Text style={styles.skillsTitle}>Top Skills:</Text>
              <View style={styles.skillsList}>
                {currentJob.skills.slice(0, 3).map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.description}>{currentJob.description}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton]}
          onPress={handleSwipeLeft}
        >
          <Text style={styles.actionButtonText}>❌</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.applyButton]}
          onPress={handleSwipeRight}
        >
          <Text style={styles.actionButtonText}>❤️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: width - 40,
    height: height * 0.65,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyLogo: {
    fontSize: 40,
    marginRight: 15,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  verificationText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  matchScore: {
    alignItems: 'center',
  },
  matchScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  matchLabel: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  cardBody: {
    flex: 1,
    padding: 20,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  jobDetails: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  remoteTag: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  skillsContainer: {
    marginBottom: 20,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    gap: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#EF4444',
  },
  applyButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    fontSize: 24,
  },
  noMoreJobs: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noMoreJobsIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  noMoreJobsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  noMoreJobsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SwipeScreen;