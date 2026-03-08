import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // NEW: State to track password visibility
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                navigate('/');
            } else {
                setError('Invalid username or password. Please try again.');
            }
        } catch (err) {
            setError('Failed to connect to the server.');
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#05050A] relative overflow-hidden font-sans">
            
            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0 bg-[#08080c]">
                <div className="absolute top-[20%] right-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600 blur-[180px] opacity-10 rounded-full pointer-events-none"></div>
            </div>

            {/* GLASSMORPHIC LOGIN BOX */}
            <div className="relative z-10 w-full max-w-md bg-[#111]/80 backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-10 shadow-2xl">
                
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20">
                        <span className="text-2xl">🎧</span>
                    </div>
                    <h2 className="text-white text-2xl font-black tracking-widest uppercase">Studio Access</h2>
                    <p className="text-white/40 text-[10px] mt-2 font-bold uppercase tracking-[0.2em]">Login to your account</p>
                </div>
                
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-xs text-center font-bold tracking-wide leading-relaxed">{error}</div>}
                
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    
                    {/* Username Input */}
                    <div>
                        <label className="block text-[10px] text-white/50 font-bold uppercase tracking-[0.15em] mb-2">Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                            placeholder="Enter your username"
                            required 
                        />
                    </div>
                    
                    {/* Secure Password Input with Toggle */}
                    <div>
                        <label className="block text-[10px] text-white/50 font-bold uppercase tracking-[0.15em] mb-2">Password</label>
                        <div className="relative">
                            <input 
                                // NEW: Dynamically change type based on state
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                                placeholder="••••••••"
                                required 
                            />
                            {/* NEW: The Eye Toggle Button */}
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full mt-4 bg-[#8A58FC] hover:bg-[#7444E0] text-white text-[12px] font-bold tracking-[0.15em] uppercase py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(138,88,252,0.3)]">
                        ENTER STUDIO
                    </button>
                </form>
                
                <p className="text-center mt-8 text-white/40 text-[11px] font-bold uppercase tracking-wider">
                    Need an account? <a href="/signup" className="text-purple-400 hover:text-purple-300 ml-1 transition-colors">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;