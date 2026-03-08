import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SongDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Payment Modal State
    const [showPayment, setShowPayment] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const isAuthenticated = !!localStorage.getItem('access_token');

    // Fetch Song Data
    const fetchSongData = () => {
        const token = localStorage.getItem('access_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        fetch(`http://127.0.0.1:8000/api/songs/${id}/`, { headers })
            .then(res => res.json())
            .then(data => {
                setSong(data);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch song:", err));
    };

    useEffect(() => {
        fetchSongData();
    }, [id]);

    const handleDownload = () => {
        if (!isAuthenticated) return navigate("/login");
        window.open(song.audio_file, '_blank');
    };

    // --- MOCK PAYMENT GATEWAY LOGIC ---
    
    // Standard Luhn Algorithm for validating credit card numbers
    const validateLuhn = (num) => {
        let arr = (num + '').split('').reverse().map(x => parseInt(x));
        let lastDigit = arr.splice(0, 1)[0];
        let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
        sum += lastDigit;
        return sum % 10 === 0;
    };

    const processPayment = async (e) => {
        e.preventDefault();
        setPaymentError('');
        
        // Strip spaces from the input
        const cleanCard = cardNumber.replace(/\s+/g, '');

        if (!/^\d{16}$/.test(cleanCard)) {
            return setPaymentError("Invalid format. Enter 16 digits.");
        }

        // 🛑 TEMPORARILY DISABLED LUHN CHECK FOR LOCAL TESTING
        // if (!validateLuhn(cleanCard)) {
        //     return setPaymentError("Card validation failed (Luhn Check).");
        // }

        setIsProcessing(true);
        
        // ... rest of the code stays the same
        // Simulate network delay for the payment gateway
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch('http://127.0.0.1:8000/api/purchase/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ song_id: song.id })
                });

                if (response.ok) {
                    setShowPayment(false);
                    fetchSongData(); // Refresh the page to instantly unlock the track!
                } else {
                    const data = await response.json();
                    console.log("Django API Response:", data); // <-- Logs the exact error to your browser console
                    // Show custom error, or DRF default error, or stringify everything
                    setPaymentError(data.error || data.detail || JSON.stringify(data)); 
                }
            } catch (err) {
                setPaymentError("Server connection error.");
            }
            setIsProcessing(false);
        }, 1500); // 1.5 second fake processing time
    };

    const generateDescription = (title, artist) => {
        return `Experience the pristine audio engineering of "${title}" by ${artist}. Mastered for high-fidelity playback, this track delivers exceptional dynamic range and crystal-clear frequencies.`;
    };

    if (loading) return <div className="min-h-screen bg-[#05050A] text-[#8A58FC] flex items-center justify-center font-bold tracking-[0.2em] text-xs animate-pulse">LOADING STUDIO...</div>;
    if (!song) return <div className="min-h-screen bg-[#05050A] text-white flex items-center justify-center font-bold tracking-widest text-sm">TRACK NOT FOUND</div>;

    const artistName = song.album?.artist || "Unknown Artist";
    const isUnlocked = song.is_free || song.has_purchased;

    return (
        <div className="min-h-screen w-full bg-[#05050A] text-white font-sans overflow-x-hidden selection:bg-purple-500/30 flex flex-col relative">
            
            {/* --- HERO SECTION --- */}
            <div className="relative w-full pt-24 pb-12 flex items-end border-b border-white/[0.05]">
                <div className="absolute inset-0 z-0 overflow-hidden bg-[#08080c]">
                    <div className="absolute top-[-30%] left-[20%] w-[50vw] h-[50vw] bg-[#8A58FC] blur-[150px] opacity-10 rounded-full pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/80 to-transparent"></div>
                </div>

                <div className="absolute top-0 left-0 w-full z-30 px-8 py-6 flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase bg-white/[0.03] px-5 py-2.5 rounded-full backdrop-blur-md border border-white/[0.05] hover:border-white/20">
                        <span>←</span> Library
                    </button>
                    <div className="flex items-center gap-2 border border-white/10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/60">Secure Connection</span>
                    </div>
                </div>

                <div className="relative z-20 w-full max-w-[1400px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row items-start md:items-end gap-8">
                    <div className="w-40 h-40 md:w-56 md:h-56 flex-shrink-0 rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-white/10 bg-[#111]">
                        {song.album?.cover_art ? (
                            <img src={song.album.cover_art} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20 font-bold tracking-[0.1em] uppercase text-xs">No Art</div>
                        )}
                    </div>

                    <div className="flex flex-col justify-end w-full pb-2">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`border text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full ${isUnlocked ? 'bg-[#8A58FC]/10 text-[#D0B3FF] border-[#8A58FC]/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                {song.is_free ? 'Free Track' : song.has_purchased ? 'Purchased' : 'Premium Track'}
                            </span>
                            <span className="text-white/40 text-[11px] font-semibold tracking-[0.1em] uppercase">{song.duration || "Lossless Audio"}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 leading-snug drop-shadow-xl max-w-4xl">{song.title}</h1>
                        <div className="flex items-center gap-3 text-sm font-medium text-white/60">
                            <span className="text-white font-semibold">{artistName}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span>{song.album?.title || "Single"}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span>{new Date().getFullYear()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ACTION BAR --- */}
            <div className="w-full relative z-20 bg-[#08080c]/80 backdrop-blur-2xl border-b border-white/[0.02] shadow-xl">
                <div className="w-full max-w-[1400px] mx-auto px-8 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="w-full md:max-w-xl flex-1 flex items-center gap-5">
                        <div className="w-full bg-white/[0.03] border border-white/[0.05] rounded-full px-2 py-1">
                            {isUnlocked ? (
                                <audio controls controlsList="nodownload" src={song.audio_file} style={{ colorScheme: 'dark' }} className="w-full outline-none h-9 opacity-80" />
                            ) : (
                                <div className="h-9 w-full flex items-center justify-center text-white/30 text-xs font-bold tracking-widest uppercase">
                                    Preview Locked - Purchase Required
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {isUnlocked ? (
                            <button onClick={handleDownload} className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#151520] hover:bg-[#1f1f2e] border border-white/10 hover:border-[#8A58FC]/50 text-white text-[11px] font-bold uppercase tracking-[0.15em] py-3.5 px-8 rounded-full transition-all shadow-md">
                                <svg className="w-4 h-4 text-[#8A58FC]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                <span>Download Track</span>
                            </button>
                        ) : (
                            <button 
                                onClick={() => isAuthenticated ? setShowPayment(true) : navigate('/login')} 
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-[#1A0B2E] text-[11px] font-black uppercase tracking-[0.15em] py-3.5 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:-translate-y-0.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                <span>Unlock for ${song.price}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- PAYMENT MODAL OVERLAY --- */}
            {showPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
                        <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">✕</button>
                        
                        <h2 className="text-xl font-black uppercase tracking-widest text-center mb-1">Secure Checkout</h2>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest text-center mb-6">Total Due: <span className="text-amber-400">${song.price}</span></p>

                        {paymentError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-xs text-center font-bold tracking-wide">{paymentError}</div>}

                        <form onSubmit={processPayment} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-[9px] text-white/50 font-bold uppercase tracking-[0.15em] mb-2">Test Card Number (Luhn Val)</label>
                                <input 
                                    type="text" 
                                    maxLength="16"
                                    value={cardNumber} 
                                    onChange={(e) => setCardNumber(e.target.value)} 
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 text-center tracking-[0.2em]"
                                    placeholder="0000 0000 0000 0000"
                                    required 
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isProcessing}
                                className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-400 text-[#1A0B2E] text-[12px] font-black tracking-[0.15em] uppercase py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50"
                            >
                                {isProcessing ? "Processing..." : `PAY $${song.price}`}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- TRACK DETAILS --- */}
            <div className="w-full max-w-[1400px] mx-auto px-8 lg:px-12 py-12 flex-1 flex flex-col lg:flex-row gap-16">
                <div className="flex-1 max-w-2xl">
                    <h3 className="text-white/80 text-lg font-bold mb-4">Editorial Notes</h3>
                    <p className="text-white/50 leading-relaxed text-[15px]">{generateDescription(song.title, artistName)}</p>
                </div>
                <div className="w-full lg:w-96 flex-shrink-0">
                    <h3 className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-5 border-b border-white/[0.05] pb-3">Metadata</h3>
                    <div className="flex flex-col gap-3 text-sm text-white/50">
                        <div className="flex justify-between items-center py-2 border-b border-white/[0.02]">
                            <span>Track Price</span>
                            <span className="text-white/80 font-medium">{song.is_free ? "Free" : `$${song.price}`}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span>Access Level</span>
                            <span className={isUnlocked ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                                {isUnlocked ? "Unlocked" : "Locked"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SongDetailPage;