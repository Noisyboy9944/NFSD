import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// =================================================================
// INLINE SVG ICON COMPONENTS
// =================================================================

const IconWrapper = ({ children, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {children}
    </svg>
)

const Cpu = (props) => (
    <IconWrapper {...props}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M20 15h2"/><path d="M9 2v2"/><path d="M9 20v2"/><path d="M2 9h2"/><path d="M20 9h2"/></IconWrapper>
)

const Gamepad2 = (props) => (
    <IconWrapper {...props}><path d="M6 12h4"/><path d="M14 12h4"/><path d="M12 10v4"/><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></IconWrapper>
)

const Code = (props) => (
    <IconWrapper {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></IconWrapper>
)

const Music = (props) => (
    <IconWrapper {...props}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></IconWrapper>
)

const Trophy = (props) => (
    <IconWrapper {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5h15a2.5 2.5 0 0 1 0 5H18"/><path d="M8 14l2-2 2 2 2-2 2 2"/><path d="M15 11l-2-2-2 2-2-2"/><path d="M6 15v-3a6.5 6.5 0 0 1 0-1.5 6.5 6.5 0 0 1 12 0 6.5 6.5 0 0 1 0 1.5v3"/><path d="M12 21h0.01"/></IconWrapper>
)

const Zap = (props) => (
    <IconWrapper {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></IconWrapper>
)

const ChevronDown = (props) => (
    <IconWrapper {...props}><path d="m6 9 6 6 6-6"/></IconWrapper>
)

const ExternalLink = (props) => (
    <IconWrapper {...props}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></IconWrapper>
)

const Terminal = (props) => (
    <IconWrapper {...props}><polyline points="4 17 10 11 4 5"/><line x2="20" y2="19" x1="12" y1="19"/></IconWrapper>
)

const User = (props) => (
    <IconWrapper {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></IconWrapper>
)

// =================================================================
// CORE ANIMATION COMPONENTS
// =================================================================

const MatrixRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resize();
        window.addEventListener('resize', resize);

        const columns = Math.floor(canvas.width / 20);
        const drops = Array(columns).fill(1);
        const chars = "0123456789ABCDEF"; // Hex characters

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0'; // Matrix Green
            ctx.font = '15px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                
                // Randomly brighter characters for the "leading" edge effect
                if (Math.random() > 0.95) {
                     ctx.fillStyle = '#FFF'; 
                } else {
                     ctx.fillStyle = '#0F0';
                }
                
                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none" />;
};

const PowerSurge = () => {
    const [active, setActive] = useState(false)
    useEffect(() => {
        const triggerSurge = () => {
            if (Math.random() > 0.85) {
                setActive(true)
                setTimeout(() => setActive(false), 50 + Math.random() * 100)
            }
        }
        const interval = setInterval(triggerSurge, 3000)
        return () => clearInterval(interval)
    }, [])
    return (
        <div
            className={`fixed inset-0 bg-white/5 z-50 pointer-events-none mix-blend-overlay transition-opacity duration-75 ${
                active ? "opacity-100" : "opacity-0"
            }`}
        />
    )
}

const SpeedLines = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: "-10%",
                        height: '30vh',
                        opacity: 0.3,
                    }}
                    animate={{
                        y: ["-100vh", "120vh"],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    )
}

const ExplosiveEntry = ({ children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 1,
                delay: delay,
            }}
            className="relative h-full"
        >
            {children}
            <motion.div
                initial={{ opacity: 0.8, scale: 1 }}
                whileInView={{ opacity: 0, scale: 1.2 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: delay }}
                className="absolute inset-0 bg-cyan-400/10 rounded-xl pointer-events-none z-20"
            />
        </motion.div>
    )
}

const HoloPhoenix = ({ size = 300 }) => {
    // Using a simpler SVG based placeholder to avoid 3D context crashes in preview
    // In a real environment with @react-three/fiber properly set up, you could swap this
    // back to the 3D Canvas implementation.
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <motion.div
                className="w-full h-full relative"
                animate={{ rotateY: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
                 <div className="absolute inset-0 flex items-center justify-center">
                   <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_25px_cyan]">
                        {/* Stylized Phoenix/Wing Shape */}
                        <path d="M50 20 C 30 35, 10 45, 5 60 C 15 55, 30 50, 50 65 C 70 50, 85 55, 95 60 C 90 45, 70 35, 50 20 Z M 50 65 C 45 80, 40 90, 50 100 C 60 90, 55 80, 50 65 Z" 
                              fill="none" stroke="cyan" strokeWidth="2" />
                        <path d="M20 45 Q 35 55 50 40 Q 65 55 80 45" fill="none" stroke="purple" strokeWidth="1" opacity="0.8" />
                        <circle cx="50" cy="50" r="2" fill="white" className="animate-pulse" />
                   </svg>
                </div>
            </motion.div>
             {/* Static Glow behind */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse" />
        </div>
    )
}

const MatrixCube = ({ color = "green", size = 280 }) => {
    const half = size / 2
    const generateMatrixText = () => {
        const chars = "ABCDEF0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ"
        return Array(400).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join("")
    }

    const themes = {
        green: {
            border: "border-green-500/80",
            bg: "bg-black/90",
            shadow: "shadow-[0_0_30px_rgba(34,197,94,0.2)]",
            text: "text-green-500/40",
            inner: "border-green-400/30",
            blob: "bg-green-500/20",
        },
        purple: {
            border: "border-purple-500/80",
            bg: "bg-black/90",
            shadow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]",
            text: "text-purple-500/40",
            inner: "border-purple-400/30",
            blob: "bg-purple-500/20",
        },
        cyan: {
            border: "border-cyan-500/80",
            bg: "bg-black/90",
            shadow: "shadow-[0_0_30px_rgba(6,182,212,0.2)]",
            text: "text-cyan-500/40",
            inner: "border-cyan-400/30",
            blob: "bg-cyan-500/20",
        },
    }

    const activeTheme = themes[color] || themes.green

    const Face = ({ transform }) => (
        <div
            className={`absolute inset-0 border-2 ${activeTheme.border} ${activeTheme.bg} flex flex-col items-center justify-center overflow-hidden ${activeTheme.shadow}`}
            style={{ transform }}
        >
            <div className={`absolute inset-0 ${activeTheme.text} font-mono text-[10px] break-all p-1 leading-3 select-none opacity-70`}>
                {generateMatrixText()}
            </div>
            <div className={`absolute inset-4 border ${activeTheme.inner} rounded-sm`}></div>
            <div className={`w-16 h-16 ${activeTheme.blob} blur-xl rounded-full absolute animate-pulse`}></div>
        </div>
    )

    return (
        <div className="relative flex items-center justify-center perspective-[1200px]">
            <motion.div
                className="relative"
                style={{ width: size, height: size, transformStyle: "preserve-3d" }}
                animate={{ rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <Face transform={`translateZ(${half}px)`} />
                <Face transform={`rotateY(180deg) translateZ(${half}px)`} />
                <Face transform={`rotateY(90deg) translateZ(${half}px)`} />
                <Face transform={`rotateY(-90deg) translateZ(${half}px)`} />
                <Face transform={`rotateX(90deg) translateZ(${half}px)`} />
                <Face transform={`rotateX(-90deg) translateZ(${half}px)`} />
            </motion.div>
        </div>
    )
}

const HoloGyro = () => {
    return (
        <div className="relative flex items-center justify-center w-full max-w-[30rem] h-[30rem] opacity-40 pointer-events-none perspective-[1000px]">
            <motion.div
                animate={{ rotateX: 360, rotateY: 180 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                style={{ transformStyle: "preserve-3d" }}
            />
            <motion.div
                animate={{ rotateY: 360, rotateZ: 180 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border border-purple-500/30 border-dotted shadow-[0_0_25px_rgba(168,85,247,0.2)]"
                style={{ transformStyle: "preserve-3d" }}
            />
            <motion.div
                animate={{ rotateX: 180, rotateZ: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 rounded-full border border-white/20"
                style={{ transformStyle: "preserve-3d" }}
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-cyan-400/40 to-purple-500/40 rounded-full blur-xl"
            />
        </div>
    )
}

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const eventDate = new Date("2025-04-15T09:00:00").getTime()
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = eventDate - now
            if (distance < 0) {
                clearInterval(interval)
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                })
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex space-x-4 md:space-x-8 font-mono text-cyan-400 mt-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <span className="text-3xl md:text-5xl font-bold tracking-widest backdrop-blur-sm bg-black/30 p-2 border border-cyan-500/30 rounded">
                        {value.toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs uppercase tracking-widest mt-2 text-gray-500">{unit}</span>
                </div>
            ))}
        </div>
    )
}

const EventCard = ({ title, icon: Icon, desc, color }) => {
    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
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
                    <div className="flex items-center text-xs text-cyan-400 font-mono">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 animate-pulse"></span>
                        ONLINE
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors transform group-hover:rotate-45 duration-300" />
                </div>
            </div>
        </motion.div>
    )
}

const TimelineItem = ({ side, title, content, icon: Icon, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: side === "left" ? -100 : 100, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
            className={`flex w-full ${side === "left" ? "md:justify-start" : "md:justify-end"} mb-32 relative md:ml-0 ml-12`}
        >
            <div className="absolute -left-[37px] md:left-auto md:hidden top-0 w-4 h-4 bg-black border border-cyan-500 rounded-full z-10 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <div className={`md:w-1/2 w-full ${side === "left" ? 'md:pr-8 md:text-right md:mr-auto' : 'md:pl-8 md:text-left md:ml-auto'} relative`}>
                <div className={`hidden md:block absolute top-0 w-4 h-4 bg-black border border-cyan-500 rounded-full z-10 shadow-[0_0_10px_rgba(6,182,212,0.5)] ${side === "left" ? "-right-[9px]" : "-left-[9px]"}`} />
                <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-8 rounded-2xl hover:border-cyan-500 transition-colors duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] group">
                    <Icon className={`w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300 ${side === "left" ? "md:ml-auto" : ""}`} />
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-wider">{title}</h3>
                    <p className="text-gray-400 leading-relaxed">{content}</p>
                </div>
            </div>
        </motion.div>
    )
}

// =================================================================
// MAIN SECTIONS
// =================================================================

const Hero = () => {
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const opacity = useTransform(scrollY, [0, 300], [1, 0])

    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
            <MatrixRain />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
            
            {/* Holographic Phoenix Component (Replaces unstable 3D loader for preview) */}
            <div className="absolute z-0 mt-[-50px]">
                <HoloPhoenix size={400} />
            </div>
            
            <motion.div style={{ y: y1, opacity }} className="z-10 flex flex-col items-center text-center px-4 mt-8 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-4 flex items-center space-x-2 pointer-events-auto"
                >
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

const ScrollyTellingSection = () => {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] })
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

    return (
        <section ref={containerRef} className="relative min-h-[200vh] bg-black py-20">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-800 transform md:-translate-x-1/2">
                <motion.div style={{ height: lineHeight }} className="w-full bg-gradient-to-b from-cyan-500 via-purple-500 to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
            </div>
            <div className="max-w-6xl mx-auto relative px-4 md:px-0">
                <TimelineItem side="left" icon={Terminal} title="THE ORIGIN" content="'Genesis' signifies the birth of an idea. Organized by the BCA department, it blends cultural, technical, and gaming realms." delay={0} />
                <TimelineItem side="right" icon={Cpu} title="THE NEXUS" content="A digital playground where intellect meets artistry. We foster creativity, competition, and community spirit through code and culture." delay={0.2} />
                <TimelineItem side="left" icon={Zap} title="THE ENERGY" content="From hackathons to dance battles, Genesis embodies youthful vigor and scholarly excellence. Join the revolution." delay={0.4} />
            </div>
        </section>
    );
};

const EventsGrid = () => {
    return (
        <section className="bg-black py-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 scale-50 md:scale-100"><HoloGyro /></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter animate-pulse">EVENT PROTOCOLS</h2>
                    <div className="h-1 w-40 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto rounded-full"></div>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ExplosiveEntry delay={0.1}><EventCard title="TECHNICAL" icon={Code} desc="Hackathons, Debugging, Web Design. Prove your logic in the digital arena." color="from-cyan-500/20 to-blue-600/20" /></ExplosiveEntry>
                    <ExplosiveEntry delay={0.2}><EventCard title="GAMING" icon={Gamepad2} desc="Valorant, BGMI, FIFA. dominate the server and claim victory." color="from-green-500/20 to-emerald-600/20" /></ExplosiveEntry>
                    <ExplosiveEntry delay={0.3}><EventCard title="CULTURAL" icon={Music} desc="Dance, Fashion Show, Battle of Bands. Unleash your artistic soul." color="from-purple-500/20 to-pink-600/20" /></ExplosiveEntry>
                    <ExplosiveEntry delay={0.4}><EventCard title="SPORTS" icon={Trophy} desc="Futsal, Badminton, Cricket. Physical prowess meets strategy." color="from-orange-500/20 to-red-600/20" /></ExplosiveEntry>
                    <ExplosiveEntry delay={0.5}><EventCard title="PRE-EVENTS" icon={Zap} desc="Reel making, Photography, Treasure Hunt. The excitement begins early." color="from-yellow-500/20 to-amber-600/20" /></ExplosiveEntry>
                    <ExplosiveEntry delay={0.6}><EventCard title="ROBOTICS" icon={Cpu} desc="Line follower, Robo wars. Build machines that conquer." color="from-indigo-500/20 to-blue-600/20" /></ExplosiveEntry>
                </div>
            </div>
        </section>
    );
};

const Coordinators = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-black to-gray-900 text-center relative overflow-hidden px-4">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30 z-0 scale-75 md:scale-100"><MatrixCube color="purple" size={200} /></div>
            <div className="max-w-4xl mx-auto relative z-10">
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-white mb-12 tracking-wider">COMMAND CENTER</motion.h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <ExplosiveEntry delay={0.1}>
                        <div className="bg-gray-900/80 backdrop-blur-sm p-8 border border-gray-800 rounded-xl hover:border-cyan-500/50 transition-all duration-300 group h-full">
                            <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-gray-700 group-hover:border-cyan-400 transition-colors"><User className="w-10 h-10 text-gray-400" /></div>
                            <h3 className="text-xl font-bold text-white">Shravan Hiremath</h3>
                            <p className="text-cyan-400 text-sm font-mono mb-4">EVENT CO-ORDINATOR</p>
                        </div>
                    </ExplosiveEntry>
                    <ExplosiveEntry delay={0.3}>
                        <div className="bg-gray-900/80 backdrop-blur-sm p-8 border border-gray-800 rounded-xl hover:border-purple-500/50 transition-all duration-300 group h-full">
                            <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-gray-700 group-hover:border-purple-400 transition-colors"><User className="w-10 h-10 text-gray-400" /></div>
                            <h3 className="text-xl font-bold text-white">Sanath Nayak</h3>
                            <p className="text-purple-400 text-sm font-mono mb-4">ASST. CO-ORDINATOR</p>
                        </div>
                    </ExplosiveEntry>
                </div>
            </div>
        </section>
    );
};

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-gray-800 py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <div className="text-xl font-bold font-mono tracking-tighter text-white">GENESIS <span className="text-cyan-400">8.0</span></div>
                <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
                    <a href="#about" className="hover:text-cyan-400 transition-colors">ABOUT</a>
                    <a href="#events" className="hover:text-cyan-400 transition-colors">EVENTS</a>
                    <a href="#schedule" className="hover:text-cyan-400 transition-colors">SCHEDULE</a>
                    <a href="#contact" className="hover:text-cyan-400 transition-colors">CONTACT</a>
                </div>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2 px-6 rounded-full text-sm transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(8,145,178,0.5)]">REGISTER</button>
            </div>
        </motion.nav>
    );
}


export default function GenesisLanding() {
    return (
        <div className="bg-black min-h-screen text-white w-full overflow-hidden font-sans">
            <PowerSurge />
            <SpeedLines />
            <Navbar />
            <main>
                <Hero />
                <ScrollyTellingSection />
                <EventsGrid />
                <Coordinators />
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
            {/* Global Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>
    );
}