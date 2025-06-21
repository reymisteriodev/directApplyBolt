import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useJobs } from '../contexts/JobContext';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;
const CARD_HEIGHT = height * 0.7;

const SwipeScreen: React.FC = () => {
  const { getCurrentJob, swipeRight, swipeLeft, jobs, currentJobIndex } = useJobs();
  const [showDetails, setShowDetails] = useState(false);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const currentJob = getCurrentJob();

  useEffect(() => {
    // Reset animations when job changes
    position.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    opacity.setValue(1);
    scale.setValue(1);
    setShowDetails(false);
  }, [currentJobIndex]);

  const resetPosition = () => {
    Animated.parallel([
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(rotate, {
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? width + 100 : -width - 100;
    
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    if (!currentJob) return;
    
    if (direction === 'right') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      swipeRight(currentJob.id);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      swipeLeft(currentJob.id);
    }
    
    // Reset for next card
    position.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    opacity.setValue(1);
    scale.setValue(1);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: false,
      }).start();
    },
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
      
      const rotateValue = gesture.dx * 0.1;
      rotate.setValue(rotateValue);
    },
    onPanResponderRelease: (event, gesture) => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: false,
      }).start();

      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
  });

  const getCardStyle = () => {
    const rotateStr = rotate.interpolate({
      inputRange: [-500, 0, 500],
      outputRange: ['-30deg', '0deg', '30deg'],
    });

    return {
      ...position.getLayout(),
      transform: [
        { rotate: rotateStr },
        { scale: scale },
      ],
      opacity,
    };
  };

  const getLikeOpacity = () => {
    return position.x.interpolate({
      inputRange: [0, 150],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  };

  const getNopeOpacity = () => {
    return position.x.interpolate({
      inputRange: [-150, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
  };

  const handleSuperApply = () => {
    Alert.alert(
      'Super Apply! ⭐',
      'This premium feature makes your application stand out. Upgrade to Pro to use Super Apply.',
      [{ text: 'OK' }]
    );
  };

  const renderJobCard = () => {
    if (!currentJob) {
      return (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsIcon}>🎉</Text>
          <Text style={styles.noMoreCardsTitle}>No More Jobs!</Text>
          <Text style={styles.noMoreCardsText}>
            You've seen all available jobs. Check back later for new opportunities!
          </Text>
          <TouchableOpacity style={styles.refreshButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              style={styles.refreshButtonGradient}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Animated.View
        style={[styles.card, getCardStyle()]}
        {...panResponder.panHandlers}
      >
        {/* Like/Nope Overlays */}
        <Animated.View style={[styles.likeOverlay, { opacity: getLikeOpacity() }]}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.overlayGradient}
          >
            <Text style={styles.overlayText}>APPLY</Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View style={[styles.nopeOverlay, { opacity: getNopeOpacity() }]}>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.overlayGradient}
          >
            <Text style={styles.overlayText}>PASS</Text>
          </LinearGradient>
        </Animated.View>

        {/* Card Header */}
        <LinearGradient
          colors={currentJob.isVerified ? ['#10B981', '#059669'] : ['#F59E0B', '#D97706']}
          style={styles.cardHeader}
        >
          <View style={styles.companyInfo}>
            <Text style={styles.companyLogo}>{currentJob.logo}</Text>
            <View style={styles.companyDetails}>
              <Text style={styles.companyName}>{currentJob.company}</Text>
              <View style={styles.verificationBadge}>
                <Ionicons 
                  name={currentJob.isVerified ? "shield-checkmark" : "warning"} 
                  size={14} 
                  color="white" 
                />
                <Text style={styles.verificationText}>
                  {currentJob.isVerified ? 'Verified' : 'Unverified'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.matchScore}>
            <Text style={styles.matchScoreText}>{currentJob.matchScore}%</Text>
            <Text style={styles.matchLabel}>MATCH</Text>
          </View>
        </LinearGradient>

        {/* Card Body */}
        <View style={styles.cardBody}>
          <Text style={styles.jobTitle}>{currentJob.title}</Text>
          
          <View style={styles.jobDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{currentJob.location}</Text>
              {currentJob.remote && (
                <Text style={styles.remoteTag}>• Remote</Text>
              )}
            </View>
            
            {currentJob.salary && (
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{currentJob.salary}</Text>
              </View>
            )}
          </View>

          <View style={styles.skillsContainer}>
            <Text style={styles.skillsTitle}>Top 3 Matching Skills:</Text>
            <View style={styles.skillsList}>
              {currentJob.skills.slice(0, 3).map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => setShowDetails(!showDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.detailsButtonText}>
              {showDetails ? 'Hide Details' : 'View Details'}
            </Text>
            <Ionicons 
              name={showDetails ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#FF6B35" 
            />
          </TouchableOpacity>

          {showDetails && (
            <View style={styles.jobDescription}>
              <Text style={styles.descriptionText}>{currentJob.description}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DirectApply</Text>
        <Text style={styles.headerSubtitle}>
          {currentJobIndex + 1} of {jobs.length} jobs
        </Text>
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {/* Background Cards for Depth */}
        {jobs.slice(currentJobIndex + 1, currentJobIndex + 3).map((job, index) => (
          <View
            key={job.id}
            style={[
              styles.backgroundCard,
              {
                transform: [
                  { scale: 1 - (index + 1) * 0.05 },
                  { translateY: (index + 1) * 10 },
                ],
                opacity: 1 - (index + 1) * 0.3,
              },
            ]}
          >
            <View style={styles.backgroundCardContent}>
              <Text style={styles.backgroundCardTitle}>{job.title}</Text>
              <Text style={styles.backgroundCardCompany}>{job.company}</Text>
            </View>
          </View>
        ))}
        
        {/* Main Card */}
        {renderJobCard()}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton]}
          onPress={() => currentJob && forceSwipe('left')}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.superButton]}
          onPress={handleSuperApply}
          activeOpacity={0.8}
        >
          <Ionicons name="star" size={25} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.applyButton]}
          onPress={() => currentJob && forceSwipe('right')}
          activeOpacity={0.8}
        >
          <Ionicons name="heart" size={30} color="white" />
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
    paddingHorizontal: 20,
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
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: width - 40,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    position: 'absolute',
  },
  backgroundCard: {
    width: width - 40,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'absolute',
  },
  backgroundCardContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backgroundCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  backgroundCardCompany: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  likeOverlay: {
    position: 'absolute',
    top: 100,
    left: 20,
    zIndex: 1000,
    borderRadius: 16,
    transform: [{ rotate: '-20deg' }],
  },
  nopeOverlay: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 1000,
    borderRadius: 16,
    transform: [{ rotate: '20deg' }],
  },
  overlayGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyLogo: {
    fontSize: 40,
    marginRight: 16,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  verificationText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  matchScore: {
    alignItems: 'center',
  },
  matchScoreText: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  matchLabel: {
    fontSize: 10,
    color: 'white',
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardBody: {
    flex: 1,
    padding: 24,
  },
  jobTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  jobDetails: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  remoteTag: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  skillsContainer: {
    marginBottom: 24,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
  },
  detailsButtonText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    marginRight: 6,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  jobDescription: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
  },
  descriptionText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  passButton: {
    backgroundColor: '#EF4444',
  },
  superButton: {
    backgroundColor: '#8B5CF6',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  applyButton: {
    backgroundColor: '#10B981',
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noMoreCardsIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  noMoreCardsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  noMoreCardsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  refreshButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  refreshButtonGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});

export default SwipeScreen;