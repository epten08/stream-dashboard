import { useState, useRef } from 'react';
import { 
  VideoCameraIcon, 
  SignalIcon, 
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  BookmarkIcon,
  RadioIcon
} from '@heroicons/react/24/outline';
import type { CameraFeed, RecordingSession, MatchMetadata } from '../types';
import HLSPlayer from '../components/HLSPlayer';

const CameraFeeds = () => {
  const [feeds] = useState<CameraFeed[]>([
    { 
      id: '1', 
      name: 'Main Stadium', 
      status: 'live', 
      viewers: 1245,
      streamUrl: 'https://demo-streams.s3.amazonaws.com/hls/master.m3u8',
      isActive: true
    },
    { 
      id: '2', 
      name: 'Practice Field A', 
      status: 'live', 
      viewers: 324,
      streamUrl: 'https://demo-streams.s3.amazonaws.com/hls/master.m3u8',
      isActive: false
    },
    { 
      id: '3', 
      name: 'Practice Field B', 
      status: 'offline', 
      viewers: 0,
      isActive: false
    },
    { 
      id: '4', 
      name: 'Training Room', 
      status: 'recording', 
      viewers: 156,
      streamUrl: 'https://demo-streams.s3.amazonaws.com/hls/master.m3u8',
      isActive: false
    },
  ]);

  const [activeFeed, setActiveFeed] = useState<string>('1');
  const [recordingSession, setRecordingSession] = useState<RecordingSession | null>(null);
  const [currentMatch] = useState<MatchMetadata>({
    id: 'match-001',
    date: new Date(),
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    venue: 'Main Stadium',
    competition: 'League Championship'
  });

  const highlightDescriptionRef = useRef<HTMLInputElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'recording': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <SignalIcon className="h-4 w-4" />;
      case 'offline': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'maintenance': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'recording': return <VideoCameraIcon className="h-4 w-4 animate-pulse" />;
      default: return <VideoCameraIcon className="h-4 w-4" />;
    }
  };

  const startRecording = () => {
    const newSession: RecordingSession = {
      id: `recording-${Date.now()}`,
      matchId: currentMatch.id,
      startTime: new Date(),
      status: 'recording',
      highlights: [],
      cameraFeeds: feeds.filter(f => f.status === 'live').map(f => f.id)
    };
    setRecordingSession(newSession);
  };

  const stopRecording = () => {
    if (recordingSession) {
      setRecordingSession({
        ...recordingSession,
        endTime: new Date(),
        status: 'stopped'
      });
    }
  };

  const pauseRecording = () => {
    if (recordingSession) {
      setRecordingSession({
        ...recordingSession,
        status: 'paused'
      });
    }
  };

  const resumeRecording = () => {
    if (recordingSession) {
      setRecordingSession({
        ...recordingSession,
        status: 'recording'
      });
    }
  };

  const markHighlight = () => {
    if (recordingSession && highlightDescriptionRef.current) {
      const description = highlightDescriptionRef.current.value || 'Highlight';
      const highlight = {
        id: `highlight-${Date.now()}`,
        timestamp: new Date(),
        duration: 30,
        description,
        cameraFeedId: activeFeed
      };
      
      setRecordingSession({
        ...recordingSession,
        highlights: [...recordingSession.highlights, highlight]
      });
      
      if (highlightDescriptionRef.current) {
        highlightDescriptionRef.current.value = '';
      }
    }
  };

  const switchActiveFeed = (feedId: string) => {
    setActiveFeed(feedId);
  };

  const formatDuration = (start: Date, end?: Date) => {
    const duration = (end ? end.getTime() : Date.now()) - start.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stream Dashboard</h1>
        <p className="text-gray-600">Monitor camera feeds, control live stream, and manage recordings</p>
      </div>

      {/* Match Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Match</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Teams:</span>
            <p>{currentMatch.homeTeam} vs {currentMatch.awayTeam}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Venue:</span>
            <p>{currentMatch.venue}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Competition:</span>
            <p>{currentMatch.competition}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Date:</span>
            <p>{currentMatch.date.toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recording Controls</h2>
          {recordingSession && (
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${recordingSession.status === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="font-medium">{recordingSession.status.toUpperCase()}</span>
              {recordingSession.status !== 'stopped' && (
                <span>- {formatDuration(recordingSession.startTime)}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          {!recordingSession || recordingSession.status === 'stopped' ? (
            <button
              onClick={startRecording}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Start Recording
            </button>
          ) : (
            <div className="flex space-x-2">
              {recordingSession.status === 'recording' ? (
                <button
                  onClick={pauseRecording}
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  <PauseIcon className="h-4 w-4 mr-2" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Resume
                </button>
              )}
              <button
                onClick={stopRecording}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <StopIcon className="h-4 w-4 mr-2" />
                Stop
              </button>
            </div>
          )}
        </div>

        {/* Highlight Controls */}
        {recordingSession && recordingSession.status !== 'stopped' && (
          <div className="border-t pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Mark Highlight</h3>
            <div className="flex items-center space-x-3">
              <input
                ref={highlightDescriptionRef}
                type="text"
                placeholder="Highlight description (optional)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={markHighlight}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Mark Highlight
              </button>
            </div>
            {recordingSession.highlights.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">Recent highlights:</p>
                <div className="mt-2 space-y-1">
                  {recordingSession.highlights.slice(-3).map((highlight) => (
                    <div key={highlight.id} className="text-xs bg-gray-50 p-2 rounded">
                      <span className="font-medium">{highlight.description}</span>
                      <span className="text-gray-500 ml-2">
                        {highlight.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Stream Control */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Stream Control</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RadioIcon className="h-5 w-5 text-red-500" />
            <span className="font-medium">Active Feed:</span>
            <span className="text-blue-600 font-semibold">
              {feeds.find(f => f.id === activeFeed)?.name || 'None'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Viewers: {feeds.find(f => f.id === activeFeed)?.viewers || 0}
          </div>
        </div>
      </div>

      {/* Camera Feeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feeds.map((feed) => (
          <div key={feed.id} className={`bg-white rounded-lg shadow-md overflow-hidden ${feed.id === activeFeed ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{feed.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feed.status)}`}>
                    {getStatusIcon(feed.status)}
                    <span className="ml-1 capitalize">{feed.status}</span>
                  </span>
                  {feed.id === activeFeed && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      LIVE
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="aspect-video bg-gray-900 relative">
              {feed.status === 'live' || feed.status === 'recording' ? (
                <HLSPlayer src={feed.streamUrl || ''} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Camera {feed.status}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Viewers: {feed.viewers}</span>
                {(feed.status === 'live' || feed.status === 'recording') && (
                  <button
                    onClick={() => switchActiveFeed(feed.id)}
                    disabled={feed.id === activeFeed}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      feed.id === activeFeed
                        ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {feed.id === activeFeed ? 'Active' : 'Go Live'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraFeeds;