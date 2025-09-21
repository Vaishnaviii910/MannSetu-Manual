import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/use-toast";

// Interfaces for our data structures
interface Forum {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Reply {
  reply_id: string;
  post_id: string;
  content: string;
  created_at: string;
  student_id: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
  is_anonymous?: boolean | null;
}

interface Post {
  post_id: string;
  id?: string; // original id field exists on DB rows
  title: string;
  content: string;
  created_at: string;
  student_id: string;
  forum_id: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
  // Extended fields:
  like_count?: number;
  reply_count?: number;
  liked_by_me?: boolean;
  replies?: Reply[];
  is_anonymous?: boolean | null;
}

interface StudentInfo {
  id: string;
  institute_id: string;
}

export const usePeerSupport = () => {
  const { user } = useAuth();
  const [forums, setForums] = useState<Forum[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  // Fetch student info
  useEffect(() => {
    if (user?.id) {
      const fetchStudentInfo = async () => {
        const { data, error } = await supabase
          .from("students")
          .select("id, institute_id")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching student info:", error);
        } else if (data) {
          setStudentInfo(data);
        }
      };
      fetchStudentInfo();
    }
  }, [user]);

  // Fetch forums
  const fetchForums = useCallback(async () => {
    if (!studentInfo) return;

    const { data, error } = await supabase
      .from("forums")
      .select("*")
      .eq("institute_id", studentInfo.institute_id);

    if (error) {
      console.error("Error fetching forums:", error);
      toast({
        title: "Error",
        description: "Could not fetch forums.",
        variant: "destructive",
      });
      setForums([]);
    } else {
      setForums((data as Forum[]) || []);
    }
  }, [studentInfo]);

  // Fetch posts + reaction counts + reply counts + whether current user reacted
  const fetchPosts = useCallback(async () => {
    if (!studentInfo) return;

    // get forum IDs for institute
    const { data: forumIds, error: forumIdError } = await supabase
      .from("forums")
      .select("id")
      .eq("institute_id", studentInfo.institute_id);

    if (forumIdError || !forumIds || forumIds.length === 0) {
      if (forumIdError) console.error("Error fetching forum IDs:", forumIdError);
      setPosts([]);
      return;
    }

    const ids = forumIds.map((f: any) => f.id);

    // Fetch posts
    const { data: postsData, error: postsError } = await supabase
      .from("forum_posts")
      .select("*")
      .in("forum_id", ids)
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      setPosts([]);
      return;
    }

    if (!postsData || postsData.length === 0) {
      setPosts([]);
      return;
    }

    const postIds = postsData.map((p: any) => p.id);

    // Fetch reactions for these posts
    const { data: reactionsData, error: reactionsError } = await supabase
      .from("forum_post_reactions")
      .select("post_id, user_id")
      .in("post_id", postIds);

    if (reactionsError) {
      console.error("Error fetching reactions:", reactionsError);
    }

    // Fetch replies for these posts (we will populate reply_count and optionally replies)
    const { data: repliesData, error: repliesError } = await supabase
      .from("forum_replies")
      .select("id, post_id, student_id, content, created_at, is_anonymous")
      .in("post_id", postIds)
      .order("created_at", { ascending: true });

    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
    }

    // Collect student ids needed to show names (from posts and replies)
    const studentIdsSet = new Set<string>();
    postsData.forEach((p: any) => studentIdsSet.add(p.student_id));
    (repliesData || []).forEach((r: any) => studentIdsSet.add(r.student_id));
    const studentIds = Array.from(studentIdsSet);

    let studentsData: any[] = [];
    if (studentIds.length > 0) {
      const { data: sd, error: studentsError } = await supabase
        .from("students")
        .select("id, full_name")
        .in("id", studentIds);

      if (studentsError) {
        console.error("Error fetching student authors:", studentsError);
      } else {
        studentsData = sd || [];
      }
    }

    const studentMap = new Map((studentsData || []).map((s: any) => [s.id, s.full_name]));

    // Build likes map and whether current user liked each post
    const likeCountMap = new Map<string, number>();
    const likedByMeSet = new Set<string>();
    (reactionsData || []).forEach((r: any) => {
      likeCountMap.set(r.post_id, (likeCountMap.get(r.post_id) || 0) + 1);
      if (user && r.user_id === user.id) likedByMeSet.add(r.post_id);
    });

    // Build replies grouped by post
    const repliesByPost = new Map<string, Reply[]>();
    (repliesData || []).forEach((r: any) => {
      const arr = repliesByPost.get(r.post_id) || [];
      arr.push({
        reply_id: r.id,
        post_id: r.post_id,
        content: r.content,
        created_at: r.created_at,
        student_id: r.student_id,
        is_anonymous: r.is_anonymous,
        profiles: {
          full_name: studentMap.get(r.student_id) || "Anonymous",
        },
      });
      repliesByPost.set(r.post_id, arr);
    });

    // Map posts into final shape
    const postsWithAuthors: Post[] = postsData.map((post: any) => {
      const repliesForPost = repliesByPost.get(post.id) || [];
      return {
        ...(post as any),
        post_id: post.id,
        profiles: {
          full_name: studentMap.get(post.student_id) || "Anonymous",
        },
        like_count: likeCountMap.get(post.id) || 0,
        reply_count: repliesForPost.length,
        liked_by_me: likedByMeSet.has(post.id),
        replies: repliesForPost,
      };
    });

    setPosts(postsWithAuthors);
  }, [studentInfo, user]);

  // Perform initial load
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      if (studentInfo) {
        await fetchForums();
        await fetchPosts();
      }
      setLoading(false);
    };
    initialize();
  }, [studentInfo, fetchForums, fetchPosts]);

  // Create post (unchanged)
  const createPost = async (title: string, content: string, forumId: string) => {
    if (!user || !studentInfo || !forumId) {
      toast({
        title: "Error",
        description: "Cannot create post. User not found or no forum selected.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("forum_posts").insert([
      {
        title,
        content,
        student_id: studentInfo.id,
        forum_id: forumId,
      },
    ]);

    if (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "New post created.",
      });
      await fetchPosts();
    }
  };

  // Toggle reaction (like/unlike)
  const toggleReaction = async (postId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to like posts.",
        variant: "destructive",
      });
      return;
    }

    // optimistic update
    const prev = posts.map((p) => ({ ...p }));
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.post_id === postId
          ? {
              ...p,
              liked_by_me: !p.liked_by_me,
              like_count: (p.like_count || 0) + (p.liked_by_me ? -1 : 1),
            }
          : p
      )
    );

    try {
      // Check existing reaction
      const { data: existing, error: checkError } = await supabase
        .from("forum_post_reactions")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing && existing.id) {
        // delete
        const { error: delError } = await supabase
          .from("forum_post_reactions")
          .delete()
          .eq("id", existing.id);

        if (delError) throw delError;
      } else {
        // insert
        const { error: insError } = await supabase
          .from("forum_post_reactions")
          .insert([{ post_id: postId, user_id: user.id }]);

        if (insError) throw insError;
      }
    } catch (err: any) {
      console.error("Error toggling reaction:", err);
      // rollback
      setPosts(prev);
      toast({
        title: "Action failed",
        description: "Could not toggle like. Try again.",
        variant: "destructive",
      });
    }
  };

  // Lazy fetch replies for a given post (used when user opens replies)
  const fetchReplies = useCallback(
    async (postId: string) => {
      if (!postId) return;

      const { data: repliesData, error } = await supabase
        .from("forum_replies")
        .select("id, post_id, student_id, content, created_at, is_anonymous")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching replies for post", postId, error);
        return;
      }

      const studentIds = [...new Set((repliesData || []).map((r: any) => r.student_id))];
      let studentsData: any[] = [];
      if (studentIds.length > 0) {
        const { data: sd, error: sErr } = await supabase
          .from("students")
          .select("id, full_name")
          .in("id", studentIds);

        if (sErr) {
          console.error("Error fetching reply authors", sErr);
        } else {
          studentsData = sd || [];
        }
      }
      const studentMap = new Map((studentsData || []).map((s: any) => [s.id, s.full_name]));

      const replies: Reply[] = (repliesData || []).map((r: any) => ({
        reply_id: r.id,
        post_id: r.post_id,
        content: r.content,
        created_at: r.created_at,
        student_id: r.student_id,
        is_anonymous: r.is_anonymous,
        profiles: { full_name: studentMap.get(r.student_id) || "Anonymous" },
      }));

      setPosts((prev) => prev.map((p) => (p.post_id === postId ? { ...p, replies, reply_count: replies.length } : p)));
    },
    [studentInfo]
  );

  // Create reply (optimistic)
  const createReply = async (postId: string, content: string, isAnonymous = false) => {
    if (!studentInfo) {
      toast({
        title: "Error",
        description: "You must be a student to reply.",
        variant: "destructive",
      });
      return;
    }
    if (!content || content.trim() === "") {
      toast({
        title: "Validation",
        description: "Reply cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const tempId = "temp-" + Date.now();
    const tempReply: Reply = {
      reply_id: tempId,
      post_id: postId,
      content,
      created_at: new Date().toISOString(),
      student_id: studentInfo.id,
      is_anonymous: isAnonymous,
      profiles: { full_name: "You" },
    };

    // optimistic append
    const prev = posts.map((p) => ({ ...p }));
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.post_id === postId
          ? { ...p, replies: [...(p.replies || []), tempReply], reply_count: (p.reply_count || 0) + 1 }
          : p
      )
    );

    try {
      const { data, error } = await supabase
        .from("forum_replies")
        .insert([{ post_id: postId, student_id: studentInfo.id, content, is_anonymous: isAnonymous }])
        .select()
        .single();

      if (error) throw error;

      // fetch full name for student (or try to get from posts' existing students)
      const { data: studentRow } = await supabase.from("students").select("id, full_name").eq("id", studentInfo.id).single();

      // replace temp reply with real reply
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.post_id === postId
            ? {
                ...p,
                replies: (p.replies || []).map((r) => (String(r.reply_id).startsWith("temp-") ? { reply_id: data.id, post_id: data.post_id, content: data.content, created_at: data.created_at, student_id: data.student_id, profiles: { full_name: studentRow?.full_name || "Anonymous" } } : r)),
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error creating reply:", err);
      // rollback
      setPosts(prev);
      toast({
        title: "Error",
        description: "Could not post reply. Try again.",
        variant: "destructive",
      });
    }
  };

  return {
    forums,
    posts,
    loading,
    createPost,
    toggleReaction,
    fetchReplies,
    createReply,
    fetchPosts,
  };
};
