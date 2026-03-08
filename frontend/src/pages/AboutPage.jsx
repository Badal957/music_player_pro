import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('access_token');

    return (
        <div className="min-h-screen w-full bg-[#05050A] text-white font-sans overflow-x-hidden selection:bg-purple-500/30 flex flex-col">
            
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#8A58FC] blur-[150px] opacity-10 rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#0ea5e9] blur-[150px] opacity-10 rounded-full"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-20 flex justify-between items-center px-8 py-5 bg-[#0a0a14]/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                        <span className="text-sm">🎧</span>
                    </div>
                    <div className="font-black text-xl tracking-widest uppercase text-white/90">StudioPro</div>
                </div>
                <div className="flex gap-6 items-center text-xs font-bold uppercase tracking-widest">
                    <a href="/" className="text-white/70 hover:text-white transition-colors">Home</a>
                    <a href="/about" className="text-[#8A58FC] hover:text-[#9f75ff] transition-colors">About</a>
                    <a href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</a>
                    {!isAuthenticated ? (
                        <a href="/login" className="ml-4 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-all">Login</a>
                    ) : (
                        <a href="/studio" className="ml-4 bg-[#8A58FC] hover:bg-[#7444E0] px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(138,88,252,0.4)]">Open Player</a>
                    )}
                </div>
            </nav>

            {/* Content */}
            <main className="relative z-10 max-w-[1000px] mx-auto px-6 py-20 flex-1 flex flex-col items-center text-center">
                <span className="bg-[#8A58FC]/10 text-[#D0B3FF] border border-[#8A58FC]/20 text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6">
                    Our Mission
                </span>
                <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-8 leading-tight drop-shadow-2xl">
                    Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8A58FC] to-[#0ea5e9]">Perfect Sound.</span>
                </h1>
                <p className="text-[#8B92B2] text-lg max-w-2xl font-medium leading-relaxed mb-16">
                    StudioPro was built for creators, by creators. We provide a highly curated, secure library of lossless audio tracks and soundscapes. Whether you are mixing a professional film score or producing content, our master-quality files ensure your project sounds exactly as intended.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                    <div className="bg-[#151520]/80 backdrop-blur-md border border-white/[0.05] rounded-2xl p-8 flex flex-col items-center hover:border-[#8A58FC]/30 transition-colors">
                        <span className="text-4xl font-black text-white mb-2">10k+</span>
                        <span className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">Lossless Tracks</span>
                    </div>
                    <div className="bg-[#151520]/80 backdrop-blur-md border border-white/[0.05] rounded-2xl p-8 flex flex-col items-center hover:border-emerald-500/30 transition-colors">
                        <span className="text-4xl font-black text-white mb-2">24-bit</span>
                        <span className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">Master Quality</span>
                    </div>
                    <div className="bg-[#151520]/80 backdrop-blur-md border border-white/[0.05] rounded-2xl p-8 flex flex-col items-center hover:border-amber-500/30 transition-colors">
                        <span className="text-4xl font-black text-white mb-2">100%</span>
                        <span className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">Secure Platform</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AboutPage;