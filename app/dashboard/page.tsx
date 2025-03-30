'use client'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Share2, Music, ChevronUp, ChevronDown } from 'lucide-react'
import AppBar from "../components/AppBar"
import Image from 'next/image'

// interface Video {
//   "id": string;
//   "title": string;
//   "upvotes": number;
//   "downvotes": number;
//   "thumbnail"?: string;
//   "type": string,
//   "url": string,
//   "extracedId": string,
//   "smallImg": string,
//   "bigImg": string,
//   "active": boolean,
//   "userId": string,
//   "haveUpvoted": boolean,
// }
interface Video {
  "id": string;
  "title": string;
  "upvotes": number;
  "downvotes": number;
  "thumbnail"?: string;
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function SongVotingQueue() {
  const [videos, setVideos] = useState<Video[]>([])
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [youtubeLink, setYoutubeLink] = useState('')

  const refreshStreams = async () => {
    const res = await fetch(`/api/streams/user`, {
      credentials: "include"
    });
    console.log('res', res);
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleVote = (id: string, isUpvote: boolean) => {
    setVideos(videos.map(video => 
      video.id === id 
        ? { 
            ...video, 
            upvotes: isUpvote ? video.upvotes + 1 : video.upvotes,
            downvotes: !isUpvote ? video.downvotes + 1 : video.downvotes
          } 
        : video
    ).sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)))

    fetch("/api/streams/upvote", {
      method: "POST",
      body: JSON.stringify({
        streamId: id,
      })
    })
  }

  const handleAddToQueue = async () => {
    let videoId = '';
    
    try {
      const url = new URL(youtubeLink);
      if (url.hostname.includes('youtube.com')) {
        videoId = url.searchParams.get('v') || '';
      } else if (url.hostname === 'youtu.be') {
        videoId = url.pathname.slice(1);
      }
    } catch (e) {
      console.log("error", e)
      const match = youtubeLink.match(/(?:v=|youtu.be\/)([^&\n?#]+)/);
      videoId = match?.[1] || '';
    }
  
    if (!videoId) {
      alert('Please enter a valid YouTube URL');
      return;
    }
  
    try {
      const response = await fetch(
        `https://noembed.com/embed?url=https://youtube.com/watch?v=${videoId}`
      );
      const data = await response.json();
  
      const newVideo: Video = {
        id: videoId,
        title: data.title || `Video ${videos.length + 1}`, // Use actual title with fallback
        upvotes: 0,
        downvotes: 0,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` // High quality thumbnail
      };
  
      setVideos(prev => {
        // Check if video already exists in queue
        const exists = prev.some(v => v.id === videoId);
        if (exists) {
          alert('This video is already in the queue');
          return prev;
        }
        return [...prev, newVideo];
      });
  
      setYoutubeLink('');
  
      // Set as current video if none playing
      if (!currentVideo) {
        setCurrentVideo(newVideo);
      }
  
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Failed to add video. Please try again.');
    }
  };

  const playNext = () => {
    if (videos.length > 0) {
      setCurrentVideo(videos[0])
      setVideos(videos.slice(1))
    } else {
      setCurrentVideo(null)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 text-white">
      <AppBar />
      
      {/* Adjust padding for different screen sizes */}
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
          Song Voting Queue
        </h1>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-opacity-20 bg-blue-900 hover:bg-opacity-40 text-blue-300 border-blue-800 hover:border-blue-600 transition-all duration-300"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Video Section */}
      {currentVideo && (
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-blue-200">Now Playing</h2>
          <Card className="bg-gradient-to-br from-black to-blue-950 border border-blue-900/50 shadow-lg shadow-blue-900/20 p-4 md:p-6 rounded-xl">
              <div className="aspect-video w-full max-w-2xl mx-auto mb-6">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo.id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
              <Button onClick={playNext} className="w-full bg-opacity-20 bg-blue-900 hover:bg-opacity-40 text-blue-300 border border-blue-800 hover:border-blue-600 transition-all duration-300">
                Play Next
              </Button>
            </Card>
          </div>
        )}

        {/* Add to Queue Section */}
        <div className="mb-6 md:mb-8">
          <Input
            type="text"
            placeholder="Paste YouTube link here"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="mb-3 bg-black/40 border-blue-900/50 text-blue-100 placeholder-blue-500/50 focus:border-blue-700 transition-all duration-300"
          />
          <Button 
            onClick={handleAddToQueue} 
            className="w-full bg-opacity-20 bg-blue-900 hover:bg-opacity-40 text-blue-300 border border-blue-800 hover:border-blue-600 transition-all duration-300"
          >
            Add to Queue
          </Button>
        </div>

        {/* Queue Section */}
        <div>
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-blue-200">Upcoming Videos</h2>
        {videos.length === 0 ? (
          <Card className="bg-gradient-to-br from-black to-blue-950 border border-blue-900/50 p-6 md:p-8 rounded-xl text-center">
            <p className="text-blue-300">Please add videos to the queue to start playing</p>
          </Card>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="bg-gradient-to-br from-black to-blue-950 border border-blue-900/50 p-3 md:p-4 lg:p-6 flex flex-col sm:flex-row items-center gap-4 md:gap-6 lg:gap-8 rounded-xl hover:border-blue-700/60 transition-all duration-300"
              >
                {/* Thumbnail Section - Responsive size */}
                {video.thumbnail ? (
                  <div className="relative flex-shrink-0 w-full sm:w-48 md:w-56 lg:w-64 h-48 sm:h-32 md:h-36">
                    <Image 
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover rounded-lg shadow-lg"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 384px, (max-width: 1024px) 448px, 512px"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 bg-blue-900/20 w-full sm:w-48 md:w-56 lg:w-64 h-48 sm:h-32 md:h-36 rounded-lg flex items-center justify-center">
                    <Music className="h-10 w-10 md:h-12 md:w-12 text-blue-400/50" />
                  </div>
                )}

                {/* Content Section - Responsive layout */}
                <div className="flex-grow w-full sm:w-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 sm:gap-6">
                  <h3 className="text-base md:text-lg font-medium text-blue-100 line-clamp-2 text-center sm:text-left w-full sm:max-w-[300px] lg:max-w-xl">
                    {video.title}
                  </h3>
                  
                  {/* Vote Section - Responsive layout */}
                  <div className="flex items-center gap-2 md:gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleVote(video.id, true)}
                      className="bg-opacity-20 bg-blue-900 hover:bg-blue-800 text-blue-300 border-blue-800 hover:border-blue-600 transition-all duration-300 h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-lg md:rounded-xl"
                    >
                      <ChevronUp className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    </Button>
                    
                    <span className="text-blue-300 font-bold text-lg md:text-xl min-w-[2.5ch] text-center">
                      {video.upvotes - video.downvotes}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleVote(video.id, false)}
                      className="bg-opacity-20 bg-blue-900 hover:bg-blue-800 text-blue-300 border-blue-800 hover:border-blue-600 transition-all duration-300 h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-lg md:rounded-xl"
                    >
                      <ChevronDown className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  )
}