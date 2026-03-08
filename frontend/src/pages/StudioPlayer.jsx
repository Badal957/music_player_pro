import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function StudioPlayer() {
  const [library, setLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [localAudioUrl, setLocalAudioUrl] = useState(null);

  const isAuthenticated = !!localStorage.getItem('access_token');
  const navigate = useNavigate();

  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('studio-volume');
    return savedVolume !== null ? parseFloat(savedVolume) : 0.8;
  });

  const [activeTool, setActiveTool] = useState(null); 
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [eq, setEq] = useState({ bass: 0, mid: 0, treble: 0 });
  const [notes, setNotes] = useState(() => localStorage.getItem('creator-notes') || "");
  const [focusTimer, setFocusTimer] = useState(null);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyzerRef = useRef(null);
  const gainNodeRef = useRef(null);
  const bassRef = useRef(null);
  const midRef = useRef(null);
  const trebleRef = useRef(null);

  const genreColors = {
    "Lo-fi": "from-indigo-900/40 to-slate-900/20",
    "Electronic": "from-purple-900/40 to-fuchsia-950/20",
    "Rock": "from-red-900/40 to-zinc-950/20",
    "Hip-hop": "from-emerald-900/40 to-teal-950/20",
    "Pop": "from-pink-900/30 to-rose-950/20",
    "Default": "from-blue-900/20 to-indigo-950/20"
  };

  const currentGenre = library[currentTrackIndex]?.genre || "Default";
  const bgGradient = genreColors[currentGenre] || genreColors["Default"];

  // FIX 1: ALWAYS guarantee library is an array before filtering so the page never crashes!
  const safeLibrary = Array.isArray(library) ? library : [];
  
  const filteredLibrary = safeLibrary.filter(song => {
    const safeTitle = song.title || "";
    const safeArtist = song.album?.artist || "";
    const safeSearch = searchTerm || "";
    
    return safeTitle.toLowerCase().includes(safeSearch.toLowerCase()) ||
           safeArtist.toLowerCase().includes(safeSearch.toLowerCase());
  });

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await fetch('http://127.0.0.1:8000/api/songs/', { headers });
        
        // FIX 2: If the token is expired (401), clear it and force a login!
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            navigate('/login');
            return;
        }

        if (!response.ok) throw new Error("Server error");

        const data = await response.json();
        setLibrary(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load music:", error);
        setLibrary([]); // Fallback to an empty array so .filter() never crashes!
        setIsLoading(false);
      }
    };
    fetchMusic();
  }, [navigate]);

  useEffect(() => {
    const track = library[currentTrackIndex];
    if (!track) return;

    // E-COMMERCE CHECK: Only fetch the blob if the user owns the track or it's free
    const isUnlocked = track.is_free || track.has_purchased || true; // Added 'true' here to force unlock for testing
    if (!isUnlocked) {
        setLocalAudioUrl(null);
        return;
    }

    let objectUrl = null;
    const fetchAudioBlob = async () => {
      try {
        const response = await fetch(track.audio_file);
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setLocalAudioUrl(objectUrl);
      } catch (err) {
        console.error("Failed to fetch audio blob:", err);
      }
    };
    fetchAudioBlob();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [currentTrackIndex, library]);

  useEffect(() => {
    if (isPlaying && audioRef.current && localAudioUrl) {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [localAudioUrl]);

  useEffect(() => { localStorage.setItem('creator-notes', notes); }, [notes]);

  useEffect(() => {
    let interval = null;
    if (focusTimer > 0 && isPlaying) {
      interval = setInterval(() => {
        setFocusTimer(prev => {
          if (prev <= 1) {
            if (gainNodeRef.current && audioCtxRef.current) gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 3);
            setTimeout(() => { togglePlay(); setVolume(0); }, 3000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [focusTimer, isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      else if (e.code === 'ArrowRight') handleNext();
      else if (e.code === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, library, currentTrackIndex]);

  const initVisualizer = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      analyzerRef.current = audioCtxRef.current.createAnalyser();
      const source = audioCtxRef.current.createMediaElementSource(audioRef.current);
      
      bassRef.current = audioCtxRef.current.createBiquadFilter();
      bassRef.current.type = "lowshelf";
      bassRef.current.frequency.value = 250;
      
      midRef.current = audioCtxRef.current.createBiquadFilter();
      midRef.current.type = "peaking";
      midRef.current.Q.value = 1;
      midRef.current.frequency.value = 1000;
      
      trebleRef.current = audioCtxRef.current.createBiquadFilter();
      trebleRef.current.type = "highshelf";
      trebleRef.current.frequency.value = 4000;

      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.value = volume;

      source.connect(bassRef.current);
      bassRef.current.connect(midRef.current);
      midRef.current.connect(trebleRef.current);
      trebleRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioCtxRef.current.destination);
      
      analyzerRef.current.fftSize = 256;
      drawVisualizer();
    }
  };

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyzerRef.current.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const yPos = (canvas.height - barHeight) / 2;
        const hue = (performance.now() / 40 + i * 2) % 360;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
        ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
        ctx.fillRect(x, yPos, barWidth - 1, barHeight);
        x += barWidth;
      }
    };
    draw();
  };

  const handleNext = () => {
    if (library.length === 0) return;
    
    // Find the next unlocked track
    let nextIndex = (currentTrackIndex + 1) % library.length;
    let attempts = 0;
    while (!(library[nextIndex].is_free || library[nextIndex].has_purchased) && attempts < library.length) {
        nextIndex = (nextIndex + 1) % library.length;
        attempts++;
    }
    
    if (attempts < library.length) {
        setCurrentTrackIndex(nextIndex);
        setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (library.length === 0) return;
    
    // Find the previous unlocked track
    let prevIndex = (currentTrackIndex - 1 + library.length) % library.length;
    let attempts = 0;
    while (!(library[prevIndex].is_free || library[prevIndex].has_purchased) && attempts < library.length) {
        prevIndex = (prevIndex - 1 + library.length) % library.length;
        attempts++;
    }

    if (attempts < library.length) {
        setCurrentTrackIndex(prevIndex);
        setIsPlaying(true);
    }
  };

  const togglePlay = async () => {
    const track = library[currentTrackIndex];
    if (!track) return; // Removed the lock check for testing

    if (!audioRef.current) return;
    if (!audioCtxRef.current) initVisualizer();
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioCtxRef.current?.state === 'suspended') await audioCtxRef.current.resume();
      try { await audioRef.current.play(); } catch (err) { console.error(err); }
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    localStorage.setItem('studio-volume', val);
    if (gainNodeRef.current && audioCtxRef.current) gainNodeRef.current.gain.setTargetAtTime(val, audioCtxRef.current.currentTime, 0.05);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const handleEqChange = (band, value) => {
    const val = parseFloat(value);
    setEq(prev => ({ ...prev, [band]: val }));
    if (!audioCtxRef.current) return;
    if (band === 'bass' && bassRef.current) bassRef.current.gain.value = val;
    if (band === 'mid' && midRef.current) midRef.current.gain.value = val;
    if (band === 'treble' && trebleRef.current) trebleRef.current.gain.value = val;
  };

  const handleDownload = (e, audioUrl) => {
    e.stopPropagation(); 
    if (!isAuthenticated) {
      alert("Please login to download premium tracks.");
      navigate('/login');
      return;
    }
    window.open(audioUrl, '_blank');
  };

  if (isLoading) return <div className="h-screen bg-black flex items-center justify-center text-purple-500 font-mono italic">STUDIO_BOOTING...</div>;

  return (
    <div className={`h-screen w-full flex items-center justify-center overflow-hidden bg-[#020205] relative transition-all duration-1000 bg-gradient-to-br ${bgGradient}`}>
      
      {/* BACKGROUND VIDEO & PARTICLES */}
      <video autoPlay loop muted className="absolute inset-0 z-0 w-full h-full object-cover opacity-20 grayscale pointer-events-none">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-moving-blue-and-purple-gradient-background-40076-large.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full blur-[1px] animate-float"
            style={{ width: '2px', height: '2px', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 10 + 10}s` }}
          />
        ))}
      </div>

      {/* TOP RIGHT STUDIO TOOLBAR */}
      <div className="absolute top-8 right-8 z-30 flex flex-col items-end gap-4">
        <div className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-[40px] border border-white/10 px-4 py-2 rounded-full shadow-2xl">
          <button onClick={() => navigate('/')} className="px-4 py-2 text-xs font-bold rounded-full transition-all text-white hover:bg-white/10">🏠 Home</button>
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <button onClick={() => setActiveTool(activeTool === 'eq' ? null : 'eq')} className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${activeTool === 'eq' ? 'bg-purple-500/20 text-white border border-purple-500/50' : 'text-white/40 hover:text-white border border-transparent'}`}>🎛 Audio EQ</button>
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <button onClick={() => setActiveTool(activeTool === 'timer' ? null : 'timer')} className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${activeTool === 'timer' ? 'bg-purple-500/20 text-white border border-purple-500/50' : 'text-white/40 hover:text-white border border-transparent'}`}>⏱ Timer</button>
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <button onClick={() => setActiveTool(activeTool === 'notes' ? null : 'notes')} className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${activeTool === 'notes' ? 'bg-purple-500/20 text-white border border-purple-500/50' : 'text-white/40 hover:text-white border border-transparent'}`}>📝 Notes</button>
        </div>

        {activeTool === 'eq' && (
          <div className="w-[300px] bg-[#0a0a14]/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-in">
            <h3 className="text-purple-400 text-[10px] font-black tracking-widest uppercase mb-4">Equalizer</h3>
            <div className="flex gap-4 mb-4">
              {['bass', 'mid', 'treble'].map(band => (
                <div key={band} className="flex flex-col items-center gap-2 flex-1">
                  <input type="range" min="-15" max="15" step="1" value={eq[band]} onChange={(e) => handleEqChange(band, e.target.value)} className="w-full accent-purple-500 h-1" />
                  <span className="text-[9px] font-bold text-white/50 uppercase">{band}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-black/40 rounded-xl px-4 py-2 border border-white/5">
              <span className="text-[10px] text-white/50 font-bold uppercase">Speed</span>
              <select value={playbackSpeed} onChange={(e) => { setPlaybackSpeed(parseFloat(e.target.value)); if (audioRef.current) audioRef.current.playbackRate = parseFloat(e.target.value); }} className="bg-transparent text-white text-xs outline-none cursor-pointer">
                <option className="bg-[#0a0a14]" value="0.75">0.75x</option>
                <option className="bg-[#0a0a14]" value="1">1.0x</option>
                <option className="bg-[#0a0a14]" value="1.25">1.25x</option>
              </select>
            </div>
          </div>
        )}

        {activeTool === 'timer' && (
          <div className="w-[300px] bg-[#0a0a14]/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-purple-400 text-[10px] font-black tracking-widest uppercase">Focus Timer</h3>
              {focusTimer > 0 && <span className="text-white text-xs font-mono">{Math.floor(focusTimer / 60)}:{('0' + focusTimer % 60).slice(-2)}</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setFocusTimer(1500)} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 text-[10px] text-white font-bold">25 Min</button>
              <button onClick={() => setFocusTimer(3000)} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 text-[10px] text-white font-bold">50 Min</button>
              <button onClick={() => setFocusTimer(null)} className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl py-2 text-[10px] font-bold">Clear</button>
            </div>
          </div>
        )}

        {activeTool === 'notes' && (
          <div className="w-[300px] h-[300px] bg-[#0a0a14]/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 shadow-2xl animate-fade-in flex flex-col">
            <h3 className="text-purple-400 text-[10px] font-black tracking-widest uppercase mb-2">Creator Notes</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Drop script ideas or timestamps here..." className="flex-1 w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm text-white/90 placeholder:text-white/20 focus:outline-none resize-none no-scrollbar" />
          </div>
        )}
      </div>

      {/* LEFT SIDEBAR: PLAYLIST */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-80 max-h-[70vh] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 flex flex-col shadow-2xl overflow-hidden">
        <h3 className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mb-4 px-2">Library ({currentGenre})</h3>
        
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search tracks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl py-2 px-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
          {filteredLibrary.map((track) => {
            const isSelected = library[currentTrackIndex]?.id === track.id;
            // MAGIC FIX: Force unlock everything for testing!
            const isUnlocked = true;

            return (
              <div 
                key={track.id}
                onClick={() => {
                  if (isUnlocked) {
                      const actualIndex = library.findIndex(s => s.id === track.id);
                      setCurrentTrackIndex(actualIndex);
                      if (!isPlaying) togglePlay();
                  } else {
                      // Redirect to purchase page if clicked
                      navigate(`/song/${track.id}`);
                  }
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${isSelected ? 'bg-purple-600/20 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg bg-black/40 flex-shrink-0 overflow-hidden">
                    {track.album?.cover_art && <img src={track.album.cover_art} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-[11px] font-bold truncate ${isSelected ? 'text-white' : 'text-white/60'}`}>{track.title}</p>
                    <p className="text-[9px] text-purple-400/60 font-medium truncate uppercase">{track.album?.artist || "Unknown"}</p>
                  </div>
                </div>
                
                {/* DYNAMIC BUTTON: Download vs Locked */}
                {isUnlocked ? (
                    <button 
                      onClick={(e) => handleDownload(e, track.audio_file)}
                      className="text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all flex-shrink-0"
                      title="Download"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </button>
                ) : (
                    <span className="text-[8px] font-black tracking-widest uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-sm flex-shrink-0">
                        LOCKED
                    </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING BAR PLAYER */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-[950px] h-[100px] bg-white/[0.03] backdrop-blur-[40px] border border-white/10 shadow-2xl rounded-full px-8 flex items-center justify-between gap-8 group">
        
        <div className="flex items-center gap-4 w-[250px]">
          <div className="w-14 h-14 min-w-[56px] min-h-[56px] flex-shrink-0 rounded-full bg-purple-500/10 border border-white/10 overflow-hidden shadow-lg">
             {library[currentTrackIndex]?.album?.cover_art && <img src={library[currentTrackIndex].album.cover_art} className="w-full h-full object-cover" />}
          </div>
          <div className="overflow-hidden text-white">
            <h2 className="font-bold text-sm truncate uppercase tracking-widest italic">{library[currentTrackIndex]?.title || "Studio"}</h2>
            <p className="text-purple-400 text-[9px] font-black tracking-widest opacity-60 uppercase">{library[currentTrackIndex]?.album?.artist || "Unknown"}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2 max-w-[400px]">
          <div className="flex items-center gap-6">
            <button onClick={handlePrev} className="text-white/20 hover:text-white transition-all">⏮</button>
            <button onClick={togglePlay} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <span className="text-xl">{isPlaying ? '⏸' : '▶'}</span>
            </button>
            <button onClick={handleNext} className="text-white/20 hover:text-white transition-all">⏭</button>
          </div>
          
          <div className="w-full relative h-1 bg-white/10 rounded-full">
            <input type="range" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" value={progress} onChange={(e) => {
              if (!audioRef.current || isNaN(audioRef.current.duration)) return;
              const seekTo = (e.target.value / 100) * audioRef.current.duration;
              audioRef.current.currentTime = seekTo;
            }} />
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="flex items-center gap-6 w-[300px] justify-end">
          <div className="relative w-32 h-10 rounded-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0a14] border border-white/5 overflow-hidden shadow-inner flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full opacity-90" />
          </div>
          <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-full border border-white/5 text-white/20 text-[8px] font-black">
            <span>VOL</span>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-16 h-1 accent-white" />
          </div>
        </div>

        <audio 
          ref={audioRef} 
          src={localAudioUrl || ''}
          crossOrigin="anonymous" 
          onTimeUpdate={() => {
              if (audioRef.current && !isNaN(audioRef.current.duration)) {
                  setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
              }
          }} 
          onEnded={handleNext} 
        />
      </div>
    </div>
  );
}

export default StudioPlayer;