"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Package, Shield, Box, Zap, Lock, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { MouseGlow } from "@/components/ui/animations/MouseGlow";
import { FloatingParticles } from "@/components/ui/animations/FloatingParticles";
import { MagneticButton } from "@/components/ui/animations/MagneticButton";
import { TiltCard } from "@/components/ui/animations/TiltCard";
import { ScrollReveal } from "@/components/ui/animations/ScrollReveal";
import { NumberCounter } from "@/components/ui/animations/NumberCounter";
import { ScrollProgress } from "@/components/ui/animations/ScrollProgress";
import { Preloader } from "@/components/ui/animations/Preloader";
import { TypingPlaceholder } from "@/components/ui/animations/TypingPlaceholder";
import { FloatingIcons } from "@/components/ui/animations/FloatingIcons";
import { MouseParallax } from "@/components/ui/animations/MouseParallax";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-foreground overflow-hidden font-sans selection:bg-purple-500/30">
      <Preloader />
      <ScrollProgress />
      
      {/* Aurora Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none aurora-bg" />

      <MouseGlow />
      <FloatingParticles />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] animate-pan-grid pointer-events-none" />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${scrolled ? "backdrop-blur-xl bg-[#0a0a0f]/70 border-white/10 py-4 shadow-2xl" : "py-6"}`}>
        <div className="flex items-center justify-between px-6 max-w-7xl mx-auto md:px-8">
          <motion.div 
            className="flex items-center gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 shadow-[0_0_15px_rgba(147,51,234,0.5)] overflow-hidden">
                <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-300" />
                <Package className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white group-hover:text-purple-400 transition-colors duration-300">AssetVault</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#solutions" className="hover:text-white transition-colors">Solutions</Link>
              <Link href="#security" className="hover:text-white transition-colors">Security</Link>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 font-medium rounded-full px-6">Login</Button>
            </Link>
            <MagneticButton>
              <Link href="/register">
                <Button className="btn-shine bg-white text-black hover:bg-gray-100 font-medium rounded-full px-6 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  Get Started
                </Button>
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-32 md:pt-48 pb-20 px-4 text-center">
        
        <FloatingIcons />

        {/* Badge */}
        <MouseParallax depth={0.4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-sm font-medium backdrop-blur-md"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span>The new standard for asset management</span>
          </motion.div>
        </MouseParallax>

        <MouseParallax depth={0.8}>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] max-w-5xl text-white">
            <motion.span 
              className="inline-block"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Management
            </motion.span>{" "}
            <motion.span 
              className="inline-block"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              with an
            </motion.span>
            <br className="hidden sm:block" />{" "}
            <motion.span 
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-text"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Eye for Detail
            </motion.span>
          </h1>
        </MouseParallax>

        <MouseParallax depth={0.6}>
          <motion.p 
            className="text-lg md:text-2xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            Build your ultimate digital vault today. 
            Start from receipts, warranties, or manual entry, then track it all effortlessly.
          </motion.p>
        </MouseParallax>

        {/* Central Action Card */}
        <MouseParallax depth={1.2}>
          <motion.div 
            className="relative w-full max-w-3xl group mx-auto z-20"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          >
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-600/50 via-blue-500/50 to-pink-500/50 opacity-40 group-hover:opacity-100 blur-md transition-opacity duration-700" />
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 opacity-20 group-hover:opacity-60 transition-opacity duration-700" />
          
          <div className="relative bg-[#110e1b]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 sm:p-3 shadow-[0_0_40px_rgba(147,51,234,0.2)] flex flex-col sm:flex-row items-center gap-3">
            
            <div className="flex-1 w-full flex items-center bg-black/40 rounded-xl px-4 py-3 sm:py-0 sm:h-14 border border-white/5 group-hover:border-white/10 transition-colors overflow-hidden">
              <Lock className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
              <TypingPlaceholder className="bg-transparent border-none outline-none text-white w-full text-sm sm:text-base h-full py-3" />
            </div>
            
            <div className="flex items-center justify-between gap-2 w-full sm:w-auto px-1 sm:px-0">
              <MagneticButton className="flex-1 sm:flex-none">
                <Link href="/register" className="block w-full">
                  <Button className="w-full sm:w-auto h-12 sm:h-14 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl gap-2 transition-all">
                    <Box className="w-4 h-4 text-blue-400" /> 
                    <span className="hidden sm:inline">Add Asset</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </Link>
              </MagneticButton>
              
              <MagneticButton className="flex-1 sm:flex-none">
                <Link href="/login" className="block w-full">
                  <Button className="btn-shine w-full sm:w-auto h-12 sm:h-14 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl gap-2 transition-all">
                    <Shield className="w-4 h-4 text-emerald-400" /> 
                    <span className="hidden sm:inline">View Vault</span>
                    <span className="sm:hidden">Vault</span>
                  </Button>
                </Link>
              </MagneticButton>
              
              <MagneticButton>
                <Link href="/dashboard" className="shrink-0 block">
                  <Button size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-none shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all group/btn">
                    <ArrowRight className="h-5 w-5 text-white group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
            
          </div>
          </motion.div>
        </MouseParallax>
        
        {/* Stats Section */}
        <ScrollReveal delay={0.2} className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 border-y border-white/5 py-8 w-full max-w-5xl">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-black text-white">$<NumberCounter value={95} />M+</span>
            <span className="text-sm text-gray-400 uppercase tracking-widest mt-2">Assets Tracked</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-black text-white"><NumberCounter value={50} />K+</span>
            <span className="text-sm text-gray-400 uppercase tracking-widest mt-2">Active Vaults</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-black text-white"><NumberCounter value={100} />%</span>
            <span className="text-sm text-gray-400 uppercase tracking-widest mt-2">Secure</span>
          </div>
        </ScrollReveal>
      </main>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 space-y-32">
        
        <ScrollReveal>
          <section id="features" className="scroll-mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
              <p className="text-gray-400 text-lg">Everything you need to manage your assets securely in one place.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Military-Grade Encryption", icon: Lock, desc: "Your data is secured with AES-256 encryption, ensuring maximum privacy." },
                { title: "AI Receipt Scanning", icon: Zap, desc: "Instantly extract data from receipts and invoices using advanced AI models." },
                { title: "Warranty Tracking", icon: Box, desc: "Never miss a warranty expiration date with our automated alerts and tracking." }
              ].map((feature, i) => (
                <TiltCard key={i} className="animated-border rounded-2xl p-[1px]">
                  <div className="h-full bg-[#110e1b] backdrop-blur-xl p-8 rounded-2xl">
                    <motion.div whileHover={{ scale: 1.2, rotate: 10, y: -5 }} className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 origin-bottom">
                      <feature.icon className="w-6 h-6 text-purple-400" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.desc}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="solutions" className="scroll-mt-32">
            <div className="flex flex-col md:flex-row items-center gap-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-3xl p-8 md:p-16 border border-white/10 shadow-[0_0_50px_rgba(147,51,234,0.1)]">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold text-white">Solutions tailored for you</h2>
                <p className="text-gray-400 text-lg">Whether you are an individual tracking personal electronics, or a business managing hundreds of corporate devices, AssetVault adapts to your needs.</p>
                <MagneticButton className="inline-block">
                  <Button className="bg-white text-black hover:bg-gray-200 btn-shine rounded-xl">Explore Solutions</Button>
                </MagneticButton>
              </div>
              <TiltCard className="flex-1 w-full h-[300px]">
                <div className="w-full h-full relative bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden [perspective:1000px]">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_3s_linear_infinite]" />
                  <motion.div
                    animate={{ rotateX: [0, 360], rotateY: [0, 360], y: [-15, 15, -15] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear", y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Package className="w-32 h-32 text-purple-500/40 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]" />
                  </motion.div>
                </div>
              </TiltCard>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="security" className="scroll-mt-32 text-center">
            <motion.div 
              className="inline-flex relative items-center justify-center w-24 h-24 bg-emerald-500/10 rounded-full mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
              animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 40px rgba(16,185,129,0.2)", "0 0 60px rgba(16,185,129,0.5)", "0 0 40px rgba(16,185,129,0.2)"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Shield className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </motion.div>
              <motion.div 
                className="absolute -bottom-2 -right-2 bg-[#0a0a0f] rounded-full p-1 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <Check className="w-5 h-5 text-emerald-400" />
              </motion.div>
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Uncompromising Security</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
              We employ industry-leading security practices, including end-to-end encryption, regular penetration testing, and zero-knowledge architecture.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          {/* How it Works Section */}
          <section id="how-it-works" className="scroll-mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How AssetVault Works</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Get up and running in minutes. Our streamlined process makes asset tracking incredibly simple.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-blue-500/0 -z-10 -translate-y-12" />
              
              {[
                { 
                  step: "01",
                  title: "Add Your Assets",
                  desc: "Input basic details like name, value, and serial numbers. Snap a photo or use our database.",
                  icon: Package
                },
                { 
                  step: "02",
                  title: "Upload Documents",
                  desc: "Store receipts, warranties, and insurance papers securely in the cloud. Never lose them again.",
                  icon: Box
                },
                { 
                  step: "03",
                  title: "Track & Get Alerts",
                  desc: "We monitor expiration dates and notify you before warranties or insurance policies lapse.",
                  icon: Zap
                }
              ].map((item, i) => (
                <TiltCard key={i} className="bg-[#110e1b]/60 backdrop-blur-md border border-white/5 p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/5 shadow-lg">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-6 text-4xl font-black text-white/5 select-none">{item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </TiltCard>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          {/* FAQ Section */}
          <section id="faq" className="scroll-mt-32 pb-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400 text-lg">Everything you need to know about the product and billing.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                { q: "Is my data really secure?", a: "Yes. All data is encrypted at rest and in transit. We use bank-level AES-256 encryption." },
                { q: "Can I export my asset list?", a: "Absolutely. You can export your entire vault as a CSV or PDF file at any time." },
                { q: "Is there a limit to how many assets I can add?", a: "Our free tier supports up to 50 assets. Pro accounts have unlimited capacity." },
                { q: "Do you offer mobile apps?", a: "Yes, our iOS and Android apps allow you to scan receipts and barcodes on the go." }
              ].map((faq, i) => (
                <div 
                  key={i} 
                  className="bg-[#110e1b]/80 border border-white/10 p-6 rounded-xl hover:bg-white/5 transition-colors cursor-pointer backdrop-blur-sm"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-white">{faq.q}</h4>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <ChevronDown className="text-gray-400 w-5 h-5" />
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: openFaq === i ? "auto" : 0,
                      opacity: openFaq === i ? 1 : 0,
                      filter: openFaq === i ? "blur(0px)" : "blur(4px)",
                      marginTop: openFaq === i ? "12px" : "0px"
                    }}
                    className="overflow-hidden"
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  >
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Footer Wave Glow */}
        <div className="w-full h-32 md:h-48 bg-gradient-to-t from-purple-900/30 via-purple-900/10 to-transparent blur-3xl rounded-t-full mt-20 pointer-events-none" />
      </div>
    </div>
  );
}
