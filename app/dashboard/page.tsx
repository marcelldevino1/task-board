"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FolderKanban, Calendar as CalendarIcon, 
  Settings, Plus, Search, MoreHorizontal, 
  FileVideo, UploadCloud, Download, CheckCircle2, X,
  Clock, Trash2, User, Gamepad2, LogOut, Sun, Moon, Check, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Loader from "../../components/Loader";

// ⚠️ PASTE URL WEB APP DARI GOOGLE APPS SCRIPT DI SINI
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxntI_QCaicVvvNsH6-mYPtdTCYtpU3O7Bq_MbjCNLyKdlBu1_ZgeU9qJ_G8Y1QK0K9YQ/exec";

export default function DashboardLayout() {
  const router = useRouter();
  
  // --- STATE UTAMA ---
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // State baru untuk filter
  const [activeTab, setActiveTab] = useState("projects");
  const [userProfile, setUserProfile] = useState({ name: "Guest", email: "guest@streamdesk.com" });
  
  // State Modals
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchTasksFromSheets = async () => {
    if (GOOGLE_SHEET_URL === "PASTE_URL_WEB_APP_KAMU_DISINI") {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(GOOGLE_SHEET_URL);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("streamdesk_user");
    if (savedUser) setUserProfile(JSON.parse(savedUser));

    const savedTheme = localStorage.getItem("streamdesk_theme");
    if (savedTheme === "dark") setIsDarkMode(true);

    fetchTasksFromSheets();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("streamdesk_theme", !isDarkMode ? "dark" : "light");
  };

  const handleAddBrief = async (newTask: any) => {
    setTasks([newTask, ...tasks]);
    setIsCreateModalOpen(false);
    if (GOOGLE_SHEET_URL === "PASTE_URL_WEB_APP_KAMU_DISINI") return;
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      fetchTasksFromSheets();
    } catch (error) {
      console.error("Gagal menyimpan:", error);
    }
  };

  const handleDeleteTask = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
    if (GOOGLE_SHEET_URL === "PASTE_URL_WEB_APP_KAMU_DISINI") return;
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: id }),
      });
      fetchTasksFromSheets();
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  };

  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updated);
    setSelectedTask((prev: any) => ({ ...prev, status: newStatus }));

    if (GOOGLE_SHEET_URL === "PASTE_URL_WEB_APP_KAMU_DISINI") return;
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", id: taskId, status: newStatus }),
      });
      fetchTasksFromSheets();
    } catch (error) {
      console.error("Gagal mengubah status di Google Sheets:", error);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("streamdesk_user");
    router.push("/");
  };

  const handleUploadFiles = (taskId: number, newFiles: any[]) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, files: [...t.files, ...newFiles] } : t));
    setSelectedTask((prev: any) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  // 🔥 UPDATE LOGIKA FILTER: Gabungan Search + Status Filter
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className={`flex flex-col h-screen items-center justify-center ${isDarkMode ? "bg-[#111827] text-white" : "bg-[#f7f8fa] text-gray-900"}`}>
        <Loader />
        <p className={`mt-8 text-sm font-bold uppercase tracking-widest animate-pulse ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Sabar mas lagi kirim/cari data...
        </p>
      </div>
    );
  }

  // --- TEMA WARNA THEME ---
  const bgMain = isDarkMode ? "bg-[#111827] text-gray-100" : "bg-[#f7f8fa] text-[#111827]";
  const bgSidebar = isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const bgHeader = isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const textTitle = isDarkMode ? "text-white" : "text-gray-900";
  const textSub = isDarkMode ? "text-gray-400" : "text-gray-500";
  const bgCard = isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm";

  return (
    <div className={`flex h-screen overflow-hidden antialiased transition-colors duration-300 ${bgMain}`}>
      
      {/* --- SIDEBAR KIRI --- */}
      <aside className={`w-64 flex flex-col z-10 shrink-0 border-r transition-colors duration-300 ${bgSidebar}`}>
        <div className={`h-16 flex items-center px-6 border-b transition-colors duration-300 ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <FileVideo className="w-3.5 h-3.5 text-white" />
            </div>
            StreamDesk
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className={`px-2 text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Main Menu</p>
          <SidebarItem isDark={isDarkMode} icon={<FolderKanban className="w-4 h-4" />} label="Projects" isActive={activeTab === "projects"} onClick={() => setActiveTab("projects")} />
          <SidebarItem isDark={isDarkMode} icon={<CalendarIcon className="w-4 h-4" />} label="Schedule" isActive={activeTab === "schedule"} onClick={() => setActiveTab("schedule")} />
          <div className="pt-6">
            <SidebarItem isDark={isDarkMode} icon={<Settings className="w-4 h-4" />} label="Settings" isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
          </div>
        </nav>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {activeTab === "projects" && (
          <header className={`h-16 flex items-center justify-between px-8 shrink-0 border-b transition-colors duration-300 ${bgHeader}`}>
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
              <input 
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search briefs..." 
                className={`pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-72 transition-all border ${isDarkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900"}`}
              />
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
              <Plus className="w-4 h-4" /> New Brief
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto p-8 w-full">
          
          {/* TAB: PROJECTS */}
          {activeTab === "projects" && (
            <div className="w-full">
              
              {/* HEADER PROJECTS & FITUR FILTER STATUS */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className={`text-2xl font-bold tracking-tight ${textTitle}`}>Active Projects</h1>
                  <p className={`text-sm mt-1 ${textSub}`}>Kelola kebutuhan desain overlay dan turnamen kamu langsung dari Google Sheets.</p>
                </div>
                
                {/* TOMBOL FILTER */}
                <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
                  <div className={`px-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    <Filter className="w-4 h-4" />
                  </div>
                  {["all", "pending", "on going", "completed"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        statusFilter === f 
                          ? "bg-blue-600 text-white shadow-sm" 
                          : isDarkMode 
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800" 
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className={`h-64 rounded-2xl border border-dashed flex flex-col items-center justify-center ${isDarkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-300 bg-white"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <FolderKanban className={`w-6 h-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  </div>
                  <h3 className={`text-lg font-bold ${textTitle}`}>Belum ada Brief</h3>
                  <p className={`text-sm mt-1 mb-4 ${textSub}`}>Tidak ada data yang sesuai dengan pencarian atau filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full">
                  {filteredTasks.map((task) => (
                    <ProjectCard key={task.id} task={task} isDark={isDarkMode} onClick={() => setSelectedTask(task)} onDelete={(e) => handleDeleteTask(task.id, e)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB VIEW: SCHEDULE (TIMELINE VIEW FILTER AGENDA) */}
          {activeTab === "schedule" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold tracking-tight ${textTitle}`}>Match Timeline Agenda</h1>
                <p className={`text-sm mt-1 ${textSub}`}>Tampilan urutan jadwal seluruh stream turnamen agar jam tidak bentrok.</p>
              </div>
              
              <div className={`rounded-2xl border overflow-hidden ${bgCard}`}>
                {tasks.length === 0 ? (
                  <p className={`text-center py-12 text-sm ${textSub}`}>Tidak ada jadwal streaming aktif saat ini.</p>
                ) : (
                  <div className={`divide-y ${isDarkMode ? "divide-gray-800" : "divide-gray-100"}`}>
                    {[...tasks].reverse().map(task => {
                      const styles = getStatusStyles(task.status);
                      return (
                        <div key={task.id} className={`p-5 flex items-center justify-between transition-colors ${isDarkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}>
                          <div className="flex items-center gap-5">
                            <div className={`w-20 py-2.5 rounded-xl flex flex-col items-center justify-center font-bold text-center shadow-sm ${isDarkMode ? "bg-blue-950/40 text-blue-400 border border-blue-900/50" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                              <span className="text-sm tracking-tight">{task.date}</span>
                            </div>
                            <div>
                              <h4 className={`font-bold text-base ${textTitle}`}>{task.title}</h4>
                              <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1.5 ${textSub}`}>
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500" /> Jam: {task.startTime}</span>
                                <span className="flex items-center gap-1"><Gamepad2 className="w-3.5 h-3.5 text-gray-400" /> {task.match}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${styles.bg}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                            {task.status}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-3xl mx-auto">
              <h1 className={`text-2xl font-bold tracking-tight mb-6 ${textTitle}`}>Settings</h1>
              
              <div className={`p-6 rounded-2xl border flex items-center justify-between mb-4 ${bgCard}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl uppercase ${isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                    {userProfile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${textTitle}`}>{userProfile.name}</h3>
                    <p className={`text-sm ${textSub}`}>{userProfile.email}</p>
                  </div>
                </div>
                <button onClick={handleLogOut} className={`flex items-center gap-2 border px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${isDarkMode ? "border-gray-700 text-gray-400 hover:bg-red-900/20 hover:text-red-400" : "border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600"}`}>
                  <LogOut className="w-4 h-4" /> Keluar Akun
                </button>
              </div>

              <div className={`p-6 rounded-2xl border flex items-center justify-between ${bgCard}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? "bg-yellow-900/20 text-yellow-500" : "bg-gray-100 text-gray-600"}`}>
                    {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${textTitle}`}>Tema Gelap</h3>
                    <p className={`text-sm ${textSub}`}>Ubah tampilan dashboard menjadi mode gelap.</p>
                  </div>
                </div>
                <div onClick={toggleTheme} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isDarkMode ? "bg-blue-600" : "bg-gray-300"}`}>
                  <motion.div layout className="bg-white w-6 h-6 rounded-full shadow-md" transition={{ type: "spring", stiffness: 700, damping: 30 }} style={{ marginLeft: isDarkMode ? "auto" : 0 }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL DIALOGS --- */}
      <AnimatePresence>
        {isCreateModalOpen && <CreateModal isDark={isDarkMode} onClose={() => setIsCreateModalOpen(false)} onSave={handleAddBrief} />}
        {selectedTask && (
          <DetailModal 
            task={selectedTask} 
            isDark={isDarkMode} 
            onClose={() => setSelectedTask(null)} 
            onUpdateStatus={(status: string) => handleUpdateStatus(selectedTask.id, status)}
            onUploadFiles={(files: any[]) => handleUploadFiles(selectedTask.id, files)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ================= GLOBAL HELPER FUNSI WARNA STATUS BARU =================
const getStatusStyles = (status: string) => {
  switch(status?.toLowerCase()) {
    case 'on going':
      return { bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', dot: 'bg-blue-500' };
    case 'completed':
      return { bg: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400', dot: 'bg-green-500' };
    case 'pending':
    default:
      return { bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400', dot: 'bg-amber-500' };
  }
};

// ================= SUB COMPONENT WORKSPACE =================

function SidebarItem({ icon, label, isActive, onClick, isDark }: any) {
  const activeClass = isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600";
  const inactiveClass = isDark ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900";
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${isActive ? activeClass : inactiveClass}`}>
      <span>{icon}</span>{label}
    </div>
  );
}

function ProjectCard({ task, onClick, onDelete, isDark }: any) {
  const bg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm";
  const textTitle = isDark ? "text-gray-100 group-hover:text-blue-400" : "text-gray-900 group-hover:text-blue-600";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";
  const btnTrash = isDark ? "bg-gray-900 text-gray-600 hover:text-red-400" : "bg-white text-gray-300 hover:text-red-500";
  
  const styles = getStatusStyles(task.status);

  return (
    <motion.div whileHover={{ y: -4 }} onClick={onClick} className={`rounded-2xl p-6 border cursor-pointer flex flex-col h-[260px] transition-all group relative ${bg}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${styles.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />{task.status}
        </div>
        <button onClick={onDelete} className={`transition-colors z-10 ${btnTrash}`}><Trash2 className="w-4 h-4" /></button>
      </div>
      <h3 className={`text-lg font-bold leading-tight mb-2 transition-colors ${textTitle}`}>{task.title}</h3>
      <p className={`text-sm leading-relaxed line-clamp-3 mb-auto ${textSub}`}>{task.desc || "Tidak ada deskripsi."}</p>
      <div className={`mt-6 pt-4 border-t flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium ${isDark ? "border-gray-800 text-gray-500" : "border-gray-100 text-gray-500"}`}>
        <div className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" />{task.date}</div>
        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{task.startTime}</div>
        <div className="flex items-center gap-1.5"><Gamepad2 className="w-3.5 h-3.5" />{task.match}</div>
      </div>
    </motion.div>
  );
}

function CreateModal({ onClose, onSave, isDark }: any) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [match, setMatch] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: Date.now(), title, desc: desc.trim(), date, match, startTime, status: "pending", files: [] });
  };

  const bgModal = isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200 shadow-2xl";
  const bgHeader = isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100";
  const inputClass = isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className={`relative w-full max-w-md rounded-2xl border overflow-hidden ${bgModal}`}>
        <div className={`px-6 py-4 border-b flex justify-between items-center ${bgHeader}`}>
          <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Create New Brief</h2>
          <button onClick={onClose} className={isDark ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-600"}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input required type="text" placeholder="Project Title" value={title} onChange={(e)=>setTitle(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${inputClass}`} />
          <div className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="Target Date (25 May)" value={date} onChange={(e)=>setDate(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${inputClass}`} />
            <input required type="text" placeholder="Match (5 Match)" value={match} onChange={(e)=>setMatch(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${inputClass}`} />
          </div>
          <input required type="text" placeholder="Start Match (19:00 WIB)" value={startTime} onChange={(e)=>setStartTime(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${inputClass}`} />
          <textarea placeholder="Description (Opsional)" rows={3} value={desc} onChange={(e)=>setDesc(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none resize-none ${inputClass}`} />
          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Simpan Project</button>
        </form>
      </motion.div>
    </div>
  );
}

function DetailModal({ task, onClose, onUploadFiles, onUpdateStatus, isDark }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFiles = Array.from(e.target.files).map(file => ({
        name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + " MB", fileData: file 
      }));
      onUploadFiles(uploadedFiles);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerDownload = (fileObj: any) => {
    if (!fileObj.fileData) return;
    const url = URL.createObjectURL(fileObj.fileData);
    const a = document.createElement("a");
    a.href = url; a.download = fileObj.name; 
    document.body.appendChild(a); a.click(); 
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const bgModal = isDark ? "bg-[#111827] border-gray-800" : "bg-[#f7f8fa] border-gray-200";
  const bgHeader = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100";
  const bgCard = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm";
  const bgList = isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100";
  const textTitle = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";
  const dashedBox = isDark ? "border-gray-700 hover:bg-gray-800 hover:border-blue-500" : "border-gray-200 hover:bg-blue-50 hover:border-blue-400";
  const btnDownload = isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700" : "bg-white hover:bg-blue-50 hover:text-blue-600 border-gray-200 text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div onClick={onClose} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${bgModal}`}>
        
        <div className={`px-8 py-6 border-b flex justify-between items-center sticky top-0 z-10 ${bgHeader}`}>
          <div>
            <h2 className={`text-2xl font-bold ${textTitle}`}>{task.title}</h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg border transition-colors ${isDark ? "bg-gray-800 border-gray-700 text-gray-400 hover:text-white" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 py-6 overflow-y-auto">
          <div className={`p-4 rounded-xl border mb-4 flex flex-wrap items-center justify-between gap-4 ${bgCard}`}>
             <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Update Task Status</h5>
                <p className={`text-xs mt-0.5 ${textSub}`}>Klik salah satu tombol dibawah untuk merubah status pengerjaan.</p>
             </div>
             <div className="flex gap-2">
                {["pending", "on going", "completed"].map((st) => {
                   const isActive = task.status?.toLowerCase() === st;
                   return (
                      <button 
                         key={st}
                         onClick={() => onUpdateStatus(st)}
                         className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all flex items-center gap-1 border ${
                            isActive 
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                              : isDark ? "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                         }`}
                      >
                         {isActive && <Check className="w-3.5 h-3.5" />}
                         {st}
                      </button>
                   )
                })}
             </div>
          </div>

          <div className={`p-6 rounded-xl border mb-6 ${bgCard}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Brief Details</h4>
            <p className={`text-sm leading-relaxed ${textTitle}`}>{task.desc || "Tidak ada deskripsi khusus untuk brief ini."}</p>
            <div className={`mt-5 pt-5 border-t flex gap-8 text-sm ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div><span className="text-gray-400 block text-xs mb-1">Target Date</span> <span className={`font-semibold ${textTitle}`}>{task.date}</span></div>
              <div><span className="text-gray-400 block text-xs mb-1">Start Match</span> <span className="font-semibold text-blue-500">{task.startTime}</span></div>
              <div><span className="text-gray-400 block text-xs mb-1">Total Match</span> <span className={`font-semibold ${textTitle}`}>{task.match}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl border ${bgCard}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Upload Design</h4>
              <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${dashedBox}`}>
                <UploadCloud className="w-6 h-6 text-blue-500 mb-2" />
                <p className={`text-sm font-semibold ${textTitle}`}>Click to upload file</p>
                <p className={`text-xs mt-1 ${textSub}`}>Bisa pilih banyak gambar sekaligus</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${bgCard}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Design Files ({task.files ? task.files.length : 0})</h4>
              <div className="space-y-3">
                {task.files && task.files.length > 0 ? task.files.map((file: any, i: number) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${bgList}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <div className="truncate">
                        <p className={`text-sm font-medium truncate ${textTitle}`}>{file.name}</p>
                        <p className="text-xs text-gray-400">{file.size}</p>
                      </div>
                    </div>
                    <button onClick={() => triggerDownload(file)} className={`p-2 rounded-lg border transition-colors shadow-sm shrink-0 ${btnDownload}`}>
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )) : (
                  <div className={`h-24 flex flex-col items-center justify-center border border-dashed rounded-xl ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <p className={`text-sm ${textSub}`}>Belum ada file.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}