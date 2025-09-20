import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePeerSupport = () => {
  const { user } = useAuth();
  const [forums, setForums] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getForums = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: instituteForums } = await supabase
        .from('forums')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      setForums(instituteForums || []);
    } catch (error) {
      console.error('Error fetching forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const getForumPosts = async (forumId: string) => {
    try {
      setLoading(true);
      
      const { data: forumPosts } = await supabase
        .from('forum_posts')
        .select(`
          *,
          students (
            full_name
          )
        `)
        .eq('forum_id', forumId)
        .order('created_at', { ascending: false });

      setPosts(forumPosts || []);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPostReplies = async (postId: string) => {
    try {
      const { data: postReplies } = await supabase
        .from('forum_replies')
        .select(`
          *,
          students (
            full_name
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      setReplies(postReplies || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const createPost = async (forumId: string, title: string, content: string, isAnonymous: boolean = false) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Get student data
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!student) return { error: 'Student not found' };

      const { error } = await supabase
        .from('forum_posts')
        .insert({
          forum_id: forumId,
          student_id: student.id,
          title,
          content,
          is_anonymous: isAnonymous
        });

      if (!error) {
        getForumPosts(forumId); // Refresh posts
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const createReply = async (postId: string, content: string, isAnonymous: boolean = false) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Get student data
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!student) return { error: 'Student not found' };

      const { error } = await supabase
        .from('forum_replies')
        .insert({
          post_id: postId,
          student_id: student.id,
          content,
          is_anonymous: isAnonymous
        });

      if (!error) {
        getPostReplies(postId); // Refresh replies
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const createForum = async (title: string, description: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Get institute data
      const { data: institute } = await supabase
        .from('institutes')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!institute) return { error: 'Institute not found' };

      const { error } = await supabase
        .from('forums')
        .insert({
          institute_id: institute.id,
          title,
          description
        });

      if (!error) {
        getForums(); // Refresh forums
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  return {
    forums,
    posts,
    replies,
    loading,
    getForums,
    getForumPosts,
    getPostReplies,
    createPost,
    createReply,
    createForum
  };
};