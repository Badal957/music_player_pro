import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- NEW IMPORT

const HomePage = () => {
    const [songs, setSongs] = useState([]);
    const navigate = useNavigate(); // <-- NEW: Allows us to redirect to the new page
    const isAuthenticated = !!localStorage.getItem('access_token'); 

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/songs/')
            .then(res => res.json())
            .then(data => setSongs(data))
            .catch(err => console.error("Failed to fetch:", err));
    }, []);

    return (
        <div 
            className="min-h-screen w-full text-white relative font-sans selection:bg-purple-500/30 overflow-x-hidden" 
            style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1c2e 0%, #050508 50%, #000000 100%)' }}
        >
            {/* --- GLASSMORPHIC NAVBAR --- */}
            <nav className="relative z-20 flex justify-between items-center px-8 py-5 bg-[#0a0a14]/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                        <span className="text-sm">🎧</span>
                    </div>
                    <div className="font-black text-xl tracking-widest uppercase">StudioPro</div>
                </div>
                
                <div className="flex gap-6 items-center text-xs font-bold uppercase tracking-widest">
                    <a href="/" className="text-white/70 hover:text-white transition-colors">Home</a>
                    <a href="/studio" className="text-[#8A58FC] hover:text-[#9f75ff] transition-colors flex items-center gap-2">
                        <span>Open Player</span> 🎵
                    </a>
                    
                    <a href="/about" className="text-white/70 hover:text-white transition-colors">About</a>
                    <a href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</a>
                    <a href="/disclaimer" className="text-white/70 hover:text-white transition-colors">Disclaimer</a>
                    
                    {!isAuthenticated ? (
                        <div className="flex items-center gap-4 ml-2 border-l border-white/10 pl-6">
                            <a href="/login" className="text-white hover:text-purple-400 transition-colors">Login</a>
                            <a href="/signup" className="bg-[#8A58FC] hover:bg-[#7444E0] px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(138,88,252,0.4)]">Sign Up</a>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 ml-2 border-l border-white/10 pl-6">
                            <button onClick={() => {
                                localStorage.removeItem('access_token');
                                window.location.reload();
                            }} className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-5 py-2.5 rounded-full transition-all">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative z-10 text-center py-24 px-4">
                <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Discover Premium Audio
                </h1>
                <p className="text-white/50 text-lg max-w-2xl mx-auto font-medium">
                    Your exclusive library for high-quality, royalty-free tracks. Log in or sign up today to start downloading.
                </p>
            </header>

            {/* --- PREMIUM SONG LIST --- */}
            <main className="relative z-10 max-w-[950px] mx-auto px-6 pb-24">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className="text-[14px] font-black tracking-[0.15em] uppercase text-[#8B92B2]">Latest Drops</h2>
                    <span className="text-[11px] font-bold text-[#D0B3FF] bg-[#2D1B4E] border border-[#4B2C82] px-4 py-1.5 rounded-full shadow-lg">
                        {songs.length} Tracks
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    {songs.map(song => (
                        <div 
                            key={song.id} 
                            onClick={() => navigate(`/song/${song.id}`)} // <-- NEW: Makes the row clickable!
                            className="flex items-center justify-between p-3 pr-4 bg-[#151520]/80 backdrop-blur-md border border-white/[0.06] rounded-[20px] hover:bg-[#1A1A28]/90 transition-all hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer group gap-4"
                        >
                            
                            {/* Track Info */}
                            <div className="flex items-center gap-4 flex-1 min-w-0 pl-1">
                                <div className="w-[52px] h-[52px] rounded-lg bg-black/60 overflow-hidden shadow-md border border-white/10 flex-shrink-0">
                                    {song.album?.cover_art ? (
                                        <img src={song.album.cover_art} alt={song.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] font-bold uppercase">No Art</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[15px] text-white/90 group-hover:text-white transition-colors truncate">
                                        {song.title}
                                    </h3>
                                    <p className="text-[13px] text-[#8B92B2] font-medium mt-0.5 truncate">
                                        {song.album?.artist || "Unknown Artist"} <span className="mx-1 opacity-50">|</span> {song.album?.title || "Single"} <span className="mx-1 opacity-50">|</span> {song.duration || "0:00"}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Action Area (Download button removed, only preview player remains) */}
                            <div className="flex items-center gap-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                {/* e.stopPropagation() prevents the player click from navigating to the next page */}
                                <div className="bg-[#1A1A28] border border-white/[0.05] rounded-full px-2 shadow-inner hidden md:flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                                    <audio 
                                        controls 
                                        controlsList="nodownload" 
                                        src={song.audio_file} 
                                        style={{ colorScheme: 'dark' }}
                                        className="h-10 w-[220px] outline-none"
                                    />
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePage;