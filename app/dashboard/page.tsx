"use client";

import { useState, useRef } from "react";
import { 
  FolderKanban, Calendar as CalendarIcon, 
  Settings, Plus, Search, MoreHorizontal, 
  FileVideo, UploadCloud, Download, CheckCircle2, X,
  Clock, Trash2, User, Gamepad2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleAddBrief = (newTask: any) => {
    setTasks([newTask, ...tasks]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteTask = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  // FUNGSI UPDATE: Sekarang menyimpan objek file asli agar bisa didownload beneran
  const handleUploadFiles = (taskId: number, newFiles: any[]) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, files: [...t.files, ...newFiles] } : t
    ));
    setSelectedTask((prev: any) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f7f8fa] text-[#111827] overflow-hidden antialiased">
      
      {/* --- SIDEBAR KIRI --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <FileVideo className="w-3.5 h-3.5 text-white" />
            </div>
            StreamDesk
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
          <SidebarItem icon={<FolderKanban className="w-4 h-4" />} label="Projects" isActive={activeTab === "projects"} onClick={() => setActiveTab("projects")} />
          <SidebarItem icon={<CalendarIcon className="w-4 h-4" />} label="Schedule" isActive={activeTab === "schedule"} onClick={() => setActiveTab("schedule")} />
          <div className="pt-6">
            <SidebarItem icon={<Settings className="w-4 h-4" />} label="Settings" isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
          </div>
        </nav>
      </aside>

      {/* --- KONTEN KANAN UTAMA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {activeTab === "projects" && (
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search briefs..." 
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-72"
              />
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
              <Plus className="w-4 h-4" /> New Brief
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto p-8 w-full">
          {activeTab === "projects" && (
            <div className="w-full">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Active Projects</h1>
                <p className="text-gray-500 text-sm mt-1">Kelola kebutuhan desain overlay dan turnamen kamu di sini.</p>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <FolderKanban className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Belum ada Brief</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Klik tombol New Brief untuk memulai project baru.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full">
                  {filteredTasks.map((task) => (
                    <ProjectCard key={task.id} task={task} onClick={() => setSelectedTask(task)} onDelete={(e) => handleDeleteTask(task.id, e)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Upcoming Schedule</h1>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center text-gray-500 text-sm">
                Jadwal turnamen otomatis sinkron dari brief yang kamu buat.
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Settings</h1>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">A</div>
                <div>
                  <h3 className="font-bold text-gray-900">Awen (Admin)</h3>
                  <p className="text-sm text-gray-500">awen@streamdesk.com</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL DIALOG --- */}
      <AnimatePresence>
        {isCreateModalOpen && <CreateModal onClose={() => setIsCreateModalOpen(false)} onSave={handleAddBrief} />}
        {selectedTask && (
          <DetailModal 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
            onUploadFiles={(files) => handleUploadFiles(selectedTask.id, files)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

function SidebarItem({ icon, label, isActive, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
      <span>{icon}</span>{label}
    </div>
  );
}

function ProjectCard({ task, onClick, onDelete }: { task: any, onClick: () => void, onDelete: (e:any) => void }) {
  return (
    <motion.div whileHover={{ y: -4 }} onClick={onClick} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm cursor-pointer flex flex-col h-[260px] transition-all group relative">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${task.statusColor}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${task.dotColor}`} />{task.status}
        </div>
        <button onClick={onDelete} className="text-gray-300 hover:text-red-500 transition-colors bg-white"><Trash2 className="w-4 h-4" /></button>
      </div>
      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{task.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-auto">{task.desc || "Tidak ada deskripsi."}</p>
      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-gray-500">
        <div className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-gray-400" />{task.date}</div>
        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" />{task.startTime}</div>
        <div className="flex items-center gap-1.5"><Gamepad2 className="w-3.5 h-3.5 text-gray-400" />{task.match}</div>
      </div>
    </motion.div>
  );
}

function CreateModal({ onClose, onSave }: any) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [match, setMatch] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      title, desc: desc.trim(), date, match, startTime,
      status: "Todo", statusColor: "bg-gray-100 text-gray-600", dotColor: "bg-gray-400",
      files: []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Create New Brief</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input required type="text" placeholder="Project Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
          <div className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="Target Date (e.g., 10 Jun)" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            <input required type="text" placeholder="Total Match (e.g., 5 Match)" value={match} onChange={(e)=>setMatch(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <input required type="text" placeholder="Start Match (e.g., 19:00 WIB)" value={startTime} onChange={(e)=>setStartTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
          <textarea placeholder="Description (Opsional)" rows={3} value={desc} onChange={(e)=>setDesc(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Simpan Project</button>
        </form>
      </motion.div>
    </div>
  );
}

// --- MODAL DETAIL DENGAN FITUR REAL DOWNLOAD ---
function DetailModal({ task, onClose, onUploadFiles }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        fileData: file // KUNCI: Menyimpan file asli mentah di memori browser
      }));
      onUploadFiles(uploadedFiles);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // KUNCI UTAMA: Fungsi pengunduhan gambar asli secara real-time
  const triggerDownload = (fileObj: any) => {
    if (!fileObj.fileData) return;
    
    // Membuat link download bayangan di background
    const url = URL.createObjectURL(fileObj.fileData);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileObj.name; // Nama file pas ke-download
    document.body.appendChild(a);
    a.click(); // Otomatis ngeklik link-nya
    
    // Bersihkan memori agar browser laptop kamu nggak lemot
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div onClick={onClose} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200">
        
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500 border border-gray-200"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-8 py-6 overflow-y-auto bg-[#f7f8fa]">
          <div className="mb-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Brief Details</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{task.desc || "Tidak ada deskripsi khusus untuk brief ini."}</p>
            <div className="mt-5 pt-5 border-t border-gray-100 flex gap-8 text-sm">
              <div><span className="text-gray-400 block text-xs mb-1">Target Date</span> <span className="font-semibold text-gray-900">{task.date}</span></div>
              <div><span className="text-gray-400 block text-xs mb-1">Start Match</span> <span className="font-semibold text-gray-900 text-blue-600">{task.startTime}</span></div>
              <div><span className="text-gray-400 block text-xs mb-1">Total Match</span> <span className="font-semibold text-gray-900">{task.match}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Upload Design</h4>
              <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer">
                <UploadCloud className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm font-semibold text-gray-900">Click to upload file</p>
                <p className="text-xs text-gray-500 mt-1">Bisa pilih banyak file gambar</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Design Files ({task.files.length})</h4>
              <div className="space-y-3">
                {task.files.length > 0 ? task.files.map((file: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    {/* TRIGGER DOWNLOAD REAL: Memanggil fungsi download asli saat diklik */}
                    <button onClick={() => triggerDownload(file)} className="bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 text-gray-700 p-2 rounded-lg transition-colors shadow-sm shrink-0">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )) : (
                  <div className="h-24 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm text-gray-400">Belum ada file.</p>
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