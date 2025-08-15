"use client";
import React, {useState, useEffect, useRef, useCallback} from "react";
import axios from "axios";
import Hls from "hls.js";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaTimes,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import {useRouter} from "next/navigation";
import Cookie from "js-cookie";
import moment from "moment";

interface Video {
  id: string;
  title: string;
  description: string;
  user_id: string;
  username: string;
  video_url: string;
  hls_url: string;
  thumbnail_url: string;
  like_count: number;
  comment_count: number;
  views_count: number;
  created_at: string;
  is_liked: boolean;
}

interface Comment {
  id: string;
  user_id: string;
  username: string;
  comment_text: string;
  created_at: string;
}

const API_BASE =
  "https://clipwave-backend-fue2eyddgwd8akbw.uksouth-01.azurewebsites.net";

const HomeFeed: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const token = Cookie.get("token");
  const id = Cookie.get("id");
  const username = Cookie.get("username");

  // Add video ref to the array
  const addVideoRef = useCallback(
    (el: HTMLVideoElement | null, index: number) => {
      if (el) {
        videoRefs.current[index] = el;
      }
    },
    []
  );

  // Fetch initial videos
  useEffect(() => {
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    // Add this to your fetchVideos function
    const fetchVideos = async () => {
      try {
        const {data} = await axios.get(
          `${API_BASE}/users/videos/all?page=${page}&limit=5`,
          {headers: {Authorization: `Bearer ${token}`}}
        );

        // For each video, check if current user has liked it
        const videosWithLikes = await Promise.all(
          data.data.map(async (video: Video) => {
            try {
              const likeResponse = await axios.get(
                `${API_BASE}/users/likes/has-liked/${id}/${video.id}`,
                {headers: {Authorization: `Bearer ${token}`}}
              );
              return {
                ...video,
                is_liked: likeResponse.data.liked,
              };
            } catch (err) {
              console.error("Error checking like status:", err);
              return {
                ...video,
                is_liked: false,
              };
            }
          })
        );

        setVideos(videosWithLikes);
        setHasMore(data.data.length > 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [token]);

  // Load more videos when reaching bottom
  const loadMoreVideos = async () => {
    if (!hasMore || !token) return;

    try {
      const {data} = await axios.get(
        `${API_BASE}/users/videos/all?page=${page + 1}&limit=5`,
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );
      setVideos((prev) => [...prev, ...data.data]);
      setPage((prev) => prev + 1);
      setHasMore(data.data.length > 0);
    } catch (err) {
      console.error("Failed to load more videos:", err);
    }
  };

  // Handle scroll events for video switching
  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current || videos.length === 0) return;

      const videoElements =
        feedRef.current.querySelectorAll(".video-container");
      let newIndex = currentVideoIndex;

      videoElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const isHalfVisible =
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2;

        if (isHalfVisible) {
          newIndex = index;
        }
      });

      if (newIndex !== currentVideoIndex) {
        // Pause current video
        if (videoRefs.current[currentVideoIndex]) {
          videoRefs.current[currentVideoIndex]?.pause();
          setIsPlaying(false);
        }

        // Play new video
        if (videoRefs.current[newIndex]) {
          videoRefs.current[newIndex]?.play().catch(() => {});
          setIsPlaying(true);
        }

        setCurrentVideoIndex(newIndex);

        // Load more videos if we're near the end
        if (newIndex >= videos.length - 2) {
          loadMoreVideos();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentVideoIndex, videos.length]);

  // Initialize HLS for videos
  useEffect(() => {
    const initializeVideo = (index: number) => {
      const video = videoRefs.current[index];
      if (!video || !videos[index]) return;

      const hlsUrl = videos[index].hls_url || videos[index].video_url;

      if (!hlsUrl || typeof hlsUrl !== "string" || hlsUrl.trim() === "") {
        console.error("No valid video URL found");
        return;
      }

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (index === currentVideoIndex) {
            video.play().catch(() => {});
            setIsPlaying(true);
          }
        });

        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
        if (index === currentVideoIndex) {
          video.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    };

    videos.forEach((_, index) => {
      initializeVideo(index);
    });
  }, [videos, currentVideoIndex]);

  // Like handler
  const handleLike = async (videoId: string) => {
    if (!token) return;

    try {
      const {data} = await axios.post(
        `${API_BASE}/users/likes/toggle`,
        {video_id: videoId, user_id: Cookie.get("id")},
        {headers: {Authorization: `Bearer ${token}`}}
      );

      setVideos((prev) =>
        prev.map((video) =>
          video.id === videoId
            ? {
                ...video,
                is_liked: !video.is_liked,
                like_count: video.is_liked
                  ? video.like_count - 1
                  : video.like_count + 1,
              }
            : video
        )
      );
    } catch (err) {
      console.error("Like action failed:", err);
    }
  };

  // Fetch comments
  const fetchComments = async (videoId: string) => {
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE}/users/comments/${videoId}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  // Submit new comment
  const submitComment = async (videoId: string) => {
    if (!token || !newComment.trim() || !id) return;

    setIsCommenting(true);
    try {
      const {data} = await axios.post(
        `${API_BASE}/users/comments/add`,
        {
          video_id: videoId,
          user_id: id,
          content: newComment,
        },
        {headers: {Authorization: `Bearer ${token}`}}
      );

      setComments((prev) => [{...data.comment, username}, ...prev]);
      setNewComment("");

      // Update comment count in videos list
      setVideos((prev) =>
        prev.map((video) =>
          video.id === videoId
            ? {
                ...video,
                comment_count: data.comment_count,
              }
            : video
        )
      );
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsCommenting(false);
    }
  };

  // Delete comment
  const deleteComment = async (commentId: string) => {
    if (!token) return;

    try {
      const {data} = await axios.delete(`${API_BASE}/comments/${commentId}`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      setComments((prev) => prev.filter((c) => c.id !== commentId));

      // Update comment count in videos list
      setVideos((prev) =>
        prev.map((video) =>
          video.id === data.video_id
            ? {
                ...video,
                comment_count: data.comment_count,
              }
            : video
        )
      );
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };
  // Open comments modal
  const openComments = async (videoId: string) => {
    await fetchComments(videoId);
    setShowComments(true);
  };

  // Toggle play/pause on video click
  const togglePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Feed */}
      <div
        ref={feedRef}
        className="snap-y snap-mandatory h-screen overflow-y-scroll  max-w-[400px] mx-auto"
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="video-container snap-start relative h-screen w-full flex items-center justify-center bg-black"
          >
            <div className="max-w-[400px] w-full h-full relative">
              <video
                ref={(el) => addVideoRef(el, index)}
                loop
                muted
                playsInline
                poster={video.thumbnail_url}
                className="h-full w-full object-cover"
                onClick={() => togglePlayPause(index)}
              />

              {/* Play/Pause overlay */}
              {!isPlaying && currentVideoIndex === index && (
                <button
                  className="absolute inset-0 flex items-center justify-center text-white bg-transparent bg-opacity-30"
                  onClick={() => togglePlayPause(index)}
                >
                  <FaPlay size={48} />
                </button>
              )}
            </div>

            {/* Video Info Overlay */}
            <div className="absolute bottom-20 left-4 text-white max-w-xs">
              {/* <h3 className="font-bold text-lg mb-1">{video.title}</h3> */}
              <p className="text-sm mb-2">{video.description}</p>
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer mr-2"
                  onClick={() => router.push(`/user/${video.user_id}`)}
                >
                  <span className="text-white font-bold">
                    {video.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">{video.username}</span>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6">
              <button
                onClick={() => handleLike(video.id)}
                className={`flex flex-col items-center cursor-pointer ${
                  video.is_liked ? "text-red-500" : "text-white"
                }`}
              >
                <FaHeart size={28} />
                <span className="text-sm mt-1">{video.like_count}</span>
              </button>

              <button
                onClick={() => openComments(video.id)}
                className="flex flex-col items-center text-white cursor-pointer"
              >
                <FaComment size={28} />
                <span className="text-sm mt-1">{video.comment_count}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed right-0 bottom-0 max-h-[90vh] h-full bg-black bg-opacity-80 z-50 flex flex-col rounded-t-xl max-w-[400px] w-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-white p-2"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex mb-4 group">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">
                      {comment.username
                        ? comment.username.charAt(0).toUpperCase()
                        : ""}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-bold text-white mr-2">
                        {comment.username}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {moment(comment.created_at).format(
                          "DD MMM YYYY hh mm:a"
                        )}
                      </span>
                      {/* {comment.user_id === id && (
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="ml-auto text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                      )} */}
                    </div>
                    <p className="text-white mt-.5">{comment.comment_text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && videos[currentVideoIndex]) {
                    submitComment(videos[currentVideoIndex].id);
                  }
                }}
              />
              <button
                onClick={() =>
                  videos[currentVideoIndex] &&
                  submitComment(videos[currentVideoIndex].id)
                }
                disabled={isCommenting || !newComment.trim()}
                className="bg-purple-600 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
              >
                {isCommenting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeFeed;
