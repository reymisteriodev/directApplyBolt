import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useJobs } from '../contexts/JobContext';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

const SwipeScreen: React.FC = () => {
  const { getCurrentJob, swipeRight, swipeLeft, jobs, currentJobIndex } = useJobs();
  const [showDetails, setShowDetails] = useState(false);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const currentJob = getCurrentJob();

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
    
    Animated.spring(rotate, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? width + 100 : -width - 100;
    
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
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
    
    position.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    opacity.setValue(1);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
      
      const rotateValue = gesture.dx * 0.1;
      rotate.setValue(rotateValue);
    },
    onPanResponderRelease: (event, gesture) => {
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
      transform: [{ rotate: rotateStr }],
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
      'This is a premium feature that makes your application stand out. Upgrade to Pro to use Super Apply.',
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
          <TouchableOpacity style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
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
          <Text style={styles.likeText}>APPLY</Text>
        </Animated.View>
        
        <Animated.View style={[styles.nopeOverlay, { opacity: getNopeOpacity() }]}>
          <Text style={styles.nopeText}>PASS</Text>
        </Animated.View>

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DirectApply Mobile</Text>
        <Text style={styles.headerSubtitle}>
          {currentJobIndex + 1} of {jobs.length} jobs
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {renderJobCard()}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton]}
          onPress={() => currentJob && forceSwipe('left')}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.superButton]}
          onPress={handleSuperApply}
        >
          <Ionicons name="star" size={25} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.applyButton]}
          onPress={() => currentJob && forceSwipe('right')}
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  likeOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: '-30deg' }],
  },
  likeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nopeOverlay: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: '30deg' }],
  },
  nopeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  verificationText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
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
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
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
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
    marginRight: 5,
  },
  jobDescription: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  descriptionText: {
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
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  passButton: {
    backgroundColor: '#EF4444',
  },
  superButton: {
    backgroundColor: '#8B5CF6',
    width: 50,
    height: 50,
    borderRadius: 25,
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
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  noMoreCardsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SwipeScreen;