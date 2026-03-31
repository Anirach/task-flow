import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Layout, Users, Zap, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#solutions" className="hover:text-primary transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
            <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary rounded-full">
              The Future of Work is Here
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Manage projects with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                unmatched precision.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              TaskFlow brings all your teams, tasks, and tools together in one place. 
              Streamline your workflow and ship faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2 group">
                Start for free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent z-10" />
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 p-2">
              <img 
                src="https://picsum.photos/seed/taskflow-dashboard/1600/900" 
                alt="TaskFlow Dashboard" 
                className="rounded-xl w-full h-auto shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship</h2>
            <p className="text-slate-600 dark:text-slate-400">Powerful features to help your team stay organized and focused.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Layout className="text-primary" size={24} />,
                title: "Dynamic Boards",
                description: "Customizable Kanban boards that adapt to your team's unique workflow."
              },
              {
                icon: <Users className="text-blue-500" size={24} />,
                title: "Team Collaboration",
                description: "Real-time comments, task assignments, and activity tracking."
              },
              {
                icon: <Zap className="text-amber-500" size={24} />,
                title: "Lightning Fast",
                description: "Optimized for speed. No more waiting for pages to load."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-slate-950 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-primary rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Ready to transform your workflow?</h2>
          <p className="text-primary-light text-lg mb-10 max-w-xl mx-auto relative z-10">
            Join 10,000+ teams already using TaskFlow to build amazing things.
          </p>
          <Link to="/login" className="inline-block bg-white text-primary px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all relative z-10">
            Get Started Now — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">T</div>
            <span className="font-bold">TaskFlow</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
          <div className="flex gap-4">
            <Twitter size={20} className="text-slate-400 hover:text-primary cursor-pointer" />
            <Github size={20} className="text-slate-400 hover:text-primary cursor-pointer" />
            <Linkedin size={20} className="text-slate-400 hover:text-primary cursor-pointer" />
          </div>
        </div>
        <div className="text-center mt-8 text-xs text-slate-400">
          © 2026 TaskFlow Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
