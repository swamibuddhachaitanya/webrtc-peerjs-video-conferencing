import React, { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import './VideoConference.css'; // Import a CSS file for styles

interface VideoConferenceProps {
    token: string;
}

const VideoConference: React.FC<VideoConferenceProps> = ({ token }) => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<{ id: string; stream: MediaStream }[]>([]);
    const myVideoRef = useRef<HTMLVideoElement>(null);
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const [connections, setConnections] = useState<MediaConnection[]>([]);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);

    useEffect(() => {
        const peerInstance = new Peer({
            host: 'localhost',
            port: 9000,
            path: '/peerjs/myapp',
            secure: false,
            debug: 3,
        });

        setPeer(peerInstance);

        peerInstance.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });

        peerInstance.on('error', (err) => {
            console.error('Peer error:', err);
        });

        return () => {
            peerInstance.disconnect();
            peerInstance.destroy();
        };
    }, []);

    useEffect(() => {
        const initMediaAndCalls = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setMyStream(stream);

                if (myVideoRef.current) {
                    myVideoRef.current.srcObject = stream;
                }

                if (peer) {
                    peer.on('call', (call) => {
                        console.log('Incoming call from:', call.peer);
                        call.answer(stream);

                        call.on('stream', (remoteStream) => {
                            console.log('Received remote stream from:', call.peer);
                            addRemoteStream(call.peer, remoteStream);
                        });

                        call.on('close', () => {
                            removeRemoteStream(call.peer);
                        });

                        call.on('error', (err) => {
                            console.error('Call error:', err);
                        });

                        setConnections((prevConns) => [...prevConns, call]);
                    });

                    const response = await fetch('http://localhost:9000/peers', {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.ok) {
                        const peers: string[] = await response.json();
                        peers.forEach((peerId) => {
                            if (peerId !== peer.id) {
                                const call = peer.call(peerId, stream);
                                call.on('stream', (remoteStream) => {
                                    addRemoteStream(call.peer, remoteStream);
                                });
                                call.on('close', () => {
                                    removeRemoteStream(call.peer);
                                });
                                call.on('error', (err) => {
                                    console.error('Call error:', err);
                                });

                                setConnections((prevConns) => [...prevConns, call]);
                            }
                        });
                    } else {
                        console.error('Failed to fetch peers:', response.statusText);
                    }
                }
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        if (peer) {
            initMediaAndCalls();
        }
    }, [peer, token]);

    const addRemoteStream = (peerId: string, stream: MediaStream) => {
        setRemoteStreams((prevStreams) => {
            if (prevStreams.some((s) => s.id === peerId)) {
                return prevStreams;
            }
            return [...prevStreams, { id: peerId, stream }];
        });
    };

    const removeRemoteStream = (peerId: string) => {
        setRemoteStreams((prevStreams) => prevStreams.filter((s) => s.id !== peerId));
    };

    const toggleAudio = () => {
        if (myStream) {
            myStream.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsAudioMuted(!isAudioMuted);
        }
    };

    const toggleVideo = () => {
        if (myStream) {
            myStream.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsVideoMuted(!isVideoMuted);
        }
    };

    return (
        <div className="conference-container">
            <div className="video-section">
                <video ref={myVideoRef} autoPlay muted playsInline className="video-element" />
                <div className="controls">
                    <button className="control-button" onClick={toggleAudio}>
                        {isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                    </button>
                    <button className="control-button" onClick={toggleVideo}>
                        {isVideoMuted ? 'Start Video' : 'Stop Video'}
                    </button>
                </div>
            </div>
            <h3 className="participants-header">Participants ({remoteStreams.length + 1})</h3>
            <div className="participants-grid">
                {remoteStreams.map(({ id, stream }) => (
                    <RemoteVideo key={id} stream={stream} />
                ))}
            </div>
        </div>
    );
};

interface RemoteVideoProps {
    stream: MediaStream;
}

const RemoteVideo: React.FC<RemoteVideoProps> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return <video ref={videoRef} autoPlay playsInline className="remote-video" controls={false} />;
};

export default VideoConference;
