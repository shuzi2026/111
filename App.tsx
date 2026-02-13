
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScrollText, 
  Sword, 
  Map as MapIcon, 
  Gamepad, 
  BookOpen, 
  Music, 
  Film, 
  Heart,
  Settings,
  ShieldCheck,
  Plus,
  Trash2,
  ChevronRight,
  Zap,
  Star
} from 'lucide-react';
import { INITIAL_BLOGS, INITIAL_PROJECTS, INITIAL_HOBBIES, INITIAL_MINDMAP } from './constants';
import { BlogPost, Project, HobbyItem, MindMapNode } from './types';
import MindMapDisplay from './components/MindMap';

// --- Falling Leaves Particle System ---
const FallingLeaves = () => {
  const [leaves, setLeaves] = useState<{id: number, left: string, delay: string, duration: string, size: number, color: string}[]>([]);

  useEffect(() => {
    const newLeaves = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      delay: Math.random() * 5 + 's',
      duration: 10 + Math.random() * 10 + 's',
      size: 15 + Math.random() * 15,
      color: Math.random() > 0.5 ? '#c53030' : '#f97316'
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {leaves.map(leaf => (
        <div 
          key={leaf.id}
          className="leaf"
          style={{
            left: leaf.left,
            animation: `leaf-fall ${leaf.duration} linear ${leaf.delay} infinite`,
            width: leaf.size,
            height: leaf.size,
            backgroundColor: leaf.color,
            clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)'
          }}
        />
      ))}
    </div>
  );
};

// --- HUD Component ---
const GameHUD = ({ isAdmin, onLogout }: { isAdmin: boolean; onLogout: () => void }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className={`max-w-7xl mx-auto flex justify-between items-center bg-white border-4 border-slate-900 p-4 shadow-[8px_8px_0px_rgba(0,0,0,1)] ${isAdmin ? 'admin-glow border-red-600' : ''}`}>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-black font-handwriting hover:text-red-600 transition tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 border-2 border-slate-900 shadow-[2px_2px_0px_#000]"></div>
            冒险家·日志
          </Link>
          <div className="hidden lg:flex gap-6 items-center ml-8 border-l-2 border-slate-200 pl-8">
             <div className="flex flex-col">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] font-black text-slate-400">生命值 HP</span>
                 <span className="text-[10px] font-black text-red-600">85/100</span>
               </div>
               <div className="hud-bar w-40"><div className="hud-fill w-[85%] bg-red-600"></div></div>
             </div>
             <div className="flex flex-col">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] font-black text-slate-400">饱食度 SAT</span>
                 <span className="text-[10px] font-black text-orange-500">MAX</span>
               </div>
               <div className="hud-bar w-32"><div className="hud-fill w-full bg-orange-500"></div></div>
             </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <nav className="flex gap-2">
            {[
              { path: '/', label: '日志', icon: <ScrollText size={18}/> },
              { path: '/hobbies', label: '收藏', icon: <Star size={18}/> },
              { path: '/projects', label: '任务', icon: <Sword size={18}/> },
              { path: '/overview', label: '地图', icon: <MapIcon size={18}/> },
            ].map(nav => (
              <Link 
                key={nav.path} 
                to={nav.path} 
                className={`pixel-btn gap-2 text-sm ${isActive(nav.path) ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
              >
                {nav.icon} <span className="hidden sm:inline">{nav.label}</span>
              </Link>
            ))}
          </nav>
          
          {isAdmin ? (
            <button onClick={onLogout} className="pixel-btn bg-yellow-400 gap-2 border-red-600 text-red-700">
              <ShieldCheck size={18}/> <span className="hidden md:inline">管理终端</span>
            </button>
          ) : (
            <Link to="/login" className="pixel-btn hover:bg-slate-100 group">
              <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.2 }}
    className="pt-32 pb-20 px-6 relative z-10"
  >
    {children}
  </motion.div>
);

const HomePage = ({ blogs, isAdmin, onAdd, onDelete }: { blogs: BlogPost[]; isAdmin: boolean; onAdd: () => void; onDelete: (id: string) => void }) => (
  <PageWrapper>
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-24 text-center">
         <div className="relative mb-12">
            <div className="w-40 h-40 pixel-box overflow-hidden shadow-[16px_16px_0px_#c53030] border-slate-900 scanlines">
              <img src="https://picsum.photos/seed/diary-pixel/400" alt="Avatar" className="w-full h-full object-cover grayscale-[20%] sepia-[10%]" />
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-6 -right-6 bg-red-600 border-4 border-slate-900 px-4 py-2 text-white font-black shadow-[4px_4px_0px_#000]"
            >
              LEVEL UP!
            </motion.div>
         </div>
         <h1 className="text-7xl font-black mb-6 font-handwriting text-slate-900 drop-shadow-md">
           枫叶落下，<span className="text-red-600">灵感</span> 升起
         </h1>
         <p className="text-xl text-slate-500 max-w-xl font-medium leading-relaxed bg-white/50 p-4 rounded-xl backdrop-blur-sm border-2 border-dashed border-slate-300">
           欢迎来到我的个人存档。我是一名独立开发者，正在创作名为《日记》的游戏。这里记录了我对游戏设计、像素艺术和技术研究的所有热情。
         </p>
      </div>

      <div className="space-y-16">
        <div className="flex justify-between items-center border-b-8 border-double border-slate-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-4 h-8 bg-red-600"></div>
            <h2 className="text-4xl font-black font-handwriting">日志任务板 (Quest Log)</h2>
          </div>
          {isAdmin && (
            <button onClick={onAdd} className="pixel-btn bg-red-600 text-white scale-110"><Plus size={24}/></button>
          )}
        </div>
        
        <div className="grid gap-12">
          {blogs.map((blog, idx) => (
            <motion.div 
              key={blog.id} 
              whileHover={{ x: 10, backgroundColor: '#fffdfa' }}
              className="pixel-box p-10 group cursor-pointer border-slate-800"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black">#{idx + 1}</div>
                  <div className="text-sm font-black text-slate-400 font-mono tracking-tighter uppercase">{blog.date}</div>
                </div>
                {isAdmin && <button onClick={() => onDelete(blog.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2"><Trash2 size={24}/></button>}
              </div>
              <h3 className="text-4xl font-black mb-6 group-hover:text-red-600 transition-colors tracking-tight">{blog.title}</h3>
              <p className="text-slate-500 text-xl leading-relaxed mb-8">{blog.excerpt}</p>
              <div className="flex flex-wrap gap-3">
                {blog.tags.map(tag => (
                  <span key={tag} className="bg-white border-2 border-slate-900 px-4 py-1 text-xs font-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 transition-colors">
                    EXP: {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </PageWrapper>
);

const HobbiesPage = ({ hobbies, isAdmin, onAdd, onDelete }: { hobbies: HobbyItem[]; isAdmin: boolean; onAdd: () => void; onDelete: (id: string) => void }) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'book': return <BookOpen className="text-blue-500" />;
      case 'movie': return <Film className="text-red-500" />;
      case 'music': return <Music className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-20">
          <h2 className="text-6xl font-black font-handwriting text-slate-900">收藏家陈列室 (Trophy Room)</h2>
          {isAdmin && <button onClick={onAdd} className="pixel-btn bg-red-600 text-white"><Plus/></button>}
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {hobbies.map(item => (
            <motion.div 
              key={item.id} 
              whileHover={{ rotate: 1, scale: 1.02 }}
              className="pixel-box p-10 relative overflow-hidden group bg-gradient-to-br from-white to-slate-50"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-4 bg-white border-4 border-slate-900 shadow-[4px_4px_0px_#000] group-hover:bg-slate-900 group-hover:text-white transition-all">
                    {getIcon(item.type)}
                 </div>
                 <span className="font-black text-sm uppercase tracking-widest text-slate-400">{item.type}</span>
              </div>
              <h3 className="text-3xl font-black mb-3">{item.title}</h3>
              <p className="text-sm text-slate-400 mb-8 font-bold tracking-tighter">— {item.creator.toUpperCase()}</p>
              <div className="bg-slate-900 text-slate-200 p-6 text-lg italic mb-8 relative">
                <div className="absolute top-0 left-0 w-4 h-4 bg-red-600 -translate-x-2 -translate-y-2"></div>
                “{item.comment}”
              </div>
              <div className="flex gap-2">
                {Array.from({length: 5}).map((_, i) => (
                  <Zap key={i} size={20} className={i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
                ))}
              </div>
              {isAdmin && <button onClick={() => onDelete(item.id)} className="absolute top-6 right-6 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={24}/></button>}
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

const ProjectsPage = ({ projects, isAdmin, onAdd, onDelete }: { projects: Project[]; isAdmin: boolean; onAdd: () => void; onDelete: (id: string) => void }) => (
  <PageWrapper>
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-24">
        <div>
           <h2 className="text-6xl font-black font-handwriting mb-4">副本挑战 (Dungeon List)</h2>
           <p className="text-xl text-slate-500 font-bold border-l-4 border-red-600 pl-4">高风险，高回报的创意实验室。</p>
        </div>
        {isAdmin && <button onClick={onAdd} className="pixel-btn bg-red-600 text-white"><Plus/></button>}
      </div>
      <div className="grid md:grid-cols-2 gap-20">
        {projects.map(project => (
          <div key={project.id} className="group relative">
            <div className="pixel-box p-3 mb-10 bg-slate-900 group-hover:bg-red-600 transition-colors duration-300">
              <div className="aspect-video w-full overflow-hidden border-4 border-white scanlines">
                <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="px-5 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] border-2 border-slate-900">
                {project.category === 'game' ? 'MAIN QUEST' : 'SIDE TASK'}
              </div>
              <div className="h-1 flex-grow bg-slate-200"></div>
            </div>
            <h3 className="text-5xl font-black mb-6 font-handwriting group-hover:text-red-600 transition-colors">{project.name}</h3>
            <p className="text-slate-600 mb-10 leading-relaxed font-bold text-lg">{project.description}</p>
            <div className="flex items-center gap-4">
               <button className="pixel-btn gap-3 bg-slate-900 text-white px-8 py-4 group-hover:bg-red-600 group-hover:border-red-900 transition-all">
                 进入副本 <ChevronRight size={20}/>
               </button>
               {isAdmin && <button onClick={() => onDelete(project.id)} className="p-4 border-4 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2/></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </PageWrapper>
);

const LoginPage = ({ onLogin }: { onLogin: (id: string, pass: string) => void }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  return (
    <div className="flex items-center justify-center min-h-[85vh]">
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="pixel-box p-16 w-full max-w-lg bg-white relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-900 text-white font-black text-sm uppercase tracking-widest border-4 border-white shadow-lg">
          Secure Terminal
        </div>
        <h2 className="text-5xl font-black mb-12 font-handwriting text-center text-slate-900 italic underline decoration-red-600 underline-offset-8">系统鉴权</h2>
        <div className="space-y-10 font-bold">
          <div>
            <label className="block text-xs text-slate-400 mb-4 uppercase tracking-[0.3em] font-black">Operator ID</label>
            <input placeholder="ENTER ID..." value={id} onChange={e => setId(e.target.value)} className="w-full bg-slate-50 border-4 border-slate-900 p-5 focus:outline-none focus:bg-white focus:border-red-600 text-xl font-black tracking-widest" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-4 uppercase tracking-[0.3em] font-black">Security Code</label>
            <input type="password" placeholder="********" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-slate-50 border-4 border-slate-900 p-5 focus:outline-none focus:bg-white focus:border-red-600 text-xl font-black tracking-widest" />
          </div>
          <button onClick={() => onLogin(id, pass)} className="w-full pixel-btn bg-slate-900 text-white py-6 hover:bg-red-600 border-none text-2xl tracking-[0.2em]">
            UNLOCK TERMINAL
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [hobbies, setHobbies] = useState<HobbyItem[]>(INITIAL_HOBBIES);
  const [mindmap, setMindmap] = useState<MindMapNode>(INITIAL_MINDMAP);

  const handleLogin = (id: string, pass: string) => {
    if (id === '12345' && pass === '54321') {
      setIsAdmin(true);
      window.location.hash = '#/';
    } else {
      alert('身份识别错误！系统拒绝访问。');
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen">
        <FallingLeaves />
        <GameHUD isAdmin={isAdmin} onLogout={() => setIsAdmin(false)} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage blogs={blogs} isAdmin={isAdmin} onAdd={() => setBlogs([{id: Date.now().toString(), title: '新副本记录', excerpt: '一段未知的冒险即将开始...', content: '', date: '2024-XX-XX', tags: ['Draft']}, ...blogs])} onDelete={id => setBlogs(blogs.filter(b => b.id !== id))} />} />
            <Route path="/hobbies" element={<HobbiesPage hobbies={hobbies} isAdmin={isAdmin} onAdd={() => setHobbies([{id: Date.now().toString(), type: 'book', title: '神秘卷轴', creator: '匿名', comment: '...', rating: 5}, ...hobbies])} onDelete={id => setHobbies(hobbies.filter(h => h.id !== id))} />} />
            <Route path="/projects" element={<ProjectsPage projects={projects} isAdmin={isAdmin} onAdd={() => setProjects([{id: Date.now().toString(), name: '新任务模块', description: '正在解析中...', category: 'dev', image: 'https://picsum.photos/seed/quest/800/400'}, ...projects])} onDelete={id => setProjects(projects.filter(p => p.id !== id))} />} />
            <Route path="/overview" element={<PageWrapper><MindMapDisplay data={mindmap} isAdmin={isAdmin} onUpdate={setMindmap} /></PageWrapper>} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          </Routes>
        </AnimatePresence>
      </div>
    </HashRouter>
  );
}
