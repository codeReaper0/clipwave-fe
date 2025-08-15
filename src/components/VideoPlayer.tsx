import React, {useRef, useEffect, useState} from "react";
import axios from "axios";
import Hls from "hls.js";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import {useParams, useRouter} from "next/navigation";

interface VideoData {
  id: string;
  title: string;
  description: string;
  user_id: string;
  username: string;
  video_url: string;
  hls_url: string;
  thumbnail_url: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  is_liked: boolean;
}

const VideoPlayer: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`/api/videos/${id}`);
        setVideoData(response.data);
        setIsLiked(response.data.is_liked);
        setLikeCount(response.data.likes_count);
        setLoading(false);
      } catch (err) {
        setError("Failed to load video");
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  useEffect(() => {
    if (!videoData || !videoRef.current) return;

    const video = videoRef.current;
    const hlsUrl = videoData.hls_url || videoData.video_url;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
    }
  }, [videoData]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `/api/videos/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsLiked(response.data.is_liked);
      setLikeCount(response.data.likes_count);
    } catch (err) {
      console.error("Like action failed:", err);
    }
  };

  if (loading)
    return <div className="text-center py-20 text-white">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 text-white">
      {/* Video Player */}
      <div className="relative">
        <video
          ref={videoRef}
          controls
          poster={videoData?.thumbnail_url}
          className="w-full aspect-video bg-black"
        />
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{videoData?.title}</h1>
        <div className="flex items-center mb-4">
          <div
            className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer"
            onClick={() => router.push(`/user/${videoData?.user_id}`)}
          >
            <span className="text-white font-bold">
              {videoData?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p
              className="font-medium cursor-pointer hover:underline"
              onClick={() => router.push(`/user/${videoData?.user_id}`)}
            >
              @{videoData?.username}
            </p>
            <p className="text-gray-400 text-sm">
              {new Date(videoData?.created_at || "").toLocaleDateString()} •{" "}
              {videoData?.views_count} views
            </p>
          </div>
        </div>

        <p className="mb-6 text-gray-300">{videoData?.description}</p>

        {/* Action Buttons */}
        <div className="flex justify-between border-t border-gray-800 pt-4">
          <button
            onClick={handleLike}
            className={`flex flex-col items-center ${
              isLiked ? "text-red-500" : "text-gray-400"
            }`}
          >
            <FaHeart size={24} />
            <span className="text-sm mt-1">{likeCount}</span>
          </button>

          <button className="flex flex-col items-center text-gray-400">
            <FaComment size={24} />
            <span className="text-sm mt-1">{videoData?.comments_count}</span>
          </button>

          <button className="flex flex-col items-center text-gray-400">
            <FaShare size={24} />
            <span className="text-sm mt-1">Share</span>
          </button>

          <button className="flex flex-col items-center text-gray-400">
            <FaBookmark size={24} />
            <span className="text-sm mt-1">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
