import React from 'react';
import { useNavigate } from 'react-router-dom';

const DisclaimerPage = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('access_token');

    return (
        <div className="min-h-screen w-full bg-[#05050A] text-white font-sans overflow-x-hidden selection:bg-purple-500/30 flex flex-col">
            
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#8A58FC] blur-[150px] opacity-10 rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-pink-600 blur-[150px] opacity-10 rounded-full"></div>
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
                    <button onClick={() => navigate('/')} className="text-white/70 hover:text-white transition-colors">Home</button>
                    <button onClick={() => navigate('/about')} className="text-white/70 hover:text-white transition-colors">About</button>
                    <button onClick={() => navigate('/contact')} className="text-white/70 hover:text-white transition-colors">Contact</button>
                    {!isAuthenticated ? (
                        <button onClick={() => navigate('/login')} className="ml-4 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-all">Login</button>
                    ) : (
                        <button onClick={() => navigate('/profile')} className="ml-4 bg-[#8A58FC] hover:bg-[#7444E0] px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(138,88,252,0.4)]">Profile</button>
                    )}
                </div>
            </nav>

            {/* Content */}
            <main className="relative z-10 max-w-[800px] mx-auto px-6 py-20 flex-1 flex flex-col w-full">
                
                <div className="mb-12 border-b border-white/10 pb-8">
                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6 inline-block">
                        Legal Notice
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-4 mb-4">
                        Platform Disclaimer
                    </h1>
                    <p className="text-[#8B92B2] text-sm font-medium leading-relaxed">
                        Last Updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="space-y-8 text-white/70 text-sm leading-relaxed">
                    
                    {/* Section 1 */}
                    <section className="bg-[#111]/50 border border-white/5 rounded-2xl p-8 hover:bg-[#111] transition-colors">
                        <h2 className="text-white text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="text-[#8A58FC]">01.</span> Educational & Research Purposes
                        </h2>
                        <p>
                            StudioPro is a simulated application developed strictly for portfolio demonstration, educational purposes, and software research. It is not a registered business entity and does not operate as a commercial digital storefront.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-[#111]/50 border border-white/5 rounded-2xl p-8 hover:bg-[#111] transition-colors">
                        <h2 className="text-white text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="text-amber-400">02.</span> Simulated Financial Transactions
                        </h2>
                        <p className="mb-4">
                            <strong>No real money is processed on this platform.</strong> The payment gateway integrated into StudioPro is a highly controlled mock simulator designed for testing security logic, specifically the Luhn algorithm for credit card validation.
                        </p>
                        <p>
                            Any financial data, prices, or "acquired" assets displayed on user profiles are simulated variables stored locally or in a test database. Do not enter real credit card information on this site.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-[#111]/50 border border-white/5 rounded-2xl p-8 hover:bg-[#111] transition-colors">
                        <h2 className="text-white text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="text-emerald-400">03.</span> Audio Licensing & Copyright
                        </h2>
                        <p>
                            All audio tracks, album art, and metadata utilized within this platform are placeholders used exclusively to demonstrate the application's audio engineering features (such as the Web Audio API visualizer and parametric EQ). StudioPro claims no ownership over these assets.
                        </p>
                    </section>

                </div>

            </main>
            
            {/* Simple Footer */}
            <footer className="relative z-10 border-t border-white/5 bg-[#05050A] py-8 text-center text-white/30 text-xs font-bold tracking-widest uppercase">
                <p>© {new Date().getFullYear()} StudioPro Simulator. <a href="/disclaimer" className="text-white/50 hover:text-white transition-colors ml-2">Disclaimer</a></p>
            </footer>
        </div>
    );
};

export default DisclaimerPage;