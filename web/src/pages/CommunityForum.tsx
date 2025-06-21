import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Heart, 
  Send, 
  User, 
  Clock, 
  TrendingUp,
  Users,
  Award,
  Sparkles,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Reply,
  ThumbsUp,
  Share2,
  Bookmark,
  Flag
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';

interface Post {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  comment_count: number;
  user_id: string;
  user_name: string;
  user_email: string;
  is_liked: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name: string;
  user_email: string;
  parent_comment_id?: string;
  replies?: Comment[];
}

const CommunityForum: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [newComments, setNewComments] = useState<{ [postId: string]: string }>({});
  const [filter, setFilter] = useState('recent');

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user, filter]);

  const loadPosts = async () => {
    try {
      console.log('🔄 Loading posts from database...');
      setLoading(true);
      
      // Get posts with proper ordering
      let query = supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          updated_at,
          like_count,
          comment_count,
          user_id
        `);

      if (filter === 'trending') {
        query = query.order('like_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: postsData, error } = await query.limit(50);

      if (error) {
        console.error('❌ Error loading posts:', error);
        // If tables don't exist, show mock data for better UX
        if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
          console.log('📝 Database tables not found, showing mock data');
          loadMockPosts();
          return;
        }
        throw error;
      }

      console.log('✅ Posts loaded:', postsData?.length || 0);

      if (!postsData || postsData.length === 0) {
        // If no posts exist, show mock data for better UX
        loadMockPosts();
        return;
      }

      // Get user likes for posts if user is authenticated
      let likedPostIds = new Set<string>();
      if (user) {
        try {
          const postIds = postsData.map(p => p.id);
          const { data: likesData, error: likesError } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('user_id', user.id)
            .in('post_id', postIds);

          if (!likesError && likesData) {
            likedPostIds = new Set(likesData.map(l => l.post_id));
          }
        } catch (likesError) {
          console.warn('⚠️ Could not load user likes:', likesError);
        }
      }

      // Get user information
      const userIds = [...new Set(postsData.map(p => p.user_id))];
      
      let profilesMap = new Map();
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('user_profiles')
          .select('user_id, cv_data')
          .in('user_id', userIds);

        if (!profilesError && profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.user_id, profile.cv_data);
          });
        }
      } catch (profilesError) {
        console.warn('⚠️ Could not load user profiles:', profilesError);
      }

      // Format posts with user information
      const formattedPosts: Post[] = postsData.map(post => {
        const userProfile = profilesMap.get(post.user_id);
        return {
          id: post.id,
          content: post.content,
          created_at: post.created_at,
          updated_at: post.updated_at,
          like_count: post.like_count || 0,
          comment_count: post.comment_count || 0,
          user_id: post.user_id,
          user_name: getUserName(userProfile, post.user_id),
          user_email: userProfile?.personalInfo?.email || 'user@example.com',
          is_liked: likedPostIds.has(post.id)
        };
      });

      setPosts(formattedPosts);
    } catch (error) {
      console.error('💥 Error loading posts:', error);
      // Fallback to mock data if real data fails
      loadMockPosts();
    } finally {
      setLoading(false);
    }
  };

  const loadMockPosts = () => {
    console.log('📝 Loading mock posts for demonstration');
    const mockPosts: Post[] = [
      {
        id: 'mock-1',
        content: "Just landed my dream job at a tech startup! 🎉 The interview process was intense but the DirectApply platform really helped me prepare. Thanks to everyone in this community for the support and advice!",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        like_count: 24,
        comment_count: 8,
        user_id: 'mock-user-1',
        user_name: 'Sarah Chen',
        user_email: 'sarah@example.com',
        is_liked: false
      },
      {
        id: 'mock-2',
        content: "Has anyone here successfully negotiated their salary? I have an offer but I think I can get more. Looking for tips on how to approach this conversation with HR. 💼",
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date(Date.now() - 7200000).toISOString(),
        like_count: 12,
        comment_count: 15,
        user_id: 'mock-user-2',
        user_name: 'Alex Rodriguez',
        user_email: 'alex@example.com',
        is_liked: true
      },
      {
        id: 'mock-3',
        content: "Quick tip for everyone: Always research the company culture before your interview. I just had an amazing conversation with my interviewer about their values and it really set me apart from other candidates. 🌟",
        created_at: new Date(Date.now() - 10800000).toISOString(),
        updated_at: new Date(Date.now() - 10800000).toISOString(),
        like_count: 31,
        comment_count: 6,
        user_id: 'mock-user-3',
        user_name: 'Jordan Kim',
        user_email: 'jordan@example.com',
        is_liked: false
      },
      {
        id: 'mock-4',
        content: "Feeling a bit discouraged after 3 rejections this week. How do you all stay motivated during the job search? Any advice would be appreciated. 😔",
        created_at: new Date(Date.now() - 14400000).toISOString(),
        updated_at: new Date(Date.now() - 14400000).toISOString(),
        like_count: 18,
        comment_count: 22,
        user_id: 'mock-user-4',
        user_name: 'Taylor Johnson',
        user_email: 'taylor@example.com',
        is_liked: false
      }
    ];

    setPosts(mockPosts);
    setLoading(false);
  };

  const getUserName = (cvData: any, userId: string) => {
    // First try to get name from CV data
    if (cvData?.personalInfo?.fullName) {
      return cvData.personalInfo.fullName;
    }
    
    // If it's the current user, try to get from user metadata
    if (user && userId === user.id) {
      const firstName = user.user_metadata?.first_name || '';
      const lastName = user.user_metadata?.last_name || '';
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }
      // Fallback to email username
      if (user.email) {
        return user.email.split('@')[0];
      }
      return 'You';
    }
    
    // For other users, create a friendly anonymous name
    return `User ${userId.slice(0, 8)}`;
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error('Please write something before posting');
      return;
    }

    if (!user) {
      toast.error('Please sign in to create posts');
      return;
    }

    if (newPostContent.length > 1000) {
      toast.error('Post is too long. Maximum 1000 characters allowed.');
      return;
    }

    setIsPosting(true);
    try {
      console.log('📝 Creating post...');
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPostContent.trim(),
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating post:', error);
        if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
          toast.error('Community forum is not set up yet. Please contact support.');
          return;
        }
        throw error;
      }

      console.log('✅ Post created:', data);
      setNewPostContent('');
      toast.success('Post created successfully!');
      
      // Add the new post to the beginning of the list
      const newPost: Post = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at,
        like_count: 0,
        comment_count: 0,
        user_id: data.user_id,
        user_name: getUserName(null, user.id),
        user_email: user.email || '',
        is_liked: false
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
    } catch (error) {
      console.error('💥 Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    // Optimistically update UI first
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            is_liked: !isLiked,
            like_count: isLiked ? Math.max(0, post.like_count - 1) : post.like_count + 1
          }
        : post
    ));

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('💥 Error toggling like:', error);
      // Revert optimistic update on error
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: isLiked,
              like_count: isLiked ? post.like_count + 1 : Math.max(0, post.like_count - 1)
            }
          : post
      ));
      
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        toast.error('Community forum is not set up yet. Please contact support.');
      } else {
        toast.error('Failed to update like');
      }
    }
  };

  const loadComments = async (postId: string) => {
    try {
      console.log('💬 Loading comments for post:', postId);
      
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error loading comments:', error);
        if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
          // Set empty comments array for mock posts
          setComments(prev => ({ ...prev, [postId]: [] }));
          return;
        }
        throw error;
      }

      if (!commentsData || commentsData.length === 0) {
        setComments(prev => ({ ...prev, [postId]: [] }));
        return;
      }

      // Get user profiles for comment authors
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      
      let profilesMap = new Map();
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('user_profiles')
          .select('user_id, cv_data')
          .in('user_id', userIds);

        if (!profilesError && profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.user_id, profile.cv_data);
          });
        }
      } catch (profilesError) {
        console.warn('⚠️ Could not load comment author profiles:', profilesError);
      }

      const formattedComments: Comment[] = commentsData.map(comment => {
        const userProfile = profilesMap.get(comment.user_id);
        return {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user_id: comment.user_id,
          user_name: getUserName(userProfile, comment.user_id),
          user_email: userProfile?.personalInfo?.email || 'user@example.com',
          parent_comment_id: comment.parent_comment_id
        };
      });

      setComments(prev => ({ ...prev, [postId]: formattedComments }));
    } catch (error) {
      console.error('💥 Error loading comments:', error);
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
  };

  const handleToggleComments = (postId: string) => {
    const isExpanded = expandedComments.has(postId);
    
    if (isExpanded) {
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      setExpandedComments(prev => new Set(prev).add(postId));
      if (!comments[postId]) {
        loadComments(postId);
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    const content = newComments[postId]?.trim();
    if (!content) {
      toast.error('Please write a comment');
      return;
    }

    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (content.length > 500) {
      toast.error('Comment is too long. Maximum 500 characters allowed.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          content,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
          toast.error('Community forum is not set up yet. Please contact support.');
          return;
        }
        throw error;
      }

      setNewComments(prev => ({ ...prev, [postId]: '' }));
      
      // Add comment to local state
      const newComment: Comment = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        user_id: data.user_id,
        user_name: getUserName(null, user.id),
        user_email: user.email || '',
        parent_comment_id: data.parent_comment_id
      };
      
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      
      // Update comment count in posts
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comment_count: post.comment_count + 1 }
          : post
      ));
      
      toast.success('Comment added!');
    } catch (error) {
      console.error('💥 Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Show authentication required message if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType="seeker" isAuthenticated={false} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to access the Community Forum</h3>
            <p className="text-gray-600 mb-6">Connect with other job seekers and share your experiences</p>
            <button
              onClick={() => window.location.href = '/seeker/login'}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="seeker" isAuthenticated={true} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Users className="w-8 h-8 text-orange-500" />
                <span>Community Forum</span>
              </h1>
              <p className="text-gray-600 mt-2">Connect, share, and support each other in your career journey</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setFilter('recent')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'recent' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Clock className="w-4 h-4 mr-2 inline" />
                  Recent
                </button>
                <button
                  onClick={() => setFilter('trending')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'trending' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mr-2 inline" />
                  Trending
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Active Members', value: '2,847', icon: Users, color: 'bg-blue-100 text-blue-600' },
              { label: 'Posts Today', value: posts.length.toString(), icon: MessageSquare, color: 'bg-green-100 text-green-600' },
              { label: 'Success Stories', value: '89', icon: Award, color: 'bg-purple-100 text-purple-600' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Create Post */}
        <motion.div 
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {getInitials(getUserName(null, user.id))}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts, ask questions, or celebrate your wins..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Share your experience</span>
                  </span>
                  <span className={newPostContent.length > 900 ? 'text-red-500 font-medium' : ''}>
                    {newPostContent.length}/1000
                  </span>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isPosting || newPostContent.length > 1000}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isPosting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isPosting ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Be the first to start a conversation!</p>
            </div>
          ) : (
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  layout
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {getInitials(post.user_name)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.user_name}</h3>
                        <p className="text-sm text-gray-500">{formatTimeAgo(post.created_at)}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-6">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLikePost(post.id, post.is_liked)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                          post.is_liked 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                        <span className="font-medium">{post.like_count}</span>
                      </button>
                      
                      <button
                        onClick={() => handleToggleComments(post.id)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">{post.comment_count}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">Share</span>
                      </button>
                    </div>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {expandedComments.has(post.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 border-t border-gray-100 pt-6"
                      >
                        {/* Add Comment */}
                        <div className="flex items-start space-x-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {getInitials(getUserName(null, user.id))}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={newComments[post.id] || ''}
                                onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                maxLength={500}
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!newComments[post.id]?.trim()}
                                className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                            {newComments[post.id] && (
                              <div className="mt-1 text-xs text-gray-500">
                                {newComments[post.id].length}/500
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                          {comments[post.id]?.length > 0 ? (
                            comments[post.id].map((comment) => (
                              <div key={comment.id} className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-xs">
                                    {getInitials(comment.user_name)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-medium text-gray-900 text-sm">{comment.user_name}</span>
                                      <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
                                    </div>
                                    <p className="text-gray-800 text-sm">{comment.content}</p>
                                  </div>
                                  <div className="flex items-center space-x-4 mt-2">
                                    <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                                      <ThumbsUp className="w-3 h-3" />
                                      <span>Like</span>
                                    </button>
                                    <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                                      <Reply className="w-3 h-3" />
                                      <span>Reply</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;