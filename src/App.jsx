import React, { useState, useEffect } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import {
  Check, ArrowRight, Zap, Layers, Shield, Smartphone, Globe, BarChart3,
  Upload, Server, Cloud, Sparkles, Database, Monitor, Trash2,
  ShieldCheck, Clock, Lock, UserCheck, Scale, Store,
  TrendingUp, Timer, Package, ShoppingCart, RotateCcw, Users,
  Code2, Headphones, RefreshCw, Wallet, Ban, CreditCard, ShoppingBag,
} from 'lucide-react';
import person1Image from './assets/person1.jpeg';
import person2Image from './assets/person2.jpeg';
import person3Image from './assets/person3.jpeg';
import clothes1Image from './assets/clothes1.jpeg';
import clothes2Image from './assets/clothes2.jpeg';
import clothes3Image from './assets/clothes3.png';
import result1Image from './assets/result1.jpeg';
import result2Image from './assets/result2.jpeg';
import result3Image from './assets/result3.jpeg';
import tshirtImage from './assets/tshirt.jpeg';

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
        <a href="#privacy" className="hover:text-[#2c2214] transition-colors">Privacy</a>
        <a href="#analytics" className="hover:text-[#2c2214] transition-colors">Analytics</a>
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
    <div className="p-8 rounded-2xl bg-[#fbf6ee] border border-[#e0d4c2] shadow-sm hover:shadow-lg hover:border-[#a47c48] transition-[box-shadow,border-color] duration-300 group">
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

const ExampleShowcase = ({ title, personImage, clothesImage, resultImage, clothesClassName = 'h-full w-full object-contain object-center' }) => (
    <div className="rounded-[1.75rem] border border-[#e0d4c2] bg-[#fbf6ee] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2c2214]">{title}</p>
            <span className="rounded-full border border-[#d8cab7] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f4b20]">
                Before / Product / Result
            </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.1rem] border border-[#e0d4c2] bg-white p-2">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f4b20]">Person</span>
                    <span className="text-[10px] text-[#a1907a]">Input</span>
                </div>
                <div className="aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-[#efe3d1]">
                    <img src={personImage} alt={`${title} person input`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                </div>
            </div>

            <div className="rounded-[1.1rem] border border-[#e0d4c2] bg-white p-2">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f4b20]">Clothes</span>
                    <span className="text-[10px] text-[#a1907a]">Catalog</span>
                </div>
                <div className="aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-white p-3">
                    <img src={clothesImage} alt={`${title} clothing input`} loading="lazy" decoding="async" className={clothesClassName} />
                </div>
            </div>
        </div>

        <div className="mt-3 rounded-[1.1rem] border border-[#d8cab7] bg-white p-2">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2c2214]">Result</span>
                <span className="text-[10px] text-[#a1907a]">Output</span>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-[#efe3d1]">
                <img src={resultImage} alt={`${title} try-on result`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
            </div>
        </div>
    </div>
);

// --- PRIVACY / ANALYTICS / PRICING BUILDING BLOCKS ---

// numbered step in the data-flow chain
const FlowStep = ({ n, icon: Icon, title, desc }) => (
    <div className="relative flex flex-col rounded-[1.25rem] border border-[#e0d4c2] bg-[#fbf6ee] p-5 h-full">
        <div className="flex items-center gap-3 mb-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#a47c48] text-sm font-semibold text-white">
                {n}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1e3cf] text-[#6f4b20]">
                <Icon size={17} />
            </span>
        </div>
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-[#2c2214] leading-snug mb-2">
            {title}
        </p>
        <p className="text-[0.85rem] leading-relaxed text-[#7b6b59]">{desc}</p>
    </div>
);

// icon + heading + body, used in the data-protection strip
const PrivacyCard = ({ icon: Icon, title, desc }) => (
    <div className="rounded-[1.25rem] border border-[#e0d4c2] bg-white p-5 h-full">
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f1e3cf] text-[#6f4b20]">
            <Icon size={20} />
        </span>
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#2c2214] mb-2">{title}</p>
        <p className="text-[0.85rem] leading-relaxed text-[#7b6b59]">{desc}</p>
    </div>
);

// numbered metric row inside the two analytics columns
const MetricRow = ({ n, icon: Icon, title, desc }) => (
    <div className="flex items-start gap-4 border-b border-[#ece0cf] py-4 last:border-0 last:pb-0">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c9a678] text-sm font-semibold text-white">
            {n}
        </span>
        <div className="min-w-0 flex-1">
            <p className="font-semibold text-[#2c2214] leading-snug">{title}</p>
            <p className="mt-1 text-[0.85rem] leading-relaxed text-[#7b6b59]">{desc}</p>
        </div>
        <span className="hidden shrink-0 text-[#c2a476] sm:block"><Icon size={26} /></span>
    </div>
);

// heading bar that caps each analytics column
const ColumnHead = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 rounded-t-[1.25rem] bg-[#6b4c2b] px-5 py-4">
        <Icon size={18} className="text-[#f1e3cf]" />
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f7f2ea]">{title}</p>
    </div>
);

// --- PRICING MODEL ---
// Single source of truth for the pricing section. Change the rate here and the
// headline card, the table, the worked example and the guarantee copy all follow.
const PRICE_SUBSCRIPTION = 250;
const PRICE_PER_TRYON = 0.06;
const TRYON_VOLUMES = [500, 1000, 3000, 5000, 10000, 15000, 30000, 50000, 75000, 100000];
const EXAMPLE_VOLUME = 10000;

const groupThousands = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// dollars with thousands separators; cents shown only when they are not zero
const usd = (n) => {
    const [whole, cents] = n.toFixed(2).split('.');
    return cents === '00' ? `$${groupThousands(whole)}` : `$${groupThousands(whole)}.${cents}`;
};

// the per-try-on rate needs sub-cent precision, so it is formatted separately
const rateLabel = `$${PRICE_PER_TRYON.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}`;

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
    /* reducedMotion="user" makes framer-motion honour the OS setting. A CSS media
       query cannot do this on its own — framer-motion animates through inline
       styles, so index.css only covers the plain CSS transitions. */
    <MotionConfig reducedMotion="user">
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
                                      src={tshirtImage}
                                      alt="Catalog t-shirt shown on a sample product page"
                                      fetchPriority="high"
                                      decoding="async"
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#6f4b20]">
                                        Catalog product
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
                                                <span className="h-4 w-4 rounded-full border border-[#d8cab7] bg-white"></span>
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
                                  src={person1Image}
                                  alt="Original shopper photo input"
                                  loading="lazy"
                                  decoding="async"
                                  className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="rounded-[1.25rem] overflow-hidden bg-[#e8dccb] aspect-[4/5]">
                                <img
                                  src={clothes1Image}
                                  alt="Catalog clothing input"
                                  loading="lazy"
                                  decoding="async"
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
                        <div className="rounded-[1.25rem] overflow-hidden aspect-[4/5] bg-[#e8dccb] relative flex items-center justify-center">
                            <img
                              src={result1Image}
                              alt="Generated try-on result"
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover object-top"
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

      {/* EXAMPLE GALLERY */}
      <section className="py-24 px-6 bg-[#f3ebde] border-b border-[#e0d4c2]">
        <div className="max-w-7xl mx-auto">
            <MotionDiv {...fadeInUp}>
                <SectionHeader
                    badge="More Examples"
                    title="More real try-on examples."
                    subtitle="Two larger before-and-after examples give visitors a clearer look at shopper inputs, catalog products, and the generated results."
                />
            </MotionDiv>

            <MotionDiv
              className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
            >
                <MotionDiv variants={itemVariants}>
                    <ExampleShowcase
                      title="Example 02"
                      personImage={person2Image}
                      clothesImage={clothes2Image}
                      resultImage={result2Image}
                      clothesClassName="h-full w-full scale-[1.18] -translate-y-2 object-contain object-center"
                    />
                </MotionDiv>
                <MotionDiv variants={itemVariants}>
                    <ExampleShowcase
                      title="Example 03"
                      personImage={person3Image}
                      clothesImage={clothes3Image}
                      resultImage={result3Image}
                    />
                </MotionDiv>
            </MotionDiv>
        </div>
      </section>

      {/* PRIVACY — data flow and protection */}
      <section id="privacy" className="py-24 px-6 bg-[#f7f2ea] border-b border-[#e0d4c2]">
        <div className="max-w-7xl mx-auto">
          <MotionDiv {...fadeInUp}>
            <SectionHeader
              badge="Privacy"
              title="Data flow and privacy protection."
              subtitle="AI virtual clothing try-on for fashion e-commerce. Below is the full path a shopper's photo takes — from upload through generation to automatic deletion."
            />
          </MotionDiv>

          {/* seven-step chain */}
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
          >
            {[
              { n: 1, icon: Upload,   title: 'Shopper uploads a photo',
                desc: 'The shopper uploads their own photo through the widget on the brand’s site.' },
              { n: 2, icon: Server,   title: 'Photo reaches our server',
                desc: 'The photo is transmitted securely over HTTPS and received on the Repro server.' },
              { n: 3, icon: Cloud,    title: 'Server sends photo and item to the AI API',
                desc: 'We pass the shopper photo and the product image to an external try-on generation API (third-party provider).' },
              { n: 4, icon: Sparkles, title: 'Provider returns the image',
                desc: 'The AI provider returns the finished try-on image.' },
              { n: 5, icon: Database, title: 'Temporary secured storage',
                desc: 'The result is held for a short window (24–48 hours) with encryption at the storage layer.' },
              { n: 6, icon: Monitor,  title: 'Result is shown to the shopper',
                desc: 'The finished try-on is displayed to the shopper on the brand’s site.' },
              { n: 7, icon: Trash2,   title: 'Automatic data deletion',
                desc: 'The shopper photo and the results are deleted automatically once the retention window expires.' },
            ].map((s) => (
              <MotionDiv key={s.n} variants={itemVariants}>
                <FlowStep {...s} />
              </MotionDiv>
            ))}
          </motion.div>

          {/* what the partner brand actually sees */}
          <MotionDiv
            className="mt-8 flex flex-col items-stretch gap-4 rounded-[1.5rem] border border-[#e0d4c2] bg-[#f1e3cf] p-6 lg:flex-row lg:items-center"
            {...fadeInUp}
          >
            <div className="flex shrink-0 items-center gap-3 rounded-[1.1rem] border border-[#d8cab7] bg-white px-5 py-4 lg:w-64">
              <Store size={22} className="text-[#6f4b20]" />
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2c2214]">Partner brand</p>
            </div>
            <div className="hidden shrink-0 items-center text-[#c2a476] lg:flex"><ArrowRight size={22} /></div>
            <div className="flex items-start gap-4 rounded-[1.1rem] bg-white/70 px-5 py-4">
              <BarChart3 size={24} className="mt-0.5 shrink-0 text-[#6f4b20]" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2c2214]">
                  Aggregated usage statistics only
                </p>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-[#6f5f4d]">
                  The brand has no access to shopper photographs or personal data.
                  Only de-identified, aggregated analytics is provided.
                </p>
              </div>
            </div>
          </MotionDiv>

          {/* the six pillars */}
          <MotionDiv className="mt-14" {...fadeInUp}>
            <p className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.22em] text-[#6f4b20]">
              How we protect data
            </p>
          </MotionDiv>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
          >
            {[
              { icon: ShieldCheck, title: 'What we store',
                desc: 'Only the shopper photo and the generated try-on image, strictly for the period required to run the service.' },
              { icon: Users, title: 'Who has access',
                desc: 'Neither the partner brand nor third parties can reach shopper photos. The brand receives aggregated statistics only, with no personal data.' },
              { icon: Clock, title: 'How long',
                desc: 'Images are retained for a limited time — typically 24–48 hours — after which they are deleted automatically.' },
              { icon: Lock, title: 'Encryption',
                desc: 'Data is transmitted over HTTPS. Stored data is protected by encryption at rest.' },
              { icon: UserCheck, title: 'Shopper consent',
                desc: 'Before uploading a photo the shopper receives clear information about how the data is processed and gives explicit consent.' },
              { icon: Scale, title: 'GDPR alignment',
                desc: 'The service follows GDPR principles: data minimisation, limited retention, transparency, the right to erasure, and protection of personal data.' },
            ].map((c) => (
              <MotionDiv key={c.title} variants={itemVariants}>
                <PrivacyCard {...c} />
              </MotionDiv>
            ))}
          </motion.div>

          <MotionDiv
            className="mt-8 flex items-start gap-4 rounded-[1.25rem] border border-[#e0d4c2] bg-[#fbf6ee] px-6 py-5"
            {...fadeInUp}
          >
            <Lock size={22} className="mt-0.5 shrink-0 text-[#6f4b20]" />
            <p className="text-[0.95rem] leading-relaxed text-[#5a4c3b]">
              We take privacy seriously. Our goal is to deliver the best virtual try-on
              experience while protecting shopper data at every step.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ANALYTICS — what we need from the brand */}
      <section id="analytics" className="py-24 px-6 bg-[#f3ebde] border-b border-[#e0d4c2]">
        <div className="max-w-7xl mx-auto">
          <MotionDiv {...fadeInUp}>
            <SectionHeader
              badge="Analytics"
              title="Measuring the real impact of try-on for your brand."
              subtitle="We help you see how virtual try-on moves the business metrics that matter for your specific store: conversion, engagement, and returns. The analytics runs on anonymous data and access limited to try-on events alone."
            />
          </MotionDiv>

          {/* three outcomes we track */}
          <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {[
              { icon: TrendingUp, title: 'Higher conversion and sales', desc: 'More add-to-cart actions and more purchases.' },
              { icon: Timer,      title: 'Higher engagement',           desc: 'Shoppers stay longer on the site and on the product page.' },
              { icon: Package,    title: 'Fewer returns',               desc: 'Items fit better, so fewer of them come back.' },
            ].map((c) => (
              <MotionDiv key={c.title} variants={itemVariants}>
                <div className="flex h-full items-start gap-4 rounded-[1.25rem] border border-[#e0d4c2] bg-[#fbf6ee] p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1e3cf] text-[#6f4b20]">
                    <c.icon size={20} />
                  </span>
                  <div>
                    <p className="font-semibold text-[#2c2214]">{c.title}</p>
                    <p className="mt-1 text-[0.9rem] leading-relaxed text-[#7b6b59]">{c.desc}</p>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </motion.div>

          {/* who supplies what */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MotionDiv className="overflow-hidden rounded-[1.5rem] border border-[#e0d4c2] bg-[#fbf6ee]" {...fadeInUp}>
              <ColumnHead icon={BarChart3} title="We collect ourselves" />
              <div className="px-5 pb-5">
                <MetricRow n={1} icon={Users} title="Try-ons per month"
                  desc="Total number of completed try-on sessions." />
                <MetricRow n={2} icon={UserCheck} title="Average try-ons per brand customer per month"
                  desc="Shows how deeply the service is being used." />
                <MetricRow n={5} icon={Clock} title="Average Virtual Try-On session length"
                  desc="Time the shopper spends interacting with the feature inside the widget." />
              </div>
            </MotionDiv>

            <MotionDiv
              className="overflow-hidden rounded-[1.5rem] border border-[#c2a476] bg-[#fbf6ee]"
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <ColumnHead icon={Database} title="Needed from the brand" />
              <div className="px-5 pb-5">
                <MetricRow n={3} icon={ShoppingCart} title="Add to Cart"
                  desc="The add-to-cart event that follows a try-on." />
                <MetricRow n={4} icon={ShoppingBag} title="Purchase / Order Created"
                  desc="The purchase of an item tied to a try-on, whether bought directly or from the cart." />
                <MetricRow n={6} icon={Timer} title="Time on Site / Product Page"
                  desc="Aggregated time on site and on the product page. Ideally an A/B split: saw the try-on vs did not." />
                <MetricRow n={7} icon={RotateCcw} title="Return Created"
                  desc="Returns of items bought after a try-on, limited to orders we are linked to." />
              </div>
            </MotionDiv>
          </div>

          {/* how the events are stitched together */}
          <MotionDiv className="mt-8 rounded-[1.5rem] border border-[#e0d4c2] bg-[#fbf6ee] p-6" {...fadeInUp}>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#6f4b20]">
              How the events link together
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { icon: Smartphone,   text: 'The shopper uses Virtual Try-On' },
                { icon: Code2,        text: 'An anonymous Session ID is created for that try-on' },
                { icon: ShoppingCart, text: 'On add to cart we pass the Session ID as a cart attribute / order tag' },
                { icon: ShoppingBag,  text: 'On purchase the order is tagged with the Session ID (order tag)' },
                { icon: Package,      text: 'If the item comes back, the return is linked to the same Session ID' },
              ].map((s, i) => (
                <div key={i} className="relative rounded-[1.1rem] border border-[#ece0cf] bg-white p-4">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f1e3cf] text-[#6f4b20]">
                    <s.icon size={18} />
                  </span>
                  <p className="text-[0.85rem] leading-relaxed text-[#6f5f4d]">{s.text}</p>
                  {i < 4 && (
                    <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[#c2a476] lg:block">
                      <ArrowRight size={16} />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-[1.1rem] bg-[#f1e3cf] px-5 py-4 text-center text-[0.95rem] font-medium text-[#5a4c3b]">
              We see the full path only for orders carrying a Virtual Try-On Session ID.
            </p>
          </MotionDiv>

          {/* explicit non-collection list */}
          <MotionDiv className="mt-8 rounded-[1.5rem] border border-[#e0d4c2] bg-[#fbf6ee] p-6" {...fadeInUp}>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#6f4b20]">
              What we never receive
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { icon: UserCheck,  text: 'Name, email, phone, or delivery address' },
                { icon: CreditCard, text: 'Payment details such as card data' },
                { icon: Users,      text: 'Access to the brand’s full sales and order history' },
                { icon: Database,   text: 'Customer profiles and purchase history' },
                { icon: Ban,        text: 'Any other personal data about shoppers' },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 rounded-[1.1rem] border border-[#ece0cf] bg-white p-4">
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4ece0] text-[#a1907a]">
                    <s.icon size={17} />
                    <span className="absolute h-[1.5px] w-6 rotate-45 rounded-full bg-[#b98b5a]"></span>
                  </span>
                  <p className="text-[0.85rem] leading-relaxed text-[#6f5f4d]">{s.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-4 rounded-[1.1rem] bg-[#f1e3cf] px-5 py-4">
              <ShieldCheck size={22} className="mt-0.5 shrink-0 text-[#6f4b20]" />
              <p className="text-[0.95rem] leading-relaxed text-[#5a4c3b]">
                We receive event data only for orders linked to a try-on: the add-to-cart click,
                the fact of purchase, the fact of return — with no identification of the person.
              </p>
            </div>
          </MotionDiv>

          {/* the actual technical ask */}
          <MotionDiv className="mt-8 rounded-[1.5rem] border border-[#e0d4c2] bg-[#fbf6ee] p-6" {...fadeInUp}>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#6f4b20]">
              The technical ask
            </p>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-[1.1rem] border border-[#ece0cf] bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <Store size={22} className="text-[#6f4b20]" />
                  <p className="font-semibold text-[#2c2214]">Shopify integration</p>
                </div>
                <p className="mb-4 text-[0.9rem] leading-relaxed text-[#7b6b59]">
                  We need access to events only for orders tagged with our Session ID
                  (order tag / attribute).
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {['Add to Cart', 'Order Created', 'Return Created'].map((e, i) => (
                    <React.Fragment key={e}>
                      {i > 0 && <span className="text-[#c2a476]">+</span>}
                      <span className="rounded-full border border-[#d8cab7] bg-[#fbf7f0] px-3 py-1.5 text-[0.8rem] text-[#5a4c3b]">
                        {e}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.1rem] border border-[#ece0cf] bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <BarChart3 size={22} className="text-[#6f4b20]" />
                  <p className="font-semibold text-[#2c2214]">Web analytics (Google Analytics or similar)</p>
                </div>
                <p className="mb-3 text-[0.9rem] leading-relaxed text-[#7b6b59]">
                  Access to aggregated metrics:
                </p>
                <p className="font-semibold text-[#2c2214]">Time on Site / Time on Product Page</p>
                <p className="mt-1 text-[0.9rem] leading-relaxed text-[#7b6b59]">
                  segmented by A/B test group: saw the try-on vs did not.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-4 rounded-[1.1rem] bg-[#f1e3cf] px-5 py-4">
              <Check size={22} className="mt-0.5 shrink-0 text-[#6f4b20]" />
              <p className="text-[0.95rem] leading-relaxed text-[#5a4c3b]">
                This keeps the analytics transparent and lets us prove the real contribution of
                virtual try-on to your growth — while respecting your customers' privacy.
              </p>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-[#f7f2ea] border-b border-[#e0d4c2]">
        <div className="max-w-7xl mx-auto">
          <MotionDiv {...fadeInUp}>
            <SectionHeader
              badge="Pricing"
              title="Simple, usage-based pricing."
              subtitle="Pay only for the AI try-ons you actually use. A fixed subscription plus a charge per successfully completed try-on — no packages, no prepayment."
            />
          </MotionDiv>

          {/* the two components of the price */}
          <MotionDiv
            className="mx-auto mb-10 flex max-w-4xl flex-col items-stretch gap-4 sm:flex-row sm:items-center"
            {...fadeInUp}
          >
            <div className="flex-1 overflow-hidden rounded-[1.5rem] border border-[#e0d4c2] bg-[#fbf6ee] text-center">
              <div className="px-6 pt-8 pb-6">
                <p className="text-4xl font-semibold tracking-tight text-[#2c2214] md:text-5xl">{usd(PRICE_SUBSCRIPTION)}</p>
                <p className="mt-1 text-lg text-[#7b6b59]">/ month</p>
              </div>
              <p className="bg-[#8a6239] px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#f7f2ea]">
                Fixed monthly subscription
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e0d4c2] bg-white text-2xl font-light text-[#6f4b20]">
                +
              </span>
            </div>

            <div className="flex-1 overflow-hidden rounded-[1.5rem] border border-[#e0d4c2] bg-[#fbf6ee] text-center">
              <div className="px-6 pt-8 pb-6">
                <p className="text-4xl font-semibold tracking-tight text-[#2c2214] md:text-5xl">{rateLabel}</p>
                <p className="mt-1 text-lg text-[#7b6b59]">/ AI try-on</p>
              </div>
              <p className="bg-[#8a6239] px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#f7f2ea]">
                Per successful AI try-on
              </p>
            </div>
          </MotionDiv>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr]">

            {/* the volume table */}
            <MotionDiv className="overflow-hidden rounded-[1.5rem] border border-[#e0d4c2] bg-[#fbf6ee]" {...fadeInUp}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-center tabular-nums">
                  <thead>
                    <tr className="bg-[#6b4c2b] text-[#f7f2ea]">
                      <th className="px-4 py-4 text-[0.7rem] font-semibold uppercase leading-tight tracking-[0.12em]">
                        AI try-ons<br /><span className="font-normal opacity-80">/ month</span>
                      </th>
                      <th className="px-4 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">Monthly subscription</th>
                      <th className="px-4 py-4 text-[0.7rem] font-semibold uppercase leading-tight tracking-[0.12em]">
                        AI try-on usage<br /><span className="font-normal normal-case opacity-80">({rateLabel} each)</span>
                      </th>
                      <th className="px-4 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">Total monthly cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRYON_VOLUMES.map((tryons) => {
                      const usage = tryons * PRICE_PER_TRYON;
                      return (
                        <tr
                          key={tryons}
                          className={`border-t border-[#ece0cf] text-[0.9rem] ${
                            tryons === EXAMPLE_VOLUME ? 'bg-[#f1e3cf] font-medium' : 'odd:bg-white/50'
                          }`}
                        >
                          <td className="px-4 py-3 text-[#2c2214]">{groupThousands(String(tryons))}</td>
                          <td className="px-4 py-3 text-[#7b6b59]">{usd(PRICE_SUBSCRIPTION)}</td>
                          <td className="px-4 py-3 text-[#7b6b59]">{usd(usage)}</td>
                          <td className="px-4 py-3 font-semibold text-[#2c2214]">{usd(usage + PRICE_SUBSCRIPTION)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </MotionDiv>

            {/* what the subscription buys, plus a worked example */}
            <div className="space-y-6">
              <MotionDiv
                className="rounded-[1.5rem] border border-[#e0d4c2] bg-[#fbf6ee] p-6"
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#2c2214]">
                  What&rsquo;s included in {usd(PRICE_SUBSCRIPTION)} / month
                </p>
                <ul className="space-y-0">
                  {[
                    { icon: Sparkles,   text: 'Repro AI Virtual Try-On platform' },
                    { icon: Code2,      text: 'Website widget integration' },
                    { icon: Server,     text: 'Technical infrastructure' },
                    { icon: BarChart3,  text: 'Basic usage analytics' },
                    { icon: Headphones, text: 'Technical support' },
                    { icon: RefreshCw,  text: 'Product updates' },
                  ].map((f) => (
                    <li key={f.text} className="flex items-center gap-4 border-b border-[#ece0cf] py-3 last:border-0 last:pb-0">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8a6239] text-white">
                        <f.icon size={16} />
                      </span>
                      <span className="text-[0.9rem] leading-snug text-[#5a4c3b]">{f.text}</span>
                    </li>
                  ))}
                </ul>
              </MotionDiv>

              <MotionDiv
                className="rounded-[1.5rem] border border-[#e0d4c2] bg-[#f1e3cf] p-6"
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#2c2214]">
                  Example
                </p>
                <div className="flex items-start gap-5">
                  <span className="hidden shrink-0 items-center justify-center rounded-[0.9rem] border border-[#c2a476] p-3 text-[#6f4b20] sm:flex">
                    <Layers size={30} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-2xl font-semibold text-[#2c2214]">{groupThousands(String(EXAMPLE_VOLUME))}</p>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#6f4b20]">
                      AI try-ons per month
                    </p>
                    <div className="mt-3 space-y-1 text-[0.88rem] text-[#5a4c3b]">
                      <p>{usd(PRICE_SUBSCRIPTION)} — subscription</p>
                      <p>
                        {usd(EXAMPLE_VOLUME * PRICE_PER_TRYON)} — usage{' '}
                        <span className="text-[#7b6b59]">
                          ({groupThousands(String(EXAMPLE_VOLUME))} × {rateLabel})
                        </span>
                      </p>
                    </div>
                    <p className="mt-4 border-t border-[#d8cab7] pt-3 text-right text-2xl font-semibold text-[#2c2214]">
                      {usd(EXAMPLE_VOLUME * PRICE_PER_TRYON + PRICE_SUBSCRIPTION)}{' '}
                      <span className="text-base font-normal text-[#7b6b59]">/ month</span>
                    </p>
                  </div>
                </div>
              </MotionDiv>
            </div>
          </div>

          {/* the two guarantees */}
          <motion.div
            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {[
              { icon: Wallet, title: 'Pay only for actual usage',
                desc: `You never buy a usage package up front. The ${rateLabel} is charged only for a try-on that completed successfully.` },
              { icon: Shield, title: 'No prepayment, no packages',
                desc: 'At the end of the month you pay for the try-ons that actually ran, and nothing else.' },
            ].map((c) => (
              <MotionDiv key={c.title} variants={itemVariants}>
                <div className="flex h-full items-start gap-4 rounded-[1.25rem] border border-[#e0d4c2] bg-[#fbf6ee] p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8a6239] text-white">
                    <c.icon size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#2c2214]">{c.title}</p>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-[#7b6b59]">{c.desc}</p>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </motion.div>

          <MotionDiv className="mx-auto mt-10 max-w-md" {...fadeInUp}>
            <button
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="w-full rounded-full bg-[#2c2214] py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#f7f2ea] transition-colors hover:bg-black"
            >
              Request access
            </button>
            <p className="mt-5 text-center text-xs uppercase tracking-[0.16em] text-[#a1907a]">
              Cancel anytime — no long-term lock-in
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
                     {/* Labels are visually hidden, not absent: a placeholder disappears the
                         moment someone starts typing, and a screen reader announces an
                         unlabelled field as nothing at all. */}
                     <label htmlFor="lead-email" className="sr-only">Work email</label>
                     <input
                       id="lead-email"
                       name="email"
                       type="email"
                       autoComplete="email"
                       spellCheck={false}
                       placeholder="Work email"
                       required
                       className="w-full px-5 py-4 rounded-full text-[#2c2214] placeholder-[#b3a38f] focus:outline-none focus:ring-2 focus:ring-[#c2a476] shadow-sm bg-[#f7f2ea]"
                     />

                     <label htmlFor="lead-role" className="sr-only">Your role</label>
                     <input
                       id="lead-role"
                       name="role"
                       type="text"
                       autoComplete="organization-title"
                       placeholder="Your role, e.g. Head of E-commerce"
                       required
                       className="w-full px-5 py-4 rounded-full text-[#2c2214] placeholder-[#b3a38f] focus:outline-none focus:ring-2 focus:ring-[#c2a476] shadow-sm bg-[#f7f2ea]"
                     />

                     <button type="submit" disabled={formState !== 'idle'} className="w-full bg-[#c2a476] text-[#2c2214] font-semibold py-4 rounded-full hover:bg-[#b18d5f] transition-colors shadow-lg tracking-[0.18em] uppercase text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2c2214] disabled:opacity-70">
                         {formState === 'loading' ? 'Processing…' : formState === 'success' ? 'Request Received' : 'Request Access'}
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
    </MotionConfig>
  );
}
