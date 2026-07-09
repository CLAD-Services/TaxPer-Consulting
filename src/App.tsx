import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ArrowRight, Calculator, Scale, FileText, 
  CheckCircle, Send, Settings, X, Mail, Phone, MapPin, Briefcase, 
  ChevronRight, ShieldAlert, AlertCircle, BarChart3, Clock, Play, Menu
} from 'lucide-react';
import logoImg from './assets/logo.webp';

// --- TYPES ---
type TabType = 'inicio' | 'nosotros' | 'servicios' | 'blog' | 'contacto';

interface Decree {
  id: number;
  title: string;
  category: 'Tributario' | 'Laboral' | 'Financiero';
  summary: string;
  content: string;
  date: string;
}

interface LeadForm {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
}

// --- INITIAL MOCK DATA ---
const defaultDecrees: Decree[] = [
  {
    id: 1,
    title: 'Resolución de Superintendencia N° 000112-2026/SUNAT',
    category: 'Tributario',
    summary: 'Nuevas disposiciones para la emisión de comprobantes de pago electrónicos y guías de remisión para el sector Pyme.',
    content: 'Esta resolución obliga a las empresas con ingresos anuales superiores a 150 UIT a integrar el nuevo sistema OSE-PE para la validación en tiempo real de comprobantes. El incumplimiento generará multas equivalentes al 50% de la UIT por cada lote no reportado. Se recomienda actualizar los sistemas ERP contables antes del cierre fiscal del presente trimestre.',
    date: new Date().toLocaleDateString('es-PE'),
  },
  {
    id: 2,
    title: 'Decreto Supremo N° 014-2026-TR',
    category: 'Laboral',
    summary: 'Modificatorias al reglamento de la Ley de Productividad y Competitividad Laboral. Impacto en contratos a plazo fijo.',
    content: 'Se restringe la renovación de contratos modales por necesidad de mercado a un máximo de 2 años (anteriormente 5 años). Aquellos contratos que superen este límite se desnaturalizarán automáticamente, pasando los colaboradores a la planilla de plazo indeterminado. Las Pymes deben realizar una auditoría inmediata de sus legajos laborales vigentes.',
    date: new Date(Date.now() - 86400000).toLocaleDateString('es-PE'),
  },
  {
    id: 3,
    title: 'Directiva de Gestión de Activos N° 045-MEF',
    category: 'Financiero',
    summary: 'Actualización de tasas de depreciación acelerada para adquisición de tecnología y maquinaria en MYPES.',
    content: 'Con el objetivo de reactivar la inversión tecnológica, el MEF autoriza una tasa de depreciación anual del 33.3% (anterior 20%) para equipos de procesamiento de datos y software especializado adquiridos durante el presente ejercicio fiscal. Esta medida permite a las Pymes reducir significativamente el Impuesto a la Renta de Tercera Categoría.',
    date: new Date(Date.now() - 172800000).toLocaleDateString('es-PE'),
  }
];

// --- VARIANTS ---
const pageVariants: Variants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.2, ease: 'easeIn' } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// --- SHARED UTILITY CLASSES ---
const btnPrimaryClass = "inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy text-white font-sans font-semibold text-sm tracking-wide uppercase transition-all duration-300 border border-transparent hover:bg-cyan hover:shadow-lg hover:shadow-cyan/30 active:scale-95";
const inputCorpClass = "w-full bg-white border border-slate-300 px-4 py-3 text-sm font-sans focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all text-navy";

// --- CLAD SERVICES FLOATING CARD (Resized & Link Enabled) ---
function CladServicesCard() {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6, type: "spring", bounce: 0.4 }}
      className="fixed bottom-4 left-4 right-4 md:right-auto md:bottom-6 md:left-6 z-[60] bg-[#223a59] rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3 md:gap-4 w-[calc(100vw-2rem)] md:w-auto md:min-w-[380px] border border-white/5"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white ml-0.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-body font-bold text-xs md:text-[14px] leading-snug mb-0.5">
            Previsualización en Vivo<br />por CLAD Services
          </span>
          <span className="text-[#9ab1d1] text-[9px] md:text-[10px] uppercase font-bold leading-tight tracking-[0.05em]">
            SOLUCIONES DIGITALES WEB<br />COORPORATIVA
          </span>
        </div>
      </div>
      <a 
        href="https://wa.me/51925928592?text=Hola%20quiero%20cotizar%20la%20pagina%20TaxPeru%20Consultores" 
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white text-[#223a59] px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-[13px] font-bold hover:bg-gray-100 transition-all shrink-0 font-body shadow-sm hover:scale-105 active:scale-95 text-center inline-block"
      >
        Contratar
      </a>
    </motion.div>
  );
}

// --- SECTIONS ---

const HeroSection = ({ setTab }: { setTab: (t: TabType) => void }) => (
  <motion.section variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-screen flex items-center overflow-hidden">
    <div className="absolute inset-0 editorial-grid opacity-40 pointer-events-none" />
    <div className="absolute right-0 top-0 w-1/2 h-full bg-navy/5 transform skew-x-12 translate-x-32 pointer-events-none" />
    
    <div className="container mx-auto px-6 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-[1px] bg-cyan" />
          <span className="text-navy font-semibold text-xs tracking-[0.2em] uppercase">Firma Consultora B2B</span>
        </div>
        <h1 className="font-serif text-5xl lg:text-7xl text-navy leading-[1.1] mb-8">
          Blindaje Tributario y <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy to-cyan">Gestión Contable</span><br />
          Inteligente.
        </h1>
        <p className="text-navy/70 font-sans text-lg lg:text-xl max-w-lg mb-10 leading-relaxed">
          Estructuramos la solidez fiscal de su empresa. Asesoría corporativa especializada para Pymes en el Perú, garantizando cumplimiento SUNAT y optimización financiera.
        </p>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setTab('contacto')} className={btnPrimaryClass}>
            Agendar Diagnóstico <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <button onClick={() => setTab('servicios')} className="px-8 py-4 bg-transparent border border-navy text-navy font-semibold text-sm tracking-wide uppercase transition-all duration-300 hover:bg-navy hover:text-white">
            Nuestras Prácticas
          </button>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="relative hidden lg:block">
        <div className="aspect-[4/5] bg-navy relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80" 
            alt="Consultoría Financiera" 
            className="object-cover w-full h-full opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:scale-105 transition-all duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 border border-white/20 m-6 pointer-events-none" />
        </div>
        
        <div className="absolute -bottom-10 -left-10 glass-panel p-8 shadow-2xl max-w-xs">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-cyan/10 rounded flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-cyan" />
            </div>
            <div>
              <div className="text-3xl font-serif text-navy leading-none">99.8%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-navy/60 mt-1">Éxito en Auditorías</div>
            </div>
          </div>
          <p className="text-sm text-navy/70 leading-relaxed">
            Nuestros clientes superan fiscalizaciones preventivas de SUNAT sin contingencias patrimoniales.
          </p>
        </div>
      </motion.div>
    </div>
  </motion.section>
);

const AboutSection = () => (
  <motion.section variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="py-32 bg-white relative min-h-screen">
    <div className="container mx-auto px-6 lg:px-12">
      <motion.div variants={itemVariants} className="mb-20">
        <h2 className="font-serif text-4xl lg:text-5xl text-navy mb-6">Autoridad, Ética y <span className="text-cyan">Precisión Legal</span></h2>
        <p className="text-lg text-navy/70 max-w-2xl font-sans leading-relaxed">
          TaxPerú Consultores nace con el propósito de dotar a la Pyme peruana de los mismos estándares de seguridad jurídica e inteligencia contable que utilizan las grandes corporaciones.
        </p>
      </motion.div>
      
      <div className="grid lg:grid-cols-2 gap-16">
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="flex gap-6">
            <div className="w-14 h-14 bg-navy text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-navy mb-3">Cumplimiento Normativo Estricto</h3>
              <p className="text-navy/70 leading-relaxed">
                Nuestra filosofía se basa en el principio de prevención. Diseñamos mallas contables que neutralizan riesgos fiscales antes de que se conviertan en notificaciones de SUNAT o Sunafil.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-14 h-14 bg-navy text-white flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-navy mb-3">Staff de Colegiados Senior</h3>
              <p className="text-navy/70 leading-relaxed">
                No derivamos a practicantes. Cada cuenta es gestionada y auditada por Contadores Públicos Colegiados (CPC) con especializaciones en Tributación y Finanzas Corporativas.
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-slate p-12 border border-slate-200">
          <h3 className="font-serif text-2xl text-navy mb-8">Nuestras Credenciales</h3>
          <ul className="space-y-6">
            {[
              'Más de 15 años de trayectoria en el mercado limeño.',
              'Miembros activos del Colegio de Contadores Públicos de Lima.',
              'Implementación nativa de NIIF (Normas Internacionales de Información Financiera).',
              'Sistemas de encriptación y confidencialidad bajo Ley de Protección de Datos.'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4 text-navy/80 font-sans">
                <CheckCircle className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </motion.section>
);

const ServicesSection = () => (
  <motion.section variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="py-32 bg-slate min-h-screen">
    <div className="container mx-auto px-6 lg:px-12">
      <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="font-serif text-4xl lg:text-5xl text-navy mb-6">Nuestras Prácticas Especializadas</h2>
        <p className="text-navy/70 font-sans text-lg">Soluciones integrales diseñadas para estructurar, proteger y escalar las operaciones financieras de su corporación.</p>
      </motion.div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Calculator,
            title: 'Auditoría Financiera y Contable',
            desc: 'Externalización total (Outsourcing) de su departamento contable. Emisión de Estados Financieros mensuales, conciliaciones bancarias y adopción de NIIF para Pymes.',
            features: ['Contabilidad Mensual Completa', 'Emisión de EE.FF.', 'Auditorías Preventivas']
          },
          {
            icon: FileText,
            title: 'Gestión de Planillas y Laboral',
            desc: 'Administración integral del capital humano. Cálculo de nóminas, CTS, gratificaciones, liquidaciones y representación ante inspecciones de SUNAFIL.',
            features: ['Cálculo de Nóminas y PLAME', 'Contratos Laborales', 'Defensa SUNAFIL']
          },
          {
            icon: Scale,
            title: 'Asesoría Tributaria y Defensa',
            desc: 'Planeamiento fiscal estratégico para maximizar su flujo de caja dentro del marco legal. Asistencia y representación directa en fiscalizaciones y reclamaciones ante SUNAT.',
            features: ['Planeamiento Fiscal', 'Declaraciones Juradas (PDT)', 'Atención de Fiscalizaciones']
          }
        ].map((srv, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white p-10 border border-slate-200 hover:border-cyan transition-colors group">
            <div className="w-16 h-16 bg-slate flex items-center justify-center mb-8 group-hover:bg-cyan group-hover:text-white transition-colors text-navy">
              <srv.icon className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-navy mb-4">{srv.title}</h3>
            <p className="text-navy/70 text-sm leading-relaxed mb-8 h-24">{srv.desc}</p>
            <div className="space-y-3 pt-6 border-t border-slate-100">
              {srv.features.map((f, j) => (
                <div key={j} className="flex items-center text-xs font-semibold text-navy uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan mr-3" />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

const BlogSection = ({ decrees }: { decrees: Decree[] }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.section variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="py-32 bg-white min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="font-serif text-4xl lg:text-5xl text-navy mb-4">Alertas <span className="text-cyan">Normativas</span></h2>
            <p className="text-navy/70 font-sans">Monitoreo constante de disposiciones de SUNAT, MEF y MTPE.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan">
            <AlertCircle className="w-5 h-5" /> Feed Actualizado
          </div>
        </motion.div>
        
        <div className="space-y-6 max-w-4xl">
          <AnimatePresence>
            {decrees.map((decree, i) => (
              <motion.div 
                key={decree.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate border border-slate-200 p-8 flex flex-col md:flex-row gap-8 hover:border-cyan transition-colors"
              >
                <div className="md:w-48 shrink-0 border-r border-slate-300 md:pr-8">
                  <div className="text-xs font-bold uppercase tracking-wider text-navy/50 mb-2 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {decree.date}
                  </div>
                  <div className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${
                    decree.category === 'Tributario' ? 'bg-cyan' : 
                    decree.category === 'Laboral' ? 'bg-emerald' : 'bg-navy'
                  }`}>
                    {decree.category}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl text-navy mb-3">{decree.title}</h3>
                  <p className="text-navy/70 leading-relaxed text-sm">
                    {decree.summary}
                  </p>
                  
                  <button 
                    onClick={() => toggleExpand(decree.id)}
                    className="mt-4 text-cyan font-semibold text-sm uppercase tracking-wider flex items-center hover:text-navy transition-colors focus:outline-none"
                  >
                    {expandedId === decree.id ? 'Ocultar implicancias' : 'Leer implicancias'} 
                    <ChevronRight className={`w-4 h-4 ml-1 transition-transform duration-300 ${expandedId === decree.id ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedId === decree.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-slate-300 text-sm text-navy/80 leading-relaxed font-sans bg-white p-4 rounded-sm border border-slate-200 shadow-inner">
                          <strong className="text-navy block mb-2 font-semibold">Análisis y Recomendación Contable:</strong>
                          {decree.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

const ContactSection = () => {
  const [form, setForm] = useState<LeadForm>({ nombre: '', empresa: '', email: '', telefono: '', servicio: '', mensaje: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ nombre: '', empresa: '', email: '', telefono: '', servicio: '', mensaje: '' });
    }, 6000);
  };

  return (
    <motion.section variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="py-32 bg-navy min-h-screen text-white relative">
      <div className="absolute inset-0 editorial-grid opacity-10 pointer-events-none" />
      <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 relative z-10">
        
        <motion.div variants={itemVariants}>
          <h2 className="font-serif text-4xl lg:text-6xl mb-6">Agende una Sesión de <span className="text-cyan">Diagnóstico.</span></h2>
          <p className="text-white/60 font-sans text-lg mb-12 max-w-md">
            Un especialista asociado evaluará su estructura actual y propondrá un plan de saneamiento o gestión B2B adaptado a su volumen de operaciones.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <MapPin className="w-6 h-6 text-cyan mt-1 shrink-0" />
              <div>
                <h4 className="font-serif text-xl mb-1">Centro Financiero Lince</h4>
                <p className="text-white/50 text-sm">Av. Arequipa 2450, Oficina 402<br/>Lince, Lima, Perú</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Phone className="w-6 h-6 text-cyan mt-1 shrink-0" />
              <div>
                <h4 className="font-serif text-xl mb-1">Línea Directa Comercial</h4>
                <p className="text-white/50 text-sm">+51 1 555-1234<br/>+51 999 888 777</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Mail className="w-6 h-6 text-cyan mt-1 shrink-0" />
              <div>
                <h4 className="font-serif text-xl mb-1">Correo Corporativo</h4>
                <a href="mailto:contacto@taxperu.pe" className="text-white/50 text-sm hover:text-cyan transition-colors">contacto@taxperu.pe</a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-8 lg:p-12 shadow-2xl relative">
          <AnimatePresence>
            {submitted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 text-center border-t-4 border-emerald">
                <CheckCircle className="w-16 h-16 text-emerald mb-6" />
                <h3 className="font-serif text-3xl text-navy mb-4">¡Consulta Recibida!</h3>
                <p className="text-navy/70 text-sm leading-relaxed">
                  Los datos han sido guardados en la sesión y simulados hacia el buzón de <strong className="text-navy">contacto@taxperu.pe</strong>. Un especialista se comunicará a la brevedad.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Nombre Completo *</label>
                <input required type="text" className={inputCorpClass} value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Razón Social / Empresa</label>
                <input type="text" className={inputCorpClass} value={form.empresa} onChange={e => setForm({...form, empresa: e.target.value})} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Email Corporativo *</label>
                <input required type="email" className={inputCorpClass} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Teléfono / Celular *</label>
                <input required type="tel" className={inputCorpClass} value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Requerimiento Principal *</label>
              <select required className={`${inputCorpClass} appearance-none`} value={form.servicio} onChange={e => setForm({...form, servicio: e.target.value})}>
                <option value="" disabled>Seleccione un área de práctica...</option>
                <option value="Auditoría">Auditoría Financiera y Contable</option>
                <option value="Laboral">Gestión de Planillas y Laboral</option>
                <option value="Tributaria">Asesoría Tributaria y Defensa SUNAT</option>
                <option value="Otro">Consulta General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Detalle de su Consulta *</label>
              <textarea required rows={4} className={`${inputCorpClass} resize-none`} value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} />
            </div>
            <button type="submit" className={`${btnPrimaryClass} w-full !bg-cyan hover:!bg-navy`}>
              Enviar Solicitud <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

// --- CMS PANEL COMPONENT ---
const CmsPanel = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (d: Decree) => void }) => {
  const [form, setForm] = useState({ title: '', category: 'Tributario', summary: '', content: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.summary || !form.content) return;
    onAdd({
      id: Date.now(),
      title: form.title,
      category: form.category as 'Tributario' | 'Laboral' | 'Financiero',
      summary: form.summary,
      content: form.content,
      date: new Date().toLocaleDateString('es-PE')
    });
    setForm({ title: '', category: 'Tributario', summary: '', content: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-[90]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white z-[100] border-l border-slate-200 shadow-2xl flex flex-col">
            <div className="p-6 bg-navy text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-cyan" />
                <h3 className="font-serif text-xl tracking-wide">Panel de Control (Demo)</h3>
              </div>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h4 className="font-serif text-xl text-navy mb-2">Publicar Decreto SUNAT</h4>
                <p className="text-xs text-navy/60 font-sans leading-relaxed">
                  Toda la manipulación de datos del protafolio es temporal. Refrescar la pagina (F5) restaurará la base de datos a sus valores iniciales debido a que la pagina es una demostracion.En la pagina de produccion el CMS sera mas extendido pudiendo modificar mas secciones.Ojo:Este panel sera solo visible para el dueño de la pagina.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Título del Decreto *</label>
                  <input required type="text" className={inputCorpClass} placeholder="Ej: Resolución N°..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Categoría *</label>
                  <select className={`${inputCorpClass} appearance-none`} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="Tributario">Tributario</option>
                    <option value="Laboral">Laboral</option>
                    <option value="Financiero">Financiero</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Resumen (Preview) *</label>
                  <textarea required rows={2} className={`${inputCorpClass} resize-none`} placeholder="Breve descripción visible..." value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Implicancias (Contenido Expandible) *</label>
                  <textarea required rows={4} className={`${inputCorpClass} resize-none`} placeholder="Análisis profundo y recomendaciones de la firma..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
                </div>
                <button type="submit" className={`${btnPrimaryClass} w-full !bg-cyan hover:!bg-navy border-none mt-4`}>
                  Publicar en Blog Local
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [decrees, setDecrees] = useState<Decree[]>(defaultDecrees);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddDecree = (decree: Decree) => {
    setDecrees([decree, ...decrees]);
  };

  const navItems: { id: TabType; label: string }[] = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'nosotros', label: 'Quiénes Somos' },
    { id: 'servicios', label: 'Servicios B2B' },
    { id: 'blog', label: 'Blog SUNAT' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate relative">
      {/* HEADER */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/95 backdrop-blur-md border-slate-200 py-4 shadow-sm' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between relative">
          
          {/* Logo Section - Aligned Left (Uses flex-1 for perfect centering of Nav) */}
          <div className="flex flex-1 items-center gap-3 cursor-pointer shrink-0" onClick={() => { setActiveTab('inicio'); setIsMobileMenuOpen(false); }}>
            <div>
              <img src={logoImg} alt="Logo TaxPerú" className="w-12 h-auto" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-serif text-xl leading-none text-navy tracking-wide">TaxPerú</div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-navy/50 mt-1">Consultores</div>
            </div>
          </div>

          {/* Navigation - Perfectly Centered (Desktop) */}
          <nav className="hidden md:flex flex-shrink-0 items-center justify-center gap-8">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative text-sm font-semibold tracking-wide uppercase transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-cyan after:transition-all after:duration-300 hover:after:w-full hover:text-navy ${activeTab === item.id ? 'text-navy after:w-full' : 'text-navy/60 after:w-0'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button & Mobile Toggle - Aligned Right (Uses flex-1 to counter-balance Logo) */}
          <div className="flex flex-1 items-center justify-end gap-4 shrink-0">
            <button onClick={() => setActiveTab('contacto')} className="hidden md:inline-flex px-6 py-2.5 bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-cyan transition-colors">
              Contacto
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden text-navy hover:text-cyan transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-4 mx-6 bg-white border border-slate-200 shadow-2xl flex flex-col p-6 gap-6 md:hidden z-50 rounded-sm"
              >
                {navItems.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={`text-left text-sm font-semibold tracking-wide uppercase transition-colors duration-300 ${activeTab === item.id ? 'text-cyan' : 'text-navy/70 hover:text-navy'}`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => { setActiveTab('contacto'); setIsMobileMenuOpen(false); }} 
                    className="w-full px-6 py-3 bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-cyan transition-colors text-center"
                  >
                    Contacto
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* MAIN CONTENT CONTENT */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'inicio' && <HeroSection key="inicio" setTab={setActiveTab} />}
          {activeTab === 'nosotros' && <AboutSection key="nosotros" />}
          {activeTab === 'servicios' && <ServicesSection key="servicios" />}
          {activeTab === 'blog' && <BlogSection key="blog" decrees={decrees} />}
          {activeTab === 'contacto' && <ContactSection key="contacto" />}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-navy border-t border-white/10 py-12 text-white/50 font-sans text-sm text-center relative z-40">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} TaxPerú Consultores. Firma de Auditoría y Tributación.</p>
          <p className="text-xs mt-2 opacity-50">Sistema DEMO - Todos los datos generados residen en memoria local y son volátiles.</p>
        </div>
      </footer>
      
      {/* CLAD Services Targeta Flotante */}
      <CladServicesCard />

      {/* FLOATING CMS BUTTON - REPOSITIONED TO TOP RIGHT */}
      <button 
        onClick={() => setIsCmsOpen(true)}
        className="fixed top-28 right-6 z-40 bg-navy text-white flex items-center gap-3 px-5 py-3 shadow-2xl border border-cyan/30 hover:bg-cyan transition-colors rounded"
      >
        <Settings className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider hidden md:inline-block">Panel (Demo)</span>
      </button>

      {/* CMS LATERAL PANEL */}
      <CmsPanel isOpen={isCmsOpen} onClose={() => setIsCmsOpen(false)} onAdd={handleAddDecree} />
    </div>
  );
}