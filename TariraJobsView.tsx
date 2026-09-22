import React, { useState, useMemo, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Filter, 
  GraduationCap, 
  HardHat, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle, 
  LogIn, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { TariraJobApplicationModal, JobVacancy } from './TariraJobApplicationModal';

export interface TariraJobsViewProps {
  currentLang: 'pt' | 'en';
  onNavigateToApply: (type: 'spontaneous' | 'technician') => void;
  onOpenCommercialModal: () => void;
  onNavigateToFaqs: () => void;
  onOpenAuthModal?: (mode: 'signin' | 'signup', reason?: string, initialRole?: any) => void;
  candidateProfile?: any;
  onNavigateToProfile?: () => void;
}

const MOZAMBIQUE_PROVINCES = [
  'Todas as Províncias',
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa',
  'Remoto'
];

const JOB_VACANCIES: JobVacancy[] = [
  {
    id: 'tech-dev',
    title: 'Engenharia de Software, Cloud & DevOps',
    category: 'quadros',
    department: 'Tecnologia & Sistemas de Informação',
    location: 'Maputo Cidade / Híbrido',
    province: 'Maputo Cidade',
    type: 'Tempo Inteiro',
    contractDuration: 'Contrato 12 Meses (Renovável)',
    status: 'sourcing',
    statusLabel: 'Sourcing Ativo & Shortlist',
    summary: 'Triagem e credenciação de desenvolvedores Full-stack (React, Node, TypeScript), engenheiros de dados e administradores de sistemas cloud para projetos bancários e corporativos.',
    requirements: ['Formação superior em TI ou experiência comprovada', 'Domínio de JavaScript/TypeScript, SQL e Git', 'Capacidade de resolução autónoma de problemas'],
    expectedOpenings: '3 - 5 vagas corporativas'
  },
  {
    id: 'tech-clima',
    title: 'Técnico de Climatização, Refrigeração & AVAC',
    category: 'oficios',
    department: 'Manutenção Técnica Predial & Industrial',
    location: 'Maputo Cidade e Matola',
    province: 'Maputo Província',
    type: 'Contrato Técnico (> 3 Meses)',
    contractDuration: 'Contrato Técnico 12 Meses',
    isLongTermTechnicalContract: true,
    status: 'sourcing',
    statusLabel: 'Triagem Ativa Connect',
    summary: 'Homologação técnica de especialistas em instalação, manutenção preventiva e reparação de centrais de ar condicionado, câmaras frigoríficas e sistemas de ventilação para contratos anuais.',
    requirements: ['Certificação profissional ou carteira técnica', 'Mínimo de 2 anos de prática em campo', 'Conhecimentos de segurança no trabalho e normas de gás'],
    expectedOpenings: 'Alocação contínua em contratos corporativos'
  },
  {
    id: 'finance-audit',
    title: 'Contabilidade, Auditoria & Finanças Corporativas',
    category: 'quadros',
    department: 'Finanças & Conformidade Fiscal',
    location: 'Maputo Cidade (Presencial)',
    province: 'Maputo Cidade',
    type: 'Tempo Inteiro',
    contractDuration: 'Contrato Permanente',
    status: 'screening',
    statusLabel: 'Homologação de Quadros',
    summary: 'Pré-seleção de contabilistas certificados e analistas financeiros para empresas de logística, retalho e consultoria com conhecimento das normas moçambicanas (PGC-NIRF).',
    requirements: ['Licenciatura em Contabilidade, Gestão ou Auditoria', 'Inscrição na OCAM ou experiência sólida comprovada', 'Domínio de softwares Primavera / SAP'],
    expectedOpenings: '2 - 4 posições corporativas'
  },
  {
    id: 'elec-industrial',
    title: 'Eletricista Industrial de Baixa e Média Tensão',
    category: 'oficios',
    department: 'Eletrotecnia & Redes Elétricas',
    location: 'Maputo Cidade, Matola e Beira',
    province: 'Maputo Província',
    type: 'Contrato Técnico (> 3 Meses)',
    contractDuration: 'Contrato Técnico 6 Meses (Renovável)',
    isLongTermTechnicalContract: true,
    status: 'sourcing',
    statusLabel: 'Sourcing Ativo Connect',
    summary: 'Alocação de técnicos credenciados para montagem e manutenção contínua de quadros elétricos, grupos geradores, inversores solares e sistemas de condomínios e indústrias.',
    requirements: ['Curso profissional (IFPELAC ou equivalente)', 'Capacidade de leitura de diagramas elétricos', 'Rigor em segurança e EPI'],
    expectedOpenings: 'Contratos técnicos contínuos em condomínios'
  },
  {
    id: 'ops-logistics',
    title: 'Gestão de Logística, Armazém & Suprimentos',
    category: 'quadros',
    department: 'Operações & Supply Chain',
    location: 'Sofala (Beira) e Nacala',
    province: 'Sofala',
    type: 'Tempo Inteiro',
    contractDuration: 'Contrato 12 Meses',
    status: 'screening',
    statusLabel: 'Triagem em Curso',
    summary: 'Seleção prévia de gestores de stock, coordenadores de despacho aduaneiro e supervisores de distribuição para operadoras logísticas da região centro.',
    requirements: ['Experiência em controlo de inventário e WMS', 'Conhecimento de procedimentos aduaneiros e frete', 'Liderança de equipas de armazém'],
    expectedOpenings: 'Pré-requisitos de empresas parceiras'
  },
  {
    id: 'civil-plumbing',
    title: 'Canalizador Industrial & Manutenção Hidráulica Predial',
    category: 'oficios',
    department: 'Infraestruturas & Manutenção de Edifícios',
    location: 'Maputo Cidade e Matola',
    province: 'Maputo Cidade',
    type: 'Contrato Técnico (> 3 Meses)',
    contractDuration: 'Contrato Técnico 6 Meses',
    isLongTermTechnicalContract: true,
    status: 'upcoming',
    statusLabel: 'Abertura Iminente',
    summary: 'Cadastro e validação técnica de canalizadores industriais e técnicos prediais para contratos de manutenção permanente em complexos empresariais e residenciais.',
    requirements: ['Experiência comprovada em canalização predial e esgotos', 'Disponibilidade para turnos técnicos', 'Boas referências em obras anteriores'],
    expectedOpenings: 'Equipas contratadas com garantia Tarira Connect'
  },
  {
    id: 'commercial-b2b',
    title: 'Comercial B2B, Vendas & Gestão de Contas',
    category: 'quadros',
    department: 'Desenvolvimento Comercial',
    location: 'Maputo Cidade',
    province: 'Maputo Cidade',
    type: 'Tempo Inteiro',
    contractDuration: 'Tempo Inteiro + Comissões',
    status: 'sourcing',
    statusLabel: 'Sourcing Ativo',
    summary: 'Talentos focados em negociação executiva, prospeção empresarial e retenção de contas B2B com carteira de contactos estabelecida no mercado moçambicano.',
    requirements: ['Excelência em comunicação oral e escrita em português', 'Orientação rigorosa para metas e KPIs', 'Perfil dinâmico e proativo'],
    expectedOpenings: '3 posições abertas para parceiros'
  },
  {
    id: 'hr-talent',
    title: 'Recursos Humanos, R&S & Administração de Pessoal',
    category: 'quadros',
    department: 'Gestão de Pessoas (People & Culture)',
    location: 'Maputo Província (Matola) / Híbrido',
    province: 'Maputo Província',
    type: 'Tempo Inteiro',
    contractDuration: 'Contrato 12 Meses',
    status: 'upcoming',
    statusLabel: 'Brevemente',
    summary: 'Técnicos e coordenadores de RH especializados na Lei do Trabalho de Moçambique, processamento salarial, INSS, IRPS e triagem comportamental.',
    requirements: ['Licenciatura em RH, Psicologia Organizacional ou Direito', 'Domínio da legislação laboral moçambicana', 'Experiência em plataformas de ATS e gestão de pessoal'],
    expectedOpenings: 'Integração em regime de Outsourcing'
  },
  {
    id: 'solar-renewable',
    title: 'Técnico de Energia Solar Fotovoltaica & Inversores',
    category: 'oficios',
    department: 'Energias Renováveis & Eletricidade',
    location: 'Inhambane e Gaza',
    province: 'Inhambane',
    type: 'Contrato Técnico (> 3 Meses)',
    contractDuration: 'Contrato Técnico 6 Meses',
    isLongTermTechnicalContract: true,
    status: 'sourcing',
    statusLabel: 'Sourcing Ativo Connect',
    summary: 'Manutenção programada e monitorização contínua de centrais solares híbridas, bancos de baterias de lítio e sistemas de bombeamento solar em resorts e fazendas.',
    requirements: ['Curso de eletrotécnica ou energia solar', 'Experiência prática com inversores Victron / Growatt', 'Disponibilidade para trabalhar na província de Inhambane'],
    expectedOpenings: 'Contratos técnicos sazonais e de longa duração'
  },
  {
    id: 'eng-civil-nampula',
    title: 'Engenheiro Civil & Gestor de Obras Prediais',
    category: 'quadros',
    department: 'Engenharia & Gestão de Projetos',
    location: 'Nampula (Cidade)',
    province: 'Nampula',
    type: 'Tempo Inteiro',
    contractDuration: 'Contrato 18 Meses',
    status: 'screening',
    statusLabel: 'Homologação de Quadros',
    summary: 'Supervisão técnica de projetos de edificação, fiscalização de empreiteiros, medições de obra e controlo de qualidade de materiais no corredor norte.',
    requirements: ['Licenciatura em Engenharia Civil (inscrito na Ordem)', 'Mínimo de 3 anos em fiscalização de obras', 'Domínio de AutoCAD, MS Project e Excel'],
    expectedOpenings: '2 posições para consórcio empresarial'
  },
  {
    id: 'electromech-tete',
    title: 'Eletromecânico de Equipamentos Industriais & Bombas',
    category: 'oficios',
    department: 'Mecânica Industrial & Minas',
    location: 'Tete (Moatize / Cidade)',
    province: 'Tete',
    type: 'Contrato Técnico (> 3 Meses)',
    contractDuration: 'Contrato Técnico 12 Meses',
    isLongTermTechnicalContract: true,
    status: 'sourcing',
    statusLabel: 'Triagem Ativa Connect',
    summary: 'Operação e manutenção corretiva/preventiva de motores elétricos pesados, bombas submersíveis, compressores e sistemas hidráulicos industriais.',
    requirements: ['Certificado técnico de Eletromecânico ou Mecânica Geral', 'Experiência em ambientes industriais exigentes', 'Respeito absoluto pelas normas de segurança'],
    expectedOpenings: 'Alocação em regime contínuo'
  },
  {
    id: 'agri-manica',
    title: 'Gestor de Operações Agroindustriais & Suprimentos',
    category: 'quadros',
    department: 'Agronegócio & Cadeia de Valor',
    location: 'Manica (Chimoio)',
    province: 'Manica',
    type: 'Tempo Inteiro',
    contractDuration: 'Tempo Inteiro',
    status: 'upcoming',
    statusLabel: 'Abertura Iminente',
    summary: 'Coordenação operacional de unidades de processamento agrícola, planeamento de colheitas, controlo de cadeia de frio e ligação com produtores associados.',
    requirements: ['Formação em Agronomia, Gestão Agrícola ou Engenharia Agroindustrial', 'Experiência em gestão de equipas rurais', 'Carta de condução válida'],
    expectedOpenings: 'Empresa líder do setor agroindustrial'
  },
  {
    id: 'cctv-automation',
    title: 'Técnico de Automação Predial, Controlo de Acesso & CCTV',
    category: 'oficios',
    department: 'Telecomunicações & Segurança Eletrónica',
    location: 'Maputo Cidade',
    province: 'Maputo Cidade',
    type: 'Contrato Técnico (> 3 Meses)',
    contractDuration: 'Contrato Técnico 12 Meses',
    isLongTermTechnicalContract: true,
    status: 'sourcing',
    statusLabel: 'Sourcing Ativo Connect',
    summary: 'Instalação e manutenção de sistemas de segurança eletrónica, videovigilância IP, cancelas automáticas, interfonia e redes estruturadas em condomínios corporativos.',
    requirements: ['Conhecimento prático em redes TCP/IP e câmaras IP', 'Experiência em motores de portão e controlo de acessos', 'Perfil de rigor e confidencialidade'],
    expectedOpenings: 'Contratos anuais de assistência predial'
  },
  {
    id: 'hse-oil-gas',
    title: 'Supervisor de Saúde, Segurança & Ambiente (HSE)',
    category: 'quadros',
    department: 'Qualidade, Segurança & Ambiente (QHSE)',
    location: 'Cabo Delgado (Pemba)',
    province: 'Cabo Delgado',
    type: 'Tempo Inteiro',
    contractDuration: 'Contrato 12 Meses (Renovável)',
    status: 'screening',
    statusLabel: 'Triagem em Curso',
    summary: 'Auditoria e implementação de planos de segurança ocupacional, análise de riscos industriais e formação em conformidade com as normas ISO e legislação moçambicana.',
    requirements: ['Certificação NEBOSH ou IOSH comprovada', 'Experiência prévia em setores industriais ou portuários', 'Inglês e Português fluentes'],
    expectedOpenings: '2 posições executivas'
  },
  {
    id: 'painter-waterproof',
    title: 'Técnico de Pintura Predial, Isolamento & Impermeabilização',
    category: 'oficios',
    department: 'Manutenção Estrutural & Acabamentos',
    location: 'Gaza (Xai-Xai / Bilene)',
    province: 'Gaza',
    type: 'Contrato Técnico (> 3 Meses)',
    contractDuration: 'Contrato Técnico 3 Meses (Renováveis)',
    isLongTermTechnicalContract: true,
    status: 'sourcing',
    statusLabel: 'Sourcing Ativo Connect',
    summary: 'Trabalhos estruturados de impermeabilização de terraços, coberturas, tratamento de fissuras e pintura protetiva contra salinidade em complexos residenciais costeiros.',
    requirements: ['Mínimo de 3 anos de prática com membranas e resinas', 'Conhecimento de tintas anti-fungos e epóxi', 'Capacidade de trabalho em altura com andaimes'],
    expectedOpenings: 'Equipas dedicadas para contratos plurimensais'
  },
  {
    id: 'procurement-zambezia',
    title: 'Coordenador de Compras, Procurement & Contratos',
    category: 'quadros',
    department: 'Compras & Contratação Pública/Privada',
    location: 'Zambézia (Quelimane)',
    province: 'Zambézia',
    type: 'Tempo Inteiro',
    contractDuration: 'Contrato 12 Meses',
    status: 'upcoming',
    statusLabel: 'Brevemente',
    summary: 'Gestão de processos de cotação, seleção de fornecedores, negociação de prazos e elaboração de contratos de fornecimento para projetos de desenvolvimento regional.',
    requirements: ['Licenciatura em Gestão, Economia ou Direito', 'Experiência em procurement corporativo ou institucional', 'Elevada ética e transparência'],
    expectedOpenings: 'Vaga para organização internacional parceira'
  },
  {
    id: 'mech-fleets-niassa',
    title: 'Mecânico de Frotas Pesadas & Grupos Geradores',
    category: 'oficios',
    department: 'Mecânica Automóvel & Geradores',
    location: 'Niassa (Lichinga)',
    province: 'Niassa',
    type: 'Contrato Técnico (> 3 Meses)',
    contractDuration: 'Contrato Técnico 6 Meses',
    isLongTermTechnicalContract: true,
    status: 'sourcing',
    statusLabel: 'Triagem Ativa Connect',
    summary: 'Diagnóstico e reparação contínua de motores a diesel, geradores industriais de emergência e camiões de carga afretados a empreendimentos florestais.',
    requirements: ['Carteira profissional de mecânica a diesel', 'Diagnóstico eletrónico e mecânico de motores Perkins/Cummins', 'Disponibilidade para residir em Lichinga'],
    expectedOpenings: 'Contrato formal com alojamento assegurado'
  },
  {
    id: 'cyber-remote',
    title: 'Especialista em Cibersegurança & Conformidade de Dados',
    category: 'quadros',
    department: 'Cibersegurança & Risco Tecnológico',
    location: 'Remoto / Todo o País',
    province: 'Remoto',
    type: 'Tempo Inteiro',
    contractDuration: 'Tempo Inteiro (Remoto)',
    status: 'sourcing',
    statusLabel: 'Sourcing Ativo',
    summary: 'Monitorização de alertas de segurança, testes de vulnerabilidade, conformidade com a Lei de Proteção de Dados e resposta a incidentes para clientes bancários e governamentais.',
    requirements: ['Certificações relevantes (CompTIA Security+, CEH ou CISSP)', 'Conhecimento prático de firewalls, SIEM e SOC', 'Excelente capacidade de documentação técnica'],
    expectedOpenings: '2 vagas para o Centro de Cibersegurança'
  }
];

const ITEMS_PER_PAGE = 10;

export const TariraJobsView: React.FC<TariraJobsViewProps> = ({
  currentLang,
  onNavigateToApply,
  onOpenCommercialModal,
  onNavigateToFaqs,
  onOpenAuthModal,
  candidateProfile,
  onNavigateToProfile
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'quadros' | 'oficios'>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas as Províncias');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State for Direct Application
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobVacancy | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Resume Pending Application state from LocalStorage
  const [pendingJob, setPendingJob] = useState<any | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tarira_pending_job_application');
      if (stored) {
        setPendingJob(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedProvince, searchQuery]);

  const filteredAreas = useMemo(() => {
    return JOB_VACANCIES.filter((area) => {
      // 1. Category Filter
      const matchesCategory = selectedCategory === 'all' || area.category === selectedCategory;
      
      // 2. Province Filter
      const matchesProvince = 
        selectedProvince === 'Todas as Províncias' || 
        area.province === selectedProvince ||
        (selectedProvince === 'Maputo Província' && area.location.toLowerCase().includes('matola')) ||
        (selectedProvince === 'Remoto' && (area.province === 'Remoto' || area.location.toLowerCase().includes('remoto')));

      // 3. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        area.title.toLowerCase().includes(q) || 
        area.department.toLowerCase().includes(q) || 
        area.location.toLowerCase().includes(q) ||
        area.summary.toLowerCase().includes(q) ||
        area.requirements.some(r => r.toLowerCase().includes(q));

      return matchesCategory && matchesProvince && matchesSearch;
    });
  }, [selectedCategory, selectedProvince, searchQuery]);

  // Pagination Math
  const totalPages = Math.ceil(filteredAreas.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredAreas.length);
  const paginatedAreas = useMemo(() => {
    return filteredAreas.slice(startIndex, endIndex);
  }, [filteredAreas, startIndex, endIndex]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const catalogElement = document.getElementById('catalog-section-top');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenApplicationModal = (job: JobVacancy) => {
    setSelectedJobForModal(job);
    setIsApplicationModalOpen(true);

    // Save as active pending application so user can continue from profile if interrupted
    try {
      localStorage.setItem('tarira_pending_job_application', JSON.stringify({
        id: job.id,
        title: job.title,
        category: job.category,
        department: job.department,
        location: job.location,
        province: job.province,
        type: job.type,
        timestamp: Date.now()
      }));
      setPendingJob(job);
    } catch (e) {
      // ignore
    }
  };

  const handleApplicationSuccess = (application: any) => {
    setSuccessToast(`Candidatura submetida com sucesso para "${application.jobTitle}"!`);
    setPendingJob(null);
    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 min-h-screen">
      {/* Success Notification Banner */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-down border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
          <div className="flex-1 text-xs font-bold leading-snug">
            {successToast}
          </div>
          <button 
            onClick={() => setSuccessToast(null)}
            className="text-white/80 hover:text-white p-1 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header Hero Section */}
      <section className="bg-gradient-to-b from-[#172554] via-[#1e3a8a] to-[#172554] text-white px-4 sm:px-6 py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 space-y-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-400/15 border border-blue-300/30 text-blue-200 text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              Portal Oficial de Vagas & Oportunidades
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {filteredAreas.length} Processos Ativos
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight leading-tight text-white !text-white">
              Vagas, Carreiras & Contratos Estruturados
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              A <strong>TARIRA</strong> disponibiliza processos de recrutamento executivo e quadros corporativos (Recruit), bem como <strong>contratos técnicos de curta, média e longa duração</strong> para manutenção predial e industrial (Connect).
            </p>

            {/* Quick Action Navigation Bar in Hero */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={onNavigateToFaqs}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white !text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                title="Consultar Perguntas Frequentes (FAQs)"
              >
                <HelpCircle className="w-4 h-4 text-white !text-white" />
                <span className="text-white !text-white font-extrabold">Perguntas Frequentes (FAQs)</span>
                <ArrowRight className="w-3.5 h-3.5 text-white !text-white" />
              </button>

              {onOpenAuthModal && (
                <>
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal('signin')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white !text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
                    title="Abrir Modal de Início de Sessão (Entrar)"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white !text-white" />
                    <span className="text-white !text-white font-bold">Entrar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAuthModal('signup')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#172554] hover:bg-blue-50 font-black text-xs transition-all cursor-pointer shadow-md active:scale-95 border border-white"
                    title="Abrir Modal para Criar Nova Conta"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#172554] stroke-[2.5]" />
                    <span className="text-[#172554] font-black">Criar Conta</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Pending Application Alert Banner if user started an application */}
          {pendingJob && (
            <div className="p-4 rounded-2xl bg-blue-500/20 backdrop-blur-md border border-blue-300/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-4xl shadow-lg">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-blue-400/30 flex items-center justify-center text-white shrink-0">
                  <Briefcase className="w-5 h-5 text-blue-200" />
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Tem uma candidatura em curso: {pendingJob.title}
                  </h4>
                  <p className="text-[11px] text-blue-100">
                    O seu perfil já foi identificado. Pode continuar e submeter os seus dados a esta vaga.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const targetJob = JOB_VACANCIES.find(j => j.id === pendingJob.id) || pendingJob;
                  handleOpenApplicationModal(targetJob);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-[#172554] hover:bg-blue-50 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Continuar Candidatura
              </button>
            </div>
          )}

          {/* Distinction Banner: Connect (> 3 meses) vs Recruit */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-4xl shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-400/20 border border-blue-300/30 text-blue-200 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Regimes Contratuais Distintos & Sem Mistura</span>
                </h4>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  <strong>Técnicos de Ofício (Connect):</strong> Vagas para contratos superiores a 3 meses em condomínios e indústrias (não são chamadas avulsas).<br/>
                  <strong>Talentos e Quadros (Recruit):</strong> Vagas corporativas e posições executivas permanentes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => onNavigateToApply('spontaneous')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-[#172554] hover:bg-blue-50 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-[#172554]" />
                <span>Registar no Banco</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Catalog Section with Province Filter & Pagination */}
      <section id="catalog-section-top" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        
        {/* Filters Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#172554]" />
              <span className="text-xs font-mono font-bold uppercase text-blue-800 tracking-wider">Oportunidades em Aberto</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Vagas Abertas & Sourcing em Moçambique
            </h2>
            <p className="text-xs text-slate-500">
              Apresentando <strong>{filteredAreas.length}</strong> vagas disponíveis. Navegue pelos filtros por província e tipo de carreira.
            </p>
          </div>

          {/* Category Tabs: Todas | Talentos e Quadros | Técnicos de Ofício */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#172554] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas as Vagas ({JOB_VACANCIES.length})
            </button>
            <button
              onClick={() => setSelectedCategory('quadros')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'quadros'
                  ? 'bg-white text-[#172554] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Talentos & Quadros</span>
            </button>
            <button
              onClick={() => setSelectedCategory('oficios')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'oficios'
                  ? 'bg-white text-[#172554] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Técnicos de Ofício (&gt; 3 Meses)</span>
            </button>
          </div>
        </div>

        {/* Search Bar + Province Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por cargo, especialidade ou palavra-chave (ex: eletricista, contabilidade, React, Beira)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
            />
          </div>

          {/* 🌟 FILTRO POR PROVÍNCIA EXIGIDO PELO UTILIZADOR */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-blue-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs cursor-pointer appearance-none"
            >
              {MOZAMBIQUE_PROVINCES.map((prov) => (
                <option key={prov} value={prov}>
                  {prov === 'Todas as Províncias' ? '📍 Todas as Províncias' : `📍 ${prov}`}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Active Filters Summary & Results Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span>A mostrar</span>
            <strong className="text-slate-800">
              {filteredAreas.length > 0 ? `${startIndex + 1}–${endIndex}` : '0'}
            </strong>
            <span>de</span>
            <strong className="text-slate-800">{filteredAreas.length}</strong>
            <span>vagas encontradas</span>
            {selectedProvince !== 'Todas as Províncias' && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-mono text-[10px] font-bold">
                Província: {selectedProvince}
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-mono text-[10px] font-bold">
                {selectedCategory === 'quadros' ? 'Talentos & Quadros' : 'Técnicos (> 3 Meses)'}
              </span>
            )}
          </div>

          {(selectedProvince !== 'Todas as Províncias' || selectedCategory !== 'all' || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSelectedProvince('Todas as Províncias');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>

        {/* 🌟 Grid of Max 10 Vacancies (GESTÃO DE ESPAÇO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {paginatedAreas.map((area) => {
            const isConnect = area.category === 'oficios';

            return (
              <div
                key={area.id}
                className="bg-white border border-blue-100/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#172554] border border-blue-200 uppercase inline-block">
                          {area.department}
                        </span>

                        {/* 🌟 BADGE EXPLÍCITO DE CONTRATO TÉCNICO > 3 MESES PARA CONNECT */}
                        {isConnect ? (
                          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs uppercase tracking-wider inline-flex items-center gap-1">
                            <HardHat className="w-3 h-3 text-white" />
                            Contrato Técnico (&gt; 3 Meses)
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#172554] border border-blue-200 uppercase inline-flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-[#172554]" />
                            Tarira Recruit
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {area.title}
                      </h3>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      area.status === 'sourcing' 
                        ? 'bg-blue-50 text-[#172554] border-blue-300'
                        : area.status === 'screening'
                        ? 'bg-blue-50 text-[#172554] border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {area.statusLabel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {area.summary}
                  </p>

                  {/* Informational banner if Connect to prevent confusion with emergency dispatch */}
                  {isConnect && (
                    <div className="p-2 rounded-xl bg-blue-50/80 border border-blue-200/60 text-[11px] text-[#172554] flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>
                        <strong>Regime Contratual:</strong> Alocação continuada (&gt; 3 meses). Não é serviço pontual.
                      </span>
                    </div>
                  )}

                  {/* Location, Province and contract duration */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-700" />
                      <strong>{area.province || 'Moçambique'}:</strong> {area.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {area.contractDuration || area.type}
                    </span>
                  </div>

                  {/* Requirements Checklist */}
                  <div className="p-3 bg-blue-50/40 rounded-2xl border border-blue-100/80 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-blue-900 uppercase tracking-wider block">
                      Critérios de Triagem & Homologação
                    </span>
                    <ul className="space-y-1">
                      {area.requirements.map((req, i) => (
                        <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-blue-600 mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="pt-3 border-t border-blue-100/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {area.expectedOpenings}
                  </span>

                  {/* 🌟 BOTAO DE CANDIDATURA DIRETA QUE ABRE O MODAL DEDICADO */}
                  <button
                    onClick={() => handleOpenApplicationModal(area)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <span>Candidatar a esta Vaga</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAreas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#172554] flex items-center justify-center mx-auto text-xl font-bold">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Nenhuma vaga encontrada para os filtros selecionados
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Não foram encontradas vagas para a província «{selectedProvince}» na categoria selecionada. Experimente limpar os filtros ou submeter uma candidatura espontânea.
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  setSelectedProvince('Todas as Províncias');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Limpar Todos os Filtros
              </button>
              <button
                onClick={() => onNavigateToApply('spontaneous')}
                className="px-4 py-2 rounded-xl bg-[#172554] text-white text-xs font-bold hover:bg-[#1A3478] transition-all cursor-pointer"
              >
                Registo Espontâneo no Banco
              </button>
            </div>
          </div>
        )}

        {/* 🌟 PAGINATION CONTROLS (Max 10 Vagas Visíveis por Página) */}
        {totalPages > 1 && (
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-medium">
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredAreas.length} vagas no total)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    currentPage === pageNum
                      ? 'bg-[#172554] text-white shadow-xs font-black'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <span className="hidden sm:inline">Seguinte</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </section>

      {/* 3. Dedicated Application Modal */}
      <TariraJobApplicationModal
        isOpen={isApplicationModalOpen}
        job={selectedJobForModal}
        candidateProfile={candidateProfile}
        onClose={() => setIsApplicationModalOpen(false)}
        onSuccess={handleApplicationSuccess}
        onNavigateToCreateProfile={onNavigateToProfile || (() => onNavigateToApply('spontaneous'))}
        currentLang={currentLang}
      />
    </div>
  );
};
