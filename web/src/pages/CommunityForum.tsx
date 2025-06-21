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
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          user_profiles!inner(cv_data)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'trending') {
        query = query.order('like_count', { ascending: false });
      }

      const { data: postsData, error } = await query;

      if (error) throw error;

      // Get user likes for posts
      const postIds = postsData?.map(p => p.id) || [];
      const { data: likesData } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user?.id)
        .in('post_id', postIds);

      const likedPostIds = new Set(likesData?.map(l => l.post_id) || []);

      const formattedPosts: Post[] = postsData?.map(post => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        updated_at: post.updated_at,
        like_count: post.like_count,
        comment_count: post.comment_count,
        user_id: post.user_id,
        user_name: getUserName(post.user_profiles?.cv_data, post.user_id),
        user_email: post.user_profiles?.cv_data?.personalInfo?.email || 'Unknown',
        is_liked: likedPostIds.has(post.id)
      })) || [];

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (cvData: any, userId: string) => {
    if (cvData?.personalInfo?.fullName) {
      return cvData.personalInfo.fullName;
    }
    return `User ${userId.slice(0, 8)}`;
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;

    setIsPosting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content: newPostContent.trim(),
          user_id: user.id
        });

      if (error) throw error;

      setNewPostContent('');
      toast.success('Post created successfully!');
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }

      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !isLiked,
              like_count: isLiked ? post.like_count - 1 : post.like_count + 1
            }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select(`
          *,
          user_profiles!inner(cv_data)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedComments: Comment[] = commentsData?.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user_id: comment.user_id,
        user_name: getUserName(comment.user_profiles?.cv_data, comment.user_id),
        user_email: comment.user_profiles?.cv_data?.personalInfo?.email || 'Unknown',
        parent_comment_id: comment.parent_comment_id
      })) || [];

      setComments(prev => ({ ...prev, [postId]: formattedComments }));
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
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
    if (!content || !user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          content,
          user_id: user.id
        });

      if (error) throw error;

      setNewComments(prev => ({ ...prev, [postId]: '' }));
      loadComments(postId);
      
      // Update comment count in posts
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comment_count: post.comment_count + 1 }
          : post
      ));
      
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
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
              { label: 'Posts Today', value: '156', icon: MessageSquare, color: 'bg-green-100 text-green-600' },
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
                {user ? getInitials(user.user_metadata?.first_name + ' ' + user.user_metadata?.last_name || user.email || 'U') : 'U'}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts, ask questions, or celebrate your wins..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Share your experience</span>
                  </span>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isPosting}
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
                              {user ? getInitials(user.user_metadata?.first_name + ' ' + user.user_metadata?.last_name || user.email || 'U') : 'U'}
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
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!newComments[post.id]?.trim()}
                                className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                          {comments[post.id]?.map((comment) => (
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
                          ))}
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