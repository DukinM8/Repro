import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Layers, Shield, Smartphone, Globe, BarChart3 } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
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
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        <a href="#product" className="hover:text-[#2c2214] transition-colors">Product</a>
        <a href="#solutions" className="hover:text-[#2c2214] transition-colors">Solutions</a>
        <a href="#developers" className="hover:text-[#2c2214] transition-colors">Developers</a>
        <a href="#pricing" className="hover:text-[#2c2214] transition-colors">Pricing</a>
      </div>
      <div className="flex gap-4">
        <button className="text-sm font-medium text-gray-600 hover:text-[#2c2214]">Log In</button>
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
        <h2 className="text-3xl md:text-5xl font-semibold text-[#2c2214] mb-6 leading-tight tracking-[0.06em]">{title}</h2>
        <p className="text-lg text-[#7b6b59] leading-relaxed">{subtitle}</p>
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="p-8 rounded-2xl bg-[#fbf6ee] border border-[#e0d4c2] shadow-sm hover:shadow-lg hover:border-[#a47c48] transition-all duration-300 group">
        <div className="w-12 h-12 rounded-xl bg-[#2c2214] flex items-center justify-center text-[#f7f2ea] mb-6 group-hover:bg-[#f7f2ea] group-hover:text-[#2c2214] transition-colors">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
);

const StatCard = ({ value, label }) => (
    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
        <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
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

    // Optional: store in Firestore if configured
    if (db) {
      try {
        await addDoc(collection(db, 'artifacts', 'repro', 'leads'), {
          email,
          role,
          ts: serverTimestamp()
        });
      } catch (e) {
        console.log("DB Write Simulated");
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
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1e3cf] border border-[#e0d4c2] text-[#6f4b20] text-xs font-semibold tracking-[0.2em] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a47c48]"></span>
                    Repro for Fashion Houses
                </div>
                <h1 className="text-5xl lg:text-7xl font-semibold text-[#2c2214] leading-[1.05] tracking-[0.04em]">
                    Fit is not a <br/>
                    <span className="text-black">Guessing Game.</span>
                </h1>
                <p className="text-lg text-[#7b6b59] leading-relaxed max-w-lg">
                    Repro is the enterprise infrastructure for Virtual Try-On. 
                    We help fashion brands reduce returns and increase conversion with physics-based simulation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      onClick={() => document.getElementById('contact').scrollIntoView({behavior:'smooth'})}
                      className="bg-[#2c2214] text-[#f7f2ea] px-8 py-4 rounded-full font-semibold tracking-[0.16em] hover:bg-black transition-colors shadow-lg shadow-black/20 flex items-center justify-center gap-2"
                    >
                        Start Pilot Program <ArrowRight size={18} />
                    </button>
                    <button className="bg-transparent text-[#2c2214] border border-[#c2a476] px-8 py-4 rounded-full font-medium tracking-[0.14em] hover:bg-[#f1e3cf] transition-colors">
                        View Lookbook
                    </button>
                </div>
                <div className="pt-8 flex items-center gap-8 text-sm font-medium text-[#a1907a]">
                    <span>TRUSTED BY</span>
                    <div className="flex gap-6 grayscale opacity-60">
                        {/* Placeholder Logos */}
                        <span className="font-serif tracking-[0.3em] text-[#4a3a28] uppercase">VOGUE</span>
                        <span className="font-sans tracking-[0.3em] text-[#4a3a28] uppercase">SSENSE</span>
                        <span className="font-mono tracking-[0.3em] text-[#4a3a28] uppercase">ACNE</span>
                    </div>
                </div>
            </div>
            
            {/* Dashboard Visual */}
            <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] border border-[#e0d4c2] bg-gradient-to-tr from-[#f7f2ea] to-[#f1e3cf]"></div>
                <div className="relative bg-[#fbf6ee] border border-[#e0d4c2] rounded-2xl shadow-2xl overflow-hidden aspect-[4/3]">
                    <div className="h-10 border-b border-[#e0d4c2] bg-[#f7f2ea] flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="ml-auto text-xs font-mono text-[#a1907a] uppercase tracking-[0.18em]">preview.repro.studio</div>
                    </div>
                    <div className="p-1 relative h-full">
                         <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop" className="w-full h-full object-cover rounded-b-lg" alt="Editorial fashion layout" />
                         {/* Floating Widget */}
                         <div className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-w-xs animate-bounce-slow">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check size={14} strokeWidth={3} /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Analysis Complete</p>
                                    <p className="text-[10px] text-gray-500">Fabric drape simulated</p>
                                </div>
                            </div>
                            <div className="w-full bg-[#e0d4c2] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#a47c48] h-full w-[92%]"></div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-12 bg-[#f7f2ea] border-b border-[#e0d4c2]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="30%" label="Reduction in Returns" />
            <StatCard value="2.4x" label="Conversion Uplift" />
            <StatCard value="<100ms" label="Render Latency" />
            <StatCard value="0" label="Downloads Required" />
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-6 bg-[#f3ebde]">
        <div className="max-w-7xl mx-auto">
            <SectionHeader 
                badge="Capabilities" 
                title="The Operating System for Digital Fashion." 
                subtitle="We solved the hardest problems in computer vision so you don't have to. Integrate a complete virtual try-on stack in days, not months." 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard 
                    icon={Smartphone}
                    title="Zero Friction"
                    desc="No app downloads or 3D scanning required. Users upload a raw photo directly on the PDP and get results instantly."
                />
                <FeatureCard 
                    icon={Layers}
                    title="Fabric Physics"
                    desc="Our engine simulates GSM weight, drape, and texture. Silk flows like silk. Denim stacks like denim."
                />
                <FeatureCard 
                    icon={Zap}
                    title="Confidence Filter"
                    desc="We automatically enhance lighting and exposure on user photos, turning bad selfies into studio-quality assets."
                />
                <FeatureCard 
                    icon={Shield}
                    title="Enterprise Secure"
                    desc="SOC2 Type II compliant. User photos are processed in volatile memory and never stored on disk."
                />
                <FeatureCard 
                    icon={Globe}
                    title="Global Edge Network"
                    desc="Renders are processed on the edge node closest to your user, ensuring sub-second latency worldwide."
                />
                <FeatureCard 
                    icon={BarChart3}
                    title="Analytics Dashboard"
                    desc="Track how virtual try-on usage correlates with conversion rates and return reduction in real-time."
                />
            </div>
        </div>
      </section>

      {/* INTEGRATION PREVIEW */}
      <section className="py-24 px-6 bg-[#f7f2ea] border-y border-[#e0d4c2]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
                <span className="text-gray-900 font-bold text-sm uppercase tracking-wide">Developers First</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Five lines of code. <br/>Infinite possibilities.</h2>
                <p className="text-lg text-gray-600 mb-8">
                    Repro is headless by design. Whether you are on Shopify, Salesforce, or a custom Next.js stack, our SDK drops in without disrupting your existing architecture.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Check className="text-green-500" size={20} />
                        <span className="text-gray-700 font-medium">React, Vue, and Vanilla JS SDKs</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Check className="text-green-500" size={20} />
                        <span className="text-gray-700 font-medium">Webhooks for Order Analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Check className="text-green-500" size={20} />
                        <span className="text-gray-700 font-medium">Full TypeScript Support</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
                <div className="flex items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="ml-4 text-xs text-gray-400 font-mono">ProductPage.tsx</span>
                </div>
                <div className="p-6 overflow-x-auto">
                    <pre className="font-mono text-sm leading-relaxed">
                        <span className="text-purple-400">import</span> {'{ Layer }'} <span className="text-purple-400">from</span> <span className="text-green-400">'@layer/react'</span>;
                        {'\n\n'}
                        <span className="text-blue-400">export default function</span> <span className="text-yellow-200">Product</span>() {'{'}
                        {'\n'}
                        &nbsp;&nbsp;<span className="text-purple-400">return</span> (
                        {'\n'}
                        &nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-yellow-200">Layer</span>
                        {'\n'}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">apiKey</span>=<span className="text-green-400">"pk_live_..."</span>
                        {'\n'}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">productId</span>={'{'}<span className="text-purple-400">product.id</span>{'}'}
                        {'\n'}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">theme</span>=<span className="text-green-400">"light"</span>
                        {'\n'}
                        &nbsp;&nbsp;&nbsp;&nbsp;{'/>'}
                        {'\n'}
                        &nbsp;&nbsp;);
                        {'\n'}
                        {'}'}
                    </pre>
                </div>
            </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-[#f3ebde] border-b border-[#e0d4c2]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-[#f1e3cf] border border-[#e0d4c2] text-[#6f4b20] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#2c2214] tracking-[0.06em] mb-4">
              Simple pricing for modern fashion.
            </h2>
            <p className="text-[#7b6b59] text-lg">
              Repro is designed to be an easy add-on to your PDPs — no huge license, no hidden fees. 
              We keep monthly retainers around what you would spend on a single high‑quality shoot, not a full team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-[#e0d4c2] bg-[#fbf6ee] p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-[0.18em] uppercase text-[#7b6b59]">Starter (from low hundreds / month)</h3>
                <p className="text-sm text-[#7b6b59]">
                  Ideal for emerging brands testing virtual try-on on a few hero categories with predictable, flat monthly pricing.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[#5a4c3b]">
                  <li>· Designed for ~500 monthly visits to try‑on</li>
                  <li>· Email support</li>
                  <li>· 2 integration environments</li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-[#c2a476] bg-[#f7f2ea] p-8 flex flex-col justify-between shadow-lg">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-[0.18em] uppercase text-[#7b6b59]">Growth (around $500 / month)</h3>
                <p className="text-sm text-[#7b6b59]">
                  For brands rolling Repro out across collections and geographies.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[#5a4c3b]">
                  <li>· Fair, all‑in monthly fee</li>
                  <li>· Dedicated CSM</li>
                  <li>· A/B testing support</li>
                </ul>
              </div>
              <button
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="mt-8 w-full bg-[#2c2214] text-[#f7f2ea] font-semibold py-3 rounded-full hover:bg-black transition-colors tracking-[0.16em] uppercase text-xs"
              >
                Talk to sales
              </button>
            </div>

            <div className="rounded-3xl border border-[#e0d4c2] bg-[#fbf6ee] p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-[0.18em] uppercase text-[#7b6b59]">Enterprise (custom retainer)</h3>
                <p className="text-sm text-[#7b6b59]">
                  Structured for global retailers with high volume and complex orgs.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[#5a4c3b]">
                  <li>· 250k+ try‑ons / month</li>
                  <li>· Priority SLA & support</li>
                  <li>· Security & procurement review</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-[#a1907a] tracking-[0.16em] uppercase">
            Transparent volume discounts · Cancel any time after pilot
          </p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="contact" className="py-24 px-6 bg-[#f3ebde]">
         <div className="max-w-4xl mx-auto bg-[#2c2214] rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             
             <div className="relative z-10">
                 <h2 className="text-3xl md:text-5xl font-semibold text-[#f7f2ea] mb-6 tracking-[0.24em] uppercase">Refine your fit experience.</h2>
                 <p className="text-[#e0d4c2] text-lg mb-10 max-w-2xl mx-auto">
                     Join the pilot program for high-volume brands. We are accepting 5 partners for Q1 2026.
                 </p>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4">
                     <input name="email" type="email" placeholder="Work email" required className="w-full px-5 py-4 rounded-full text-[#2c2214] placeholder-[#b3a38f] focus:outline-none focus:ring-2 focus:ring-[#c2a476] shadow-sm bg-[#f7f2ea]" />
                     <select name="role" className="w-full px-5 py-4 rounded-full text-[#2c2214] border-r-8 border-transparent focus:outline-none focus:ring-2 focus:ring-[#c2a476] cursor-pointer bg-[#f7f2ea]">
                         <option value="" disabled selected>Select your role</option>
                         <option value="Executive">Executive / Founder</option>
                         <option value="Product">Product Manager</option>
                         <option value="Engineering">Engineering / IT</option>
                     </select>
                     
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
         </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f7f2ea] border-t border-[#e0d4c2] pt-16 pb-8 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
             <div className="col-span-2 md:col-span-1">
                 <span className="font-semibold text-xl tracking-[0.3em] uppercase text-[#2c2214]">REPRO</span>
                 <p className="text-sm text-[#7b6b59] mt-4">Digital tailoring for luxury fashion.</p>
             </div>
             <div>
                 <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                 <ul className="space-y-2 text-sm text-gray-500">
                     <li><a href="#" className="hover:text-black">Features</a></li>
                     <li><a href="#" className="hover:text-black">Integrations</a></li>
                     <li><a href="#" className="hover:text-black">Enterprise</a></li>
                 </ul>
             </div>
             <div>
                 <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
                 <ul className="space-y-2 text-sm text-gray-500">
                     <li><a href="#" className="hover:text-black">Documentation</a></li>
                     <li><a href="#" className="hover:text-black">API Reference</a></li>
                     <li><a href="#" className="hover:text-black">Status</a></li>
                 </ul>
             </div>
             <div>
                 <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                 <ul className="space-y-2 text-sm text-gray-500">
                     <li><a href="#" className="hover:text-black">About</a></li>
                     <li><a href="#" className="hover:text-black">Blog</a></li>
                     <li><a href="#" className="hover:text-black">Contact</a></li>
                 </ul>
             </div>
         </div>
         <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
             <p>© 2026 Repro Technologies Inc.</p>
             <div className="flex gap-6 mt-4 md:mt-0">
                 <a href="#" className="hover:text-gray-600">Privacy</a>
                 <a href="#" className="hover:text-gray-600">Terms</a>
                 <a href="#" className="hover:text-gray-600">Security</a>
             </div>
         </div>
      </footer>
    </div>
  );
}