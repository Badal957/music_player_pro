import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('access_token');
    
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Sending...');
        // Simulate sending a message
        setTimeout(() => {
            setStatus('Message sent successfully. We will be in touch!');
            setFormData({ name: '', email: '', message: '' });
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full bg-[#05050A] text-white font-sans overflow-x-hidden selection:bg-purple-500/30 flex flex-col">
            
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-pink-600 blur-[180px] opacity-10 rounded-full"></div>
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
                    <a href="/about" className="text-white/70 hover:text-white transition-colors">About</a>
                    <a href="/contact" className="text-[#8A58FC] hover:text-[#9f75ff] transition-colors">Contact</a>
                    {!isAuthenticated ? (
                        <a href="/login" className="ml-4 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-all">Login</a>
                    ) : (
                        <a href="/studio" className="ml-4 bg-[#8A58FC] hover:bg-[#7444E0] px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(138,88,252,0.4)]">Open Player</a>
                    )}
                </div>
            </nav>

            {/* Content */}
            <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 w-full">
                
                <div className="flex-1 w-full max-w-md text-center lg:text-left">
                    <h1 className="text-5xl font-black text-white tracking-tight mb-4">Get in Touch</h1>
                    <p className="text-[#8B92B2] text-lg font-medium mb-8">
                        Have a question about licensing, technical issues, or platform access? Drop us a line.
                    </p>
                    
                    <div className="flex flex-col gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                            <span className="text-xl">✉️</span>
                            <span>support@studiopro.audio</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                            <span className="text-xl">📍</span>
                            <span>Global Remote Studio</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="w-full max-w-md bg-[#111]/80 backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-8 shadow-2xl">
                    {status && (
                        <div className={`p-4 rounded-xl mb-6 text-xs text-center font-bold tracking-wide ${status.includes('successfully') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#8A58FC]/10 text-[#8A58FC] border border-[#8A58FC]/20'}`}>
                            {status}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-[10px] text-white/50 font-bold uppercase tracking-[0.15em] mb-2">Name</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all" required />
                        </div>
                        <div>
                            <label className="block text-[10px] text-white/50 font-bold uppercase tracking-[0.15em] mb-2">Email</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all" required />
                        </div>
                        <div>
                            <label className="block text-[10px] text-white/50 font-bold uppercase tracking-[0.15em] mb-2">Message</label>
                            <textarea rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all resize-none" required></textarea>
                        </div>
                        <button type="submit" className="w-full mt-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-[12px] font-bold tracking-[0.15em] uppercase py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(219,39,119,0.3)]">
                            Send Message
                        </button>
                    </form>
                </div>

            </main>
        </div>
    );
};

export default ContactPage;