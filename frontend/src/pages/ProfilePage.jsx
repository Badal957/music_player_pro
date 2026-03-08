import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [purchasedTracks, setPurchasedTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch('http://127.0.0.1:8000/api/songs/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            // Act as a digital ledger: filter only tracks the user explicitly purchased
            const unlocked = data.filter(song => song.has_purchased);
            setPurchasedTracks(unlocked);
            setLoading(false);
        })
        .catch(err => {
            console.error("Failed to fetch profile data:", err);
            setLoading(false);
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    // Calculate total money spent (Standard accounting principle)
    const totalSpent = purchasedTracks.reduce((sum, track) => sum + parseFloat(track.price || 0), 0);

    if (loading) return <div className="min-h-screen bg-[#05050A] text-[#8A58FC] flex items-center justify-center font-bold tracking-[0.2em] text-xs animate-pulse">LOADING PROFILE...</div>;

    return (
        <div className="min-h-screen w-full bg-[#05050A] text-white font-sans overflow-x-hidden selection:bg-purple-500/30 flex flex-col">
            
            {/* Navbar */}
            <nav className="relative z-20 flex justify-between items-center px-8 py-5 bg-[#0a0a14]/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                        <span className="text-sm">🎧</span>
                    </div>
                    <div className="font-black text-xl tracking-widest uppercase text-white/90">StudioPro</div>
                </div>
                <div className="flex gap-6 items-center text-xs font-bold uppercase tracking-widest">
                    <button onClick={() => navigate('/')} className="text-white/70 hover:text-white transition-colors">Home</button>
                    <button onClick={() => navigate('/studio')} className="text-white/70 hover:text-white transition-colors">Player</button>
                    <button onClick={handleLogout} className="ml-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-full transition-all">Log Out</button>
                </div>
            </nav>

            {/* Dashboard Content */}
            <main className="relative z-10 max-w-[1000px] mx-auto px-6 py-16 w-full flex-1">
                
                {/* Header Stats */}
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <div className="flex-1 bg-[#111] border border-white/10 rounded-3xl p-8 flex items-center gap-6 shadow-xl">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8A58FC] to-pink-500 flex items-center justify-center text-2xl font-black shadow-[0_0_30px_rgba(138,88,252,0.3)]">
                            US
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-widest uppercase mb-1">Creator Account</h2>
                            <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Secure Session Active
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 flex flex-col justify-center min-w-[250px] shadow-xl">
                        <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Total Value Unlocked</span>
                        <span className="text-4xl font-black text-amber-400">${totalSpent.toFixed(2)}</span>
                    </div>
                </div>

                {/* Ledger / Transaction History */}
                <div className="bg-[#111]/50 border border-white/5 rounded-3xl p-8">
                    <h3 className="text-lg font-black tracking-widest uppercase mb-6 flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#8A58FC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Acquired Masters
                    </h3>

                    {purchasedTracks.length === 0 ? (
                        <div className="text-center py-12 text-white/30 text-sm font-bold tracking-widest uppercase border border-dashed border-white/10 rounded-xl">
                            No transactions recorded yet.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {purchasedTracks.map((track) => (
                                <div key={track.id} className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate(`/song/${track.id}`)}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#151520] rounded-lg overflow-hidden flex-shrink-0">
                                            {track.album?.cover_art && <img src={track.album.cover_art} alt="cover" className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white mb-0.5">{track.title}</div>
                                            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{track.album?.artist || "Unknown Artist"}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-amber-400 mb-1">${track.price}</div>
                                        <div className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase">Verified</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default ProfilePage;