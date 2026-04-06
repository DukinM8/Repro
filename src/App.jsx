import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Layers, Shield, Smartphone, Globe, BarChart3 } from 'lucide-react';
const MotionDiv = motion.div;

// Scroll-in animation config
const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- FIREBASE CONFIG ---
const useFirebase = () => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    // Read config from Vite env variables (you set these)
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    // If config is missing, don't try to init (site still works, just no leads stored)
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.log('Firebase not configured – leads will not be stored.');
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const firestore = getFirestore(app);

      const initAuth = async () => {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.log('Firebase auth failed', err);
        }
      };

      initAuth();
      onAuthStateChanged(auth, (u) => {
        if (u) setDb(firestore);
      });
    } catch (e) {
      console.log('Firebase init error', e);
    }
  }, []);

  return db;
};

// --- COMPONENTS ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full bg-[#f7f2ea]/90 backdrop-blur-md border-b border-[#e0d4c2] z-50">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg tracking-[0.35em] uppercase text-[#2c2214]">REPRO</span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium text-[#7b6b59]">
        <a href="#features" className="hover:text-[#2c2214] transition-colors">Product</a>
        <a href="#workflow" className="hover:text-[#2c2214] transition-colors">How It Works</a>
        <a href="#pricing" className="hover:text-[#2c2214] transition-colors">Pricing</a>
        <a href="#contact" className="hover:text-[#2c2214] transition-colors">Contact</a>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})}
          className="border border-[#a47c48] text-[#2c2214] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#a47c48] hover:text-white transition-colors"
        >
          Contact Sales
        </button>
      </div>
    </div>
  </nav>
);

const SectionHeader = ({ badge, title, subtitle }) => (
    <div className="text-center max-w-3xl mx-auto mb-16">
        {badge && (
            <span className="inline-block py-1 px-3 rounded-full bg-[#f1e3cf] border border-[#e0d4c2] text-[#6f4b20] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
                {badge}
            </span>
        )}
        <h2 className="text-3xl md:text-[3.2rem] font-semibold text-[#2c2214] mb-6 leading-[1.08] tracking-[0.03em]">{title}</h2>
        <p className="text-lg md:text-[1.15rem] text-[#7b6b59] leading-relaxed">{subtitle}</p>
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="p-8 rounded-2xl bg-[#fbf6ee] border border-[#e0d4c2] shadow-sm hover:shadow-lg hover:border-[#a47c48] transition-all duration-300 group">
        <div className="w-12 h-12 rounded-xl bg-[#2c2214] flex items-center justify-center text-[#f7f2ea] mb-6 group-hover:bg-[#f7f2ea] group-hover:text-[#2c2214] transition-colors">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-[#2c2214] mb-3">{title}</h3>
        <p className="text-[1rem] text-[#6f5f4d] leading-relaxed">{desc}</p>
    </div>
);

const StatCard = ({ value, label }) => (
    <div className="p-6 bg-[#fbf6ee] rounded-xl border border-[#e0d4c2] text-center">
        <div className="text-3xl md:text-4xl font-bold text-[#2c2214] mb-2">{value}</div>
        <div className="text-sm font-semibold text-[#7b6b59] uppercase tracking-[0.14em]">{label}</div>
    </div>
);

// --- MAIN APP ---
export default function App() {
  const db = useFirebase();
  const [formState, setFormState] = useState('idle');
  const [lastSubmission, setLastSubmission] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const role = e.target.role.value;

    setFormState('loading');

    // Save to Firestore (collection: "leads" – visible at top level in console)
    if (db) {
      try {
        await addDoc(collection(db, 'leads'), {
          email,
          role,
          ts: serverTimestamp()
        });
      } catch (err) {
        console.error('Firestore write failed:', err);
      }
    }

    setLastSubmission({ email, role });
    setFormState('success');
    e.target.reset();
    setTimeout(() => setFormState('idle'), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f7f2ea]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 bg-[#f7f2ea] border-b border-[#e0d4c2]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <MotionDiv className="space-y-8" {...fadeInUp}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1e3cf] border border-[#e0d4c2] text-[#6f4b20] text-xs font-semibold tracking-[0.2em] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a47c48]"></span>
                    Repro for Fashion Brands
                </div>
                <h1 className="text-5xl lg:text-7xl font-semibold text-[#2c2214] leading-[1.02] tracking-[0.02em]">
                    Let shoppers see <br/>
                    <span className="text-black">products on themselves.</span>
                </h1>
                <p className="text-lg md:text-[1.15rem] text-[#7b6b59] leading-relaxed max-w-xl">
                    Repro is virtual try-on infrastructure for clothing brands. A shopper uploads a photo, selects clothing or shoes from your catalog, and sees the product on themselves inside your own site or app.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      onClick={() => document.getElementById('contact').scrollIntoView({behavior:'smooth'})}
                      className="bg-[#2c2214] text-[#f7f2ea] px-8 py-4 rounded-full font-semibold tracking-[0.16em] hover:bg-black transition-colors shadow-lg shadow-black/20 flex items-center justify-center gap-2"
                    >
                        Talk To Sales <ArrowRight size={18} />
                    </button>
                    <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="bg-transparent text-[#2c2214] border border-[#c2a476] px-8 py-4 rounded-full font-medium tracking-[0.14em] hover:bg-[#f1e3cf] transition-colors">
                        See how it works
                    </button>
                </div>
            </MotionDiv>
            
            {/* Storefront Visual */}
            <MotionDiv className="relative space-y-4" {...fadeInUp} transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
                <div className="absolute -inset-4 rounded-[2rem] border border-[#e0d4c2] bg-gradient-to-tr from-[#f7f2ea] to-[#f1e3cf]"></div>
                <div className="relative bg-[#fbf6ee] border border-[#e0d4c2] rounded-2xl shadow-2xl overflow-hidden aspect-[4/3]">
                    <div className="h-10 border-b border-[#e0d4c2] bg-[#f7f2ea] flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="ml-auto text-xs font-mono text-[#a1907a] uppercase tracking-[0.18em]">store-preview.product-page</div>
                    </div>
                    <div className="p-4 h-full bg-[radial-gradient(circle_at_top,#fff7ec,transparent_55%)]">
                         <div className="rounded-[1.25rem] border border-[#e0d4c2] bg-white p-3 shadow-sm h-full overflow-hidden">
                            <div className="flex items-center justify-between border-b border-[#efe5d9] pb-2.5 mb-3">
                                <div className="space-y-1.5">
                                    <div className="h-2 w-20 rounded-full bg-[#ded2c2]"></div>
                                    <div className="h-2 w-12 rounded-full bg-[#e9dfd2]"></div>
                                </div>
                                <div className="hidden sm:flex gap-2">
                                    <div className="h-6 w-10 rounded-full bg-[#f4ecdf]"></div>
                                    <div className="h-6 w-10 rounded-full bg-[#f4ecdf]"></div>
                                    <div className="h-6 w-10 rounded-full bg-[#f4ecdf]"></div>
                                </div>
                            </div>

                            <div className="grid h-[calc(100%-3rem)] grid-cols-[1.1fr_0.9fr] gap-3">
                                <div className="rounded-[1rem] overflow-hidden bg-[#efe5d8] relative min-h-0">
                                    <img
                                      src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop"
                                      alt="Plain white t-shirt product"
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#6f4b20]">
                                        Sample PDP
                                    </div>
                                </div>

                                <div className="min-h-0 overflow-hidden flex flex-col">
                                    <div className="space-y-2 mb-3">
                                        <div className="h-2.5 w-16 rounded-full bg-[#d9ccb9]"></div>
                                        <div className="h-4 w-32 rounded-full bg-[#cfc1ad]"></div>
                                        <div className="h-3 w-16 rounded-full bg-[#e8ddce]"></div>
                                    </div>

                                    <div className="rounded-[1rem] border border-[#e6dbcc] bg-[#fbf7f0] p-3 mb-3">
                                        <p className="text-[9px] uppercase tracking-[0.14em] text-[#a1907a]">Size</p>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            <span className="rounded-full border border-[#d8cab7] bg-white px-2.5 py-1 text-[9px] text-[#4f4336]">XS</span>
                                            <span className="rounded-full border border-[#d8cab7] bg-white px-2.5 py-1 text-[9px] text-[#4f4336]">S</span>
                                            <span className="rounded-full border border-[#2c2214] bg-[#2c2214] px-2.5 py-1 text-[9px] text-[#f7f2ea]">M</span>
                                            <span className="rounded-full border border-[#d8cab7] bg-white px-2.5 py-1 text-[9px] text-[#4f4336]">L</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        <button className="w-full rounded-full border border-[#2c2214] bg-[#2c2214] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#f7f2ea]">
                                            Add To Cart
                                        </button>
                                        <button className="w-full rounded-full border border-[#c2a476] bg-[#f1e3cf] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#2c2214]">
                                            Try This On
                                        </button>
                                    </div>

                                    <div className="mt-auto rounded-[1rem] border border-[#e6dbcc] bg-[#fbf7f0] p-3 space-y-3">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.14em] text-[#a1907a]">Color</p>
                                            <div className="mt-2 flex gap-2">
                                                <span className="h-4 w-4 rounded-full border border-[#d8cab7] bg-[#c7b39a]"></span>
                                                <span className="h-4 w-4 rounded-full border border-[#d8cab7] bg-[#2f3640]"></span>
                                                <span className="h-4 w-4 rounded-full border border-[#d8cab7] bg-[#efe8dc]"></span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 w-full rounded-full bg-[#e6dbcc]"></div>
                                            <div className="h-2 w-[86%] rounded-full bg-[#e6dbcc]"></div>
                                            <div className="h-2 w-[70%] rounded-full bg-[#e6dbcc]"></div>
                                        </div>
                                        <div className="rounded-[0.85rem] border border-[#eadfce] bg-white px-3 py-2">
                                            <p className="text-[9px] uppercase tracking-[0.12em] text-[#6f4b20]">Free shipping over $100</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                         </div>
                    </div>
                </div>
                <div className="relative ml-auto max-w-[220px] rounded-[1rem] border border-[#e0d4c2] bg-white/96 p-3 shadow-xl">
                    <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                            <Check size={12} strokeWidth={3} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#2c2214]">Fits Existing Flow</p>
                            <p className="mt-1 text-[10px] leading-relaxed text-[#7b6b59]">
                                One extra action on a normal product page.
                            </p>
                        </div>
                    </div>
                </div>
            </MotionDiv>
        </div>
      </section>

      {/* METRICS */}
      <motion.section className="py-12 bg-[#f7f2ea] border-b border-[#e0d4c2]" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <MotionDiv variants={itemVariants}><StatCard value="1 Photo" label="Uploaded by Shopper" /></MotionDiv>
            <MotionDiv variants={itemVariants}><StatCard value="Any SKU" label="Selected from Catalog" /></MotionDiv>
            <MotionDiv variants={itemVariants}><StatCard value="Store Native" label="Runs in Your UX" /></MotionDiv>
            <MotionDiv variants={itemVariants}><StatCard value="Light Touch" label="Image Enhancement" /></MotionDiv>
        </div>
      </motion.section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-6 bg-[#f3ebde]">
        <div className="max-w-7xl mx-auto">
            <MotionDiv {...fadeInUp}>
            <SectionHeader 
                badge="Capabilities" 
                title="The Try-On Engine Behind Your Existing Storefront." 
                subtitle="Repro is not a replacement for your frontend. It is the computer vision layer that lets shoppers upload their photo, choose a product from your catalog, and preview that item on themselves inside your existing experience." 
            />
            </MotionDiv>
            
            <MotionDiv className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants}>
                <MotionDiv variants={itemVariants}>                <FeatureCard 
                    icon={Smartphone}
                    title="Simple Shopper Flow"
                    desc="Customers upload one photo of themselves and pick the clothing or shoes they want to try. No scanning workflow, no separate app, no extra friction."
                /></MotionDiv>
                <MotionDiv variants={itemVariants}><FeatureCard 
                    icon={Layers}
                    title="Catalog Product Mapping"
                    desc="Repro takes the selected catalog item and maps it onto the shopper realistically, instead of flattening product imagery into a fake overlay."
                /></MotionDiv>
                <MotionDiv variants={itemVariants}><FeatureCard 
                    icon={Zap}
                    title="Lighting Correction"
                    desc="Repro lightly improves exposure and visual consistency so the output looks cleaner, while avoiding the overprocessed look that breaks trust."
                /></MotionDiv>
                <MotionDiv variants={itemVariants}><FeatureCard 
                    icon={Shield}
                    title="Frontend Agnostic"
                    desc="You keep control of the customer-facing interface. Repro is the engine your team plugs into Shopify, custom PDPs, apps, or internal tools."
                /></MotionDiv>
                <MotionDiv variants={itemVariants}><FeatureCard 
                    icon={Globe}
                    title="Brand Ready Outputs"
                    desc="The result fits into your own product pages and purchase flow without forcing a separate Repro-branded interface onto your customers."
                /></MotionDiv>
                <MotionDiv variants={itemVariants}><FeatureCard 
                    icon={BarChart3}
                    title="Commerce Focused"
                    desc="The point is simple: let shoppers preview products on themselves so they can buy with more confidence."
                /></MotionDiv>
            </MotionDiv>
        </div>
      </section>

      {/* WORKFLOW PREVIEW */}
      <section id="workflow" className="py-24 px-6 bg-[#f7f2ea] border-y border-[#e0d4c2]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <MotionDiv {...fadeInUp}>
                <span className="text-[#2c2214] font-bold text-sm uppercase tracking-[0.16em]">How Repro Works</span>
                <h2 className="text-4xl md:text-5xl font-semibold text-[#2c2214] mt-2 mb-6 leading-[1.08]">A shopper uploads a photo, picks a product, and previews it on themselves.</h2>
                <p className="text-lg md:text-[1.1rem] text-[#6f5f4d] mb-8 leading-relaxed">
                    Repro uses the shopper photo together with the selected catalog item, then handles alignment, perspective, lighting balance, and subtle enhancement behind the scenes. Your team still owns the storefront and customer experience.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Check className="text-green-500" size={20} />
                        <span className="text-[#4f4336] text-[1rem] font-medium">Uses the shopper photo together with the chosen catalog product</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Check className="text-green-500" size={20} />
                        <span className="text-[#4f4336] text-[1rem] font-medium">Respects body position, camera angle, and scene lighting</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Check className="text-green-500" size={20} />
                        <span className="text-[#4f4336] text-[1rem] font-medium">Returns a result inside the brand's own site or app flow</span>
                    </div>
                </div>
            </MotionDiv>
            
            <MotionDiv className="rounded-[2rem] border border-[#d8cab7] bg-[#fbf6ee] p-6 shadow-2xl" {...fadeInUp} transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
                <div className="grid gap-4">
                    <div className="rounded-[1.5rem] border border-[#e0d4c2] bg-[#f7f2ea] p-5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6f4b20]">Inputs</span>
                            <span className="text-xs text-[#a1907a]">Step 01</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-[1.25rem] overflow-hidden bg-[#e8dccb] aspect-[4/5]">
                                <img
                                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop"
                                  alt="Customer portrait input"
                                  className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="rounded-[1.25rem] overflow-hidden bg-[#e8dccb] aspect-[4/5]">
                                <img
                                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop"
                                  alt="White t-shirt catalog product"
                                  className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#2c2214] bg-[#2c2214] p-5 text-[#f7f2ea]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e0d4c2]">Repro Engine</span>
                            <span className="text-xs text-[#b3a38f]">Step 02</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-full bg-white/10 px-4 py-3">
                                <span className="text-sm">Shopper pose alignment</span>
                                <span className="text-xs text-[#c2a476]">Complete</span>
                            </div>
                            <div className="flex items-center justify-between rounded-full bg-white/10 px-4 py-3">
                                <span className="text-sm">Catalog item and angle match</span>
                                <span className="text-xs text-[#c2a476]">Complete</span>
                            </div>
                            <div className="flex items-center justify-between rounded-full bg-white/10 px-4 py-3">
                                <span className="text-sm">Lighting cleanup and fit render</span>
                                <span className="text-xs text-[#c2a476]">Ready for delivery</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#e0d4c2] bg-white p-5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6f4b20]">Output Preview</span>
                            <span className="text-xs text-[#a1907a]">Step 03</span>
                        </div>
                        <div className="rounded-[1.25rem] overflow-hidden aspect-[16/10] bg-[#e8dccb] relative">
                            <img
                              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop"
                              alt="Generated try-on preview"
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute bottom-4 left-4 rounded-full bg-[#f7f2ea]/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#2c2214] shadow-lg">
                                Ready for PDP placement
                            </div>
                        </div>
                    </div>
                </div>
            </MotionDiv>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-[#f3ebde] border-b border-[#e0d4c2]">
        <div className="max-w-7xl mx-auto">
          <MotionDiv className="max-w-3xl mx-auto text-center mb-12" {...fadeInUp}>
            <span className="inline-block py-1 px-3 rounded-full bg-[#f1e3cf] border border-[#e0d4c2] text-[#6f4b20] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#2c2214] tracking-[0.06em] mb-4">
              One simple plan for brand teams.
            </h2>
            <p className="text-[#7b6b59] text-lg">
              Flat monthly fee. No per-try-on surprises. Everything you need to launch shopper-facing virtual try-on inside your store.
            </p>
          </MotionDiv>

          <MotionDiv className="max-w-md mx-auto" {...fadeInUp} transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <div className="rounded-3xl border border-[#c2a476] bg-[#fbf6ee] p-10 shadow-lg">
              <div className="text-center mb-8">
                <p className="text-3xl font-semibold text-[#2c2214] mb-2">Custom pricing</p>
                <p className="text-sm text-[#7b6b59] tracking-[0.08em] uppercase">We will contact you to discuss pricing</p>
              </div>
              <ul className="space-y-3 text-sm text-[#5a4c3b] mb-8">
                <li className="flex items-center gap-3">
                  <Check className="text-[#6f4b20] shrink-0" size={18} />
                  AI try-on inside your product pages or shopping flow
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-[#6f4b20] shrink-0" size={18} />
                  Customers upload their photo and try catalog items on themselves
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-[#6f4b20] shrink-0" size={18} />
                  Integration support for your existing stack
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-[#6f4b20] shrink-0" size={18} />
                  Cancel anytime — no long-term lock-in
                </li>
              </ul>
              <button
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-[#2c2214] text-[#f7f2ea] font-semibold py-4 rounded-full hover:bg-black transition-colors tracking-[0.16em] uppercase text-xs"
              >
                Request access
              </button>
            </div>
            <p className="mt-6 text-center text-xs text-[#a1907a] tracking-[0.16em] uppercase">
              Built for testing, rollout, and iteration. No hidden fees.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="contact" className="py-24 px-6 bg-[#f3ebde]">
         <MotionDiv className="max-w-4xl mx-auto bg-[#2c2214] rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl" {...fadeInUp}>
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             
             <div className="relative z-10">
                 <h2 className="text-3xl md:text-5xl font-semibold text-[#f7f2ea] mb-6 tracking-[0.18em] uppercase">Bring virtual try-on into your storefront.</h2>
                 <p className="text-[#e0d4c2] text-lg mb-10 max-w-2xl mx-auto">
                     Repro is for brands that want shoppers to upload a photo, select products from the catalog, and preview them before buying. We are accepting 5 pilot partners for Q1 2026.
                 </p>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4">
                     <input name="email" type="email" placeholder="Work email" required className="w-full px-5 py-4 rounded-full text-[#2c2214] placeholder-[#b3a38f] focus:outline-none focus:ring-2 focus:ring-[#c2a476] shadow-sm bg-[#f7f2ea]" />
                     <input
                       name="role"
                       type="text"
                       placeholder="Your role"
                       required
                       className="w-full px-5 py-4 rounded-full text-[#2c2214] placeholder-[#b3a38f] focus:outline-none focus:ring-2 focus:ring-[#c2a476] shadow-sm bg-[#f7f2ea]"
                     />
                     
                     <button type="submit" disabled={formState !== 'idle'} className="w-full bg-[#c2a476] text-[#2c2214] font-semibold py-4 rounded-full hover:bg-[#b18d5f] transition-colors shadow-lg tracking-[0.18em] uppercase text-xs">
                         {formState === 'loading' ? 'Processing...' : formState === 'success' ? 'Request Received' : 'Request Access'}
                     </button>
                 </form>
                 {lastSubmission && (
                   <p className="text-[#e0d4c2] text-xs mt-4">
                     We’ll reach out to <span className="font-semibold">{lastSubmission.email}</span> ({lastSubmission.role}).
                   </p>
                 )}
                 <p className="text-[#b3a38f] text-xs mt-6 tracking-[0.18em] uppercase">No credit card required · SOC2 Compliant</p>
             </div>
         </MotionDiv>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f7f2ea] border-t border-[#e0d4c2] pt-16 pb-8 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
             <div className="col-span-2 md:col-span-1">
                 <span className="font-semibold text-xl tracking-[0.3em] uppercase text-[#2c2214]">REPRO</span>
                 <p className="text-sm text-[#7b6b59] mt-4">Virtual try-on infrastructure for clothing and footwear brands.</p>
             </div>
             <div>
                 <h4 className="font-bold text-[#2c2214] mb-4">Product</h4>
                 <ul className="space-y-2 text-sm text-[#7b6b59]">
                     <li><a href="#features" className="hover:text-[#2c2214]">Capabilities</a></li>
                     <li><a href="#workflow" className="hover:text-[#2c2214]">Workflow</a></li>
                     <li><a href="#pricing" className="hover:text-[#2c2214]">Pricing</a></li>
                 </ul>
             </div>
             <div>
                 <h4 className="font-bold text-[#2c2214] mb-4">Why Repro</h4>
                 <ul className="space-y-2 text-sm text-[#7b6b59]">
                     <li><span>Shopper photo plus selected catalog item</span></li>
                     <li><span>Pose, angle, and lighting alignment</span></li>
                     <li><span>Brand-controlled storefront delivery</span></li>
                 </ul>
             </div>
             <div>
                 <h4 className="font-bold text-[#2c2214] mb-4">Company</h4>
                 <ul className="space-y-2 text-sm text-[#7b6b59]">
                     <li><a href="#contact" className="hover:text-[#2c2214]">Contact Sales</a></li>
                     <li><a href="#pricing" className="hover:text-[#2c2214]">Pilot Program</a></li>
                     <li><a href="#workflow" className="hover:text-[#2c2214]">See How It Works</a></li>
                 </ul>
             </div>
         </div>
         <div className="max-w-7xl mx-auto border-t border-[#e0d4c2] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#a1907a]">
             <p>© 2026 Repro Technologies Inc.</p>
             <div className="flex gap-6 mt-4 md:mt-0">
                 <a href="#contact" className="hover:text-[#6f4b20]">Privacy</a>
                 <a href="#contact" className="hover:text-[#6f4b20]">Terms</a>
                 <a href="#contact" className="hover:text-[#6f4b20]">Security</a>
             </div>
         </div>
      </footer>
    </div>
  );
}
