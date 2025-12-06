import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import MatrixModel from './ThreeModel/RotatingModel';

// =================================================================
// 0. DATA: EVENT DETAILS DATABASE
// =================================================================

const EVENTS_DATA = {
    "PRE-EVENTS": {
        title: "PRE-EVENTS",
        description: "The hype begins early. Engage in high-stakes challenges before the main day.",
        color: "from-yellow-500/20 to-amber-600/20",
        subEvents: [
            { name: "Break the Ice", desc: "Ice Breaker Event." },
            { name: "Hack'O'Storm", desc: "The Ultimate Hackathon." },
            { name: "Battle of Valor", desc: "Valorant Tournament." }
        ]
    },
    TECHNICAL: {
        title: "TECHNICAL",
        description: "The backbone of Genesis. Prove your coding prowess and logical reasoning.",
        color: "from-cyan-500/20 to-blue-600/20",
        subEvents: [
            { name: "Debug Dash", desc: "Code Debugging Challenge." },
            { name: "Sketch Pitch", desc: "UI/UX Designing Competition." }
        ]
    },
    CULTURAL: {
        title: "CULTURAL",
        description: "Unleash your creativity. A stage for performers to showcase their talent.",
        color: "from-purple-500/20 to-pink-600/20",
        subEvents: [
            { name: "Clue Quest", desc: "Treasure Hunt." },
            { name: "Squid Game", desc: "Survival Challenges." },
            { name: "Joke Circuit", desc: "Standup Comedy." },
            { name: "Rock Chronicles", desc: "C-Rock (Battle of Bands)." },
            { name: "Style Matrix", desc: "Fashion Show." },
            { name: "Robo Rythm", desc: "Dance Competition." },
            { name: "MR & MS GENESIS", desc: "Personality Contest." }
        ]
    },
    GAMING: {
        title: "GAMING",
        description: "Enter the arena. Reflexes and strategy will decide the champions.",
        color: "from-green-500/20 to-emerald-600/20",
        subEvents: [
            { name: "Battle Nexus", desc: "BGMI Tournament." },
            { name: "Pitch Masters", desc: "FIFA Championship." }
        ]
    },
    SPORTS: {
        title: "SPORTS",
        description: "Physical prowess meets strategy. Dominate the field.",
        color: "from-orange-500/20 to-red-600/20",
        subEvents: [
            { name: "Goal Pulse", desc: "Football Tournament." }
        ]
    }
};

// =================================================================
// 1. ICONS
// =================================================================

const IconWrapper = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
)

const Gamepad2 = (props) => <IconWrapper {...props}><path d="M6 12h4"/><path d="M14 12h4"/><path d="M12 10v4"/><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></IconWrapper>
const Code = (props) => <IconWrapper {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></IconWrapper>
const Music = (props) => <IconWrapper {...props}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></IconWrapper>
const Trophy = (props) => <IconWrapper {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5h15a2.5 2.5 0 0 1 0 5H18"/><path d="M8 14l2-2 2 2 2-2 2 2"/><path d="M15 11l-2-2-2 2-2-2"/><path d="M6 15v-3a6.5 6.5 0 0 1 0-1.5 6.5 6.5 0 0 1 12 0 6.5 6.5 0 0 1 0 1.5v3"/><path d="M12 21h0.01"/></IconWrapper>
const Zap = (props) => <IconWrapper {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></IconWrapper>
const ChevronDown = (props) => <IconWrapper {...props}><path d="m6 9 6 6 6-6"/></IconWrapper>
const ExternalLink = (props) => <IconWrapper {...props}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></IconWrapper>
const User = (props) => <IconWrapper {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></IconWrapper>
const MapPin = (props) => <IconWrapper {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></IconWrapper>
const ArrowLeft = (props) => <IconWrapper {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></IconWrapper>
const Cpu = (props) => <IconWrapper {...props}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M20 15h2"/><path d="M9 2v2"/><path d="M9 20v2"/><path d="M2 9h2"/><path d="M20 9h2"/></IconWrapper>

// =================================================================
// 2. VISUAL EFFECTS COMPONENTS
// =================================================================

const MatrixRain = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);
        const columns = Math.floor(canvas.width / 20);
        const drops = Array(columns).fill(1);
        const chars = "01GENESIS8.0"; 
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0'; 
            ctx.font = '15px monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillStyle = Math.random() > 0.95 ? '#FFF' : '#0F0';
                ctx.fillText(text, i * 20, drops[i] * 20);
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 50);
        return () => { clearInterval(interval); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none" />;
};

const PowerSurge = () => {
    const [active, setActive] = useState(false)
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.95) { setActive(true); setTimeout(() => setActive(false), 50 + Math.random() * 100) }
        }, 3000)
        return () => clearInterval(interval)
    }, [])
    return <div className={`fixed inset-0 bg-white/5 z-50 pointer-events-none mix-blend-overlay transition-opacity duration-75 ${active ? "opacity-100" : "opacity-0"}`} />
}

const SpeedLines = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"
                style={{ left: `${10 + Math.random() * 80}%`, top: "-10%", height: '30vh', opacity: 0.3 }}
                animate={{ y: ["-100vh", "120vh"], opacity: [0, 0.5, 0] }}
                transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
            />
        ))}
    </div>
)

const ExplosiveEntry = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30, filter: "blur(4px)" }}
        whileInView={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1, delay: delay }}
        className="relative h-full"
    >
        {children}
        <motion.div initial={{ opacity: 0.8, scale: 1 }} whileInView={{ opacity: 0, scale: 1.2 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: "easeOut", delay: delay }} className="absolute inset-0 bg-cyan-400/10 rounded-xl pointer-events-none z-20" />
    </motion.div>
)

// --- STABLE CSS MATRIX CUBE (No 3D/WebGL Required) ---
const MatrixCube = ({ color = "green", size = 280 }) => {
    // Use the same props as your original component
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <MatrixModel
                color="purple" 
                size={300} 
                // Crucial: Set the correct path to your GLB file
                glbPath="/genesis_logo.glb" 
            />
        </div>
    );
    // const half = size / 2
    // const themes = {
    //     green: { border: "border-green-500/80", shadow: "shadow-[0_0_30px_rgba(34,197,94,0.2)]", blob: "bg-green-500/20" },
    //     purple: { border: "border-purple-500/80", shadow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]", blob: "bg-purple-500/20" },
    // }
    // const active = themes[color] || themes.green
    
    // // CSS-only Face component
    // const Face = ({ transform }) => (
    //     <div className={`absolute inset-0 border-2 ${active.border} bg-black/90 flex flex-col items-center justify-center overflow-hidden ${active.shadow}`} style={{ transform }}>
    //         <div className={`w-16 h-16 ${active.blob} blur-xl rounded-full absolute animate-pulse`}></div>
    //         <div className="text-[10px] text-white/20 font-mono leading-none break-all p-1">010101 101010 001100 110011 GENESIS 8.0 010101</div>
    //     </div>
    // )
    // return (
    //     <div className="relative flex items-center justify-center perspective-[1200px]">
    //         <motion.div className="relative" style={{ width: size, height: size, transformStyle: "preserve-3d" }}
    //             animate={{ rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] }}
    //             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
    //             <Face transform={`translateZ(${half}px)`} />
    //             <Face transform={`rotateY(180deg) translateZ(${half}px)`} />
    //             <Face transform={`rotateY(90deg) translateZ(${half}px)`} />
    //             <Face transform={`rotateY(-90deg) translateZ(${half}px)`} />
    //             <Face transform={`rotateX(90deg) translateZ(${half}px)`} />
    //             <Face transform={`rotateX(-90deg) translateZ(${half}px)`} />
    //         </motion.div>
            
    //     </div>
    // )
}

const HoloGyro = () => (
    <div className="relative flex items-center justify-center w-full max-w-[30rem] h-[30rem] opacity-40 pointer-events-none perspective-[1000px]">
        <motion.div animate={{ rotateX: 360, rotateY: 180 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed shadow-[0_0_25px_rgba(6,182,212,0.2)]" style={{ transformStyle: "preserve-3d" }} />
        <motion.div animate={{ rotateY: 360, rotateZ: 180 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-8 rounded-full border border-purple-500/30 border-dotted shadow-[0_0_25px_rgba(168,85,247,0.2)]" style={{ transformStyle: "preserve-3d" }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="w-24 h-24 bg-gradient-to-br from-cyan-400/40 to-purple-500/40 rounded-full blur-xl" />
    </div>
)

// FROZEN COUNTDOWN - Stays at 0
const Countdown = () => {
    const [timeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    return (
        <div className="flex space-x-4 md:space-x-8 font-mono text-cyan-400 mt-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <span className="text-3xl md:text-5xl font-bold tracking-widest backdrop-blur-sm bg-black/30 p-2 border border-cyan-500/30 rounded">{value.toString().padStart(2, "0")}</span>
                    <span className="text-xs uppercase tracking-widest mt-2 text-gray-500">{unit}</span>
                </div>
            ))}
        </div>
    )
}

// =================================================================
// 3. PAGE COMPONENTS
// =================================================================

const Hero = () => {
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const opacity = useTransform(scrollY, [0, 300], [1, 0])

    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
            <MatrixRain />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
            
            {/* CSS MATRIX CUBE (Stable) */}
            <div className="absolute z-0 mt-[-50px]">
                <MatrixCube color="green" size={280} />
            </div>
            
            <motion.div style={{ y: y1, opacity }} className="z-10 flex flex-col items-center text-center px-4 mt-8 pointer-events-none">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-4 flex items-center space-x-2 pointer-events-auto">
                    <span className="px-2 py-1 border border-green-500/30 rounded text-xs font-mono text-green-400 bg-green-900/10 backdrop-blur-sm">SYSTEM READY</span>
                    <span className="px-2 py-1 border border-cyan-500/30 rounded text-xs font-mono text-cyan-400 bg-cyan-900/10 backdrop-blur-sm">V 8.0</span>
                </motion.div>
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-4 select-none drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">GENESIS 8.0</h1>
                <p className="text-xl md:text-2xl font-light tracking-[0.2em] text-gray-400 mb-8 uppercase bg-black/40 backdrop-blur-sm p-2 rounded">The Rise of Next Generation</p>
                <Countdown />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-10 animate-bounce">
                    <ChevronDown className="w-8 h-8 text-gray-500" />
                </motion.div>
            </motion.div>
        </section>
    );
};

const AboutSection = () => (
    <section id="about" className="relative min-h-[60vh] bg-black flex items-center justify-center py-24 px-4 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-900/20 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">
                ABOUT <span className="text-cyan-400">GENESIS 8.0</span>
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-2xl text-gray-300 leading-relaxed space-y-8">
                <p>Genesis 8.0 marks the evolution of our digital frontier. Organized by the visionary minds of the BCA department at M.E.S College, it represents the convergence of culture, technology, and gaming.</p>
                <p>This year, we transcend boundaries with <span className="text-green-400 font-mono">GENESIS 8.0</span>. A nexus where code meets creativity and where the next generation of tech leaders rises.</p>
                <p className="text-cyan-400 font-mono text-sm md:text-base mt-8 opacity-80">// SYSTEM STATUS: ONLINE<br/>// PROTOCOL: ENGAGE</p>
            </motion.div>
        </div>
    </section>
)

const EventCard = ({ title, icon: Icon, desc, color, onClick }) => (
    <motion.div 
        whileHover={{ y: -10, scale: 1.02 }} 
        onClick={onClick}
        className={`relative group bg-gray-900/80 border border-gray-800 p-6 rounded-xl overflow-hidden cursor-pointer backdrop-blur-sm h-full flex flex-col`}
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-all duration-300 scale-150 group-hover:scale-100`} />
        <div className="relative z-10 flex flex-col h-full">
            <div className={`w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-gray-700 group-hover:border-white/40 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-mono tracking-wide group-hover:text-cyan-400 transition-colors">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed flex-grow">{desc}</p>
            <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
                <div className="flex items-center text-xs text-cyan-400 font-mono"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 animate-pulse"></span>ONLINE</div>
                <div className="text-xs text-gray-500 group-hover:text-white flex items-center gap-1">DETAILS <ExternalLink className="w-3 h-3" /></div>
            </div>
        </div>
    </motion.div>
)

const EventsGrid = ({ onEventSelect }) => (
    <section id="events" className="bg-black py-24 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 scale-50 md:scale-100"><HoloGyro /></div>
        <div className="max-w-7xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter animate-pulse">EVENT PROTOCOLS</h2>
                <div className="h-1 w-40 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto rounded-full"></div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ExplosiveEntry delay={0.1}><EventCard title="PRE-EVENTS" icon={Zap} desc="Ice Breakers, Hackathon, Valorant." color="from-yellow-500/20 to-amber-600/20" onClick={() => onEventSelect("PRE-EVENTS")} /></ExplosiveEntry>
                <ExplosiveEntry delay={0.2}><EventCard title="TECHNICAL" icon={Code} desc="Debugging, UI/UX Design." color="from-cyan-500/20 to-blue-600/20" onClick={() => onEventSelect("TECHNICAL")} /></ExplosiveEntry>
                <ExplosiveEntry delay={0.3}><EventCard title="CULTURAL" icon={Music} desc="Treasure Hunt, Squid Game, Dance." color="from-purple-500/20 to-pink-600/20" onClick={() => onEventSelect("CULTURAL")} /></ExplosiveEntry>
                <ExplosiveEntry delay={0.4}><EventCard title="GAMING" icon={Gamepad2} desc="BGMI, FIFA." color="from-green-500/20 to-emerald-600/20" onClick={() => onEventSelect("GAMING")} /></ExplosiveEntry>
                <ExplosiveEntry delay={0.5}><EventCard title="SPORTS" icon={Trophy} desc="Football (Goal Pulse)." color="from-orange-500/20 to-red-600/20" onClick={() => onEventSelect("SPORTS")} /></ExplosiveEntry>
            </div>
        </div>
    </section>
);

const Coordinators = () => (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 text-center relative overflow-hidden px-4">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30 z-0 scale-75 md:scale-100">
             <MatrixCube color="purple" size={300} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-white mb-12 tracking-wider">COMMAND CENTER</motion.h2>
            
            <div className="flex justify-center">
                <div className="w-full max-w-md">
                    <ExplosiveEntry delay={0.1}>
                        <div className="bg-gray-900/80 backdrop-blur-sm p-8 border border-gray-800 rounded-xl hover:border-cyan-500/50 transition-all duration-300 group h-full">
                            <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-gray-700 group-hover:border-cyan-400 transition-colors"><User className="w-10 h-10 text-gray-400" /></div>
                            <h3 className="text-xl font-bold text-white">Rahil Jamadar</h3>
                            <p className="text-cyan-400 text-sm font-mono mb-4">EVENT CO-ORDINATOR</p>
                        </div>
                    </ExplosiveEntry>
                </div>
            </div>
        </div>
    </section>
);

const ContactSection = () => (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">ESTABLISH <span className="text-purple-500">UPLINK</span></h2>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                className="w-full max-w-2xl flex flex-col space-y-8"
            >
                <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-8 rounded-2xl flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold text-white flex items-center mb-4">
                        <MapPin className="mr-3 text-cyan-400"/> Base Coordinates
                    </h3>
                    <p className="text-gray-400 text-lg">
                        M.E.S Vasant Joshi College of Arts & Commerce<br />
                        Zuarinagar, Goa - 403726
                    </p>
                </div>

                <a href="https://www.google.com/maps/search/M.E.S+Vasant+Joshi+College+of+Arts+%26+Commerce+Zuarinagar+Goa" target="_blank" rel="noopener noreferrer" className="group w-full h-80 bg-gray-900 rounded-2xl border border-gray-800 relative overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.1)] hover:border-cyan-500/50 transition-all duration-300 cursor-pointer">
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500 animate-pulse" />
                        <div className="absolute top-0 left-1/2 h-full w-[1px] bg-purple-500 animate-pulse" />
                        <div className="w-32 h-32 border border-white/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-20" />
                        <div className="w-64 h-64 border border-cyan-500/10 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <MapPin className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-bounce" />
                        <div className="w-4 h-2 bg-red-500/50 rounded-full blur-sm mt-1 animate-pulse" />
                        <span className="mt-4 text-xs font-mono text-cyan-400 bg-black/80 px-4 py-2 border border-cyan-500/30 rounded backdrop-blur group-hover:text-white group-hover:border-cyan-400 transition-colors">
                            TARGET_LOCKED // CLICK_TO_NAVIGATE
                        </span>
                    </div>
                </a>
            </motion.div>
        </div>
    </section>
)

const Navbar = ({ onHomeClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-gray-800 py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <div onClick={onHomeClick} className="text-xl font-bold font-mono tracking-tighter text-white cursor-pointer hover:text-cyan-400 transition-colors">GENESIS <span className="text-cyan-400">8.0</span></div>
                <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
                    <button onClick={onHomeClick} className="hover:text-cyan-400 transition-colors uppercase">Home</button>
                    <a href="#about" onClick={onHomeClick} className="hover:text-cyan-400 transition-colors">ABOUT</a>
                    <a href="#events" onClick={onHomeClick} className="hover:text-cyan-400 transition-colors">EVENTS</a>
                    <a href="#contact" onClick={onHomeClick} className="hover:text-cyan-400 transition-colors">CONTACT</a>
                </div>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-full text-sm transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(8,145,178,0.5)]">REGISTER</button>
            </div>
        </motion.nav>
    );
}

// =================================================================
// 4. NEW: INDIVIDUAL EVENT PAGE COMPONENT
// =================================================================

const EventDetailsPage = ({ category, onBack }) => {
    const data = EVENTS_DATA[category];
    
    // Fallback if data isn't found
    if (!data) return <div>Data not found</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }}
            className="min-h-screen bg-black pt-24 px-4 relative overflow-hidden"
        >
             {/* Background Effects */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
             <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b ${data.color} blur-[120px] opacity-30 pointer-events-none rounded-full`} />

            <div className="max-w-7xl mx-auto relative z-10">
                <button onClick={onBack} className="flex items-center text-cyan-400 hover:text-white transition-colors mb-8 font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> RETURN TO BASE
                </button>

                <div className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">{data.title}</h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed border-l-4 border-cyan-500 pl-6">{data.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
                    {data.subEvents.map((sub, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-cyan-500/50 hover:bg-gray-900 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{sub.name}</h3>
                                <div className="px-2 py-1 bg-gray-800 rounded text-xs font-mono text-gray-400">#0{index + 1}</div>
                            </div>
                            <p className="text-gray-400">{sub.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 text-center backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to Compete?</h3>
                    <p className="text-gray-400 mb-6">Slots are filling up fast for {data.title} events.</p>
                    <button className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(8,145,178,0.4)]">
                        REGISTER FOR {data.title}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// =================================================================
// 5. MAIN APP COMPONENT (CONTROLLER)
// =================================================================

export default function GenesisLanding() {
    // State to manage which page is shown: 'home' or a specific event category
    const [view, setView] = useState('home');

    // Function to go to top when switching views
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div className="bg-black min-h-screen text-white w-full overflow-hidden font-sans">
            <PowerSurge />
            <SpeedLines />
            
            {/* Navbar now handles "Home" click to reset view */}
            <Navbar onHomeClick={() => { setView('home'); scrollToTop(); }} />

            <main>
                <AnimatePresence mode="wait">
                    {view === 'home' ? (
                        <motion.div 
                            key="home"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        >
                            <Hero />
                            <AboutSection />
                            {/* EventsGrid now passes the category clicked to the state */}
                            <EventsGrid onEventSelect={(category) => { setView(category); scrollToTop(); }} />
                            <Coordinators />
                            <ContactSection />
                        </motion.div>
                    ) : (
                        <EventDetailsPage 
                            key="details" 
                            category={view} 
                            onBack={() => { setView('home'); scrollToTop(); }} 
                        />
                    )}
                </AnimatePresence>
            </main>

            <footer className="bg-black border-t border-gray-900 py-12 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-8 md:mb-0 text-center md:text-left">
                        <h2 className="text-3xl font-black text-white tracking-tighter mb-2">GENESIS 8.0</h2>
                        <p className="text-gray-500 text-sm max-w-xs">Murgaon Education Society's Vasant Joshi College of Arts & Commerce</p>
                    </div>
                    <div className="mt-8 text-center text-gray-800 text-xs font-mono">SYSTEM_ID: GEN_8.0 // TERMINAL_END</div>
                </div>
            </footer>
            
            {/* Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>
    );
}