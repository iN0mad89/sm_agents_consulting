import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import {
  Menu,
  X,
  ArrowRight,
  ArrowDownToLine,
  Cpu,
  Database,
  ArrowRightCircle,
  ShieldCheck,
  Zap,
  Workflow,
  Boxes,
  MessagesSquare,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity,
  Server,
  Lock
} from 'lucide-react';

// --- Components ---

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const variants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12 md:mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{title}</h2>
    {subtitle && <p className="text-muted text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-card rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const Chip = ({ label }: { label: string }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface border border-white/10 text-muted hover:text-white hover:border-primary/50 transition-colors">
    {label}
  </span>
);

const PrimaryButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] transition-all hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.7)] active:scale-95"
  >
    {children}
    <ExternalLink className="ml-2 w-4 h-4" />
  </a>
);

// --- Sections ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Послуги', href: '#services' },
    { name: 'Процес', href: '#process' },
    { name: 'Технології', href: '#tech' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="#" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <span className="text-xs font-mono text-white">SM</span>
          </div>
          SM Agents Consulting
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {link.name}
            </a>
          ))}
          <a href="#footer" className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/5">
            Контакти
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-white/10 p-4 shadow-xl">
          <div className="flex flex-col space-y-4">
            {links.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-base font-medium text-gray-300 hover:text-white block px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#footer" 
              className="text-base font-medium text-primary block px-2 py-1"
              onClick={() => setIsOpen(false)}
            >
              Контакти
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Хаос процесів перетворюємо на <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">керовану систему.</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h2 className="text-xl md:text-2xl text-gray-300 mb-6 font-medium">
              AI-автоматизація бізнесу без зайвих слів.
            </h2>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg text-muted mb-10 max-w-2xl leading-relaxed">
              Надійна архітектура, яка працює 24/7, поки ви займаєтесь стратегією. Менше ручної рутини, більше контролю та прозорості.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <PrimaryButton href="https://www.linkedin.com/in/serhii-mosiiash-a0608a167/">
                Написати в Linkedin
              </PrimaryButton>
              <p className="text-sm text-gray-500 max-w-xs">
                Почнемо з короткого брифу: 10–12 запитань → чіткий план і оцінка.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const TrustMarkers = () => {
  const items = [
    { title: "Engineering First", desc: "будуємо архітектуру, стійку до помилок — не “тимчасові рішення”." },
    { title: "Privacy by Design", desc: "дані ізольовані. Жодних публічних доступів до внутрішніх систем." },
    { title: "Ownership", desc: "після здачі проєкту ви володієте доступами, конфігураціями та документацією." },
    { title: "Без зайвого шуму", desc: "говоримо мовою бізнесу: результат, ризики, контроль." }
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="h-full">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "End-to-End Автоматизація (n8n)",
      desc: "Будуємо ланцюжки дій (workflows): від заявки та документів — до CRM, звітності й повідомлень. Стабільно, з логікою, ретраями та контролем збоїв.",
      icon: <Workflow className="w-8 h-8 text-primary" />
    },
    {
      title: "Розумні Боти (Telegram / WhatsApp)",
      desc: "Боти, які акуратно збирають дані, кваліфікують запит і передають менеджеру вже “готовий контекст”. Менше переписок — більше точних дій.",
      icon: <MessagesSquare className="w-8 h-8 text-primary" />
    },
    {
      title: "CRM & Sales Ops",
      desc: "Налаштовуємо CRM так, щоб вона допомагала продавати: маршрутизація лідів, нагадування, статуси, follow-ups, прозорі воронки та дисципліна процесу.",
      icon: <Zap className="w-8 h-8 text-primary" />
    },
    {
      title: "Безпечна Інфраструктура",
      desc: "Розгортаємо середовище, де автоматизації живуть стабільно: бекапи, захищені тунелі, ізольовані адмін-контури, контроль доступів.",
      icon: <Server className="w-8 h-8 text-primary" />
    }
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionTitle title="Послуги" subtitle="Технічні рішення для бізнес-задач." />
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <Card className="h-full">
                <div className="mb-6 p-3 bg-white/5 rounded-lg w-fit border border-white/5">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{s.title}</h3>
                <p className="text-muted leading-relaxed">{s.desc}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    { title: "Audit (Діагностика)", desc: "знаходимо вузькі місця, де бізнес втрачає час/якість/керованість. Фіксуємо метрику успіху.", icon: <Activity className="w-5 h-5" /> },
    { title: "Blueprint (Проєктування)", desc: "показуємо архітектуру рішення: як працює, де зберігаються дані, де контроль і безпека.", icon: <Boxes className="w-5 h-5" /> },
    { title: "Build (Реалізація)", desc: "інтеграції, логіка, тестування на реальних сценаріях.", icon: <Cpu className="w-5 h-5" /> },
    { title: "Harden & Handover (Запуск)", desc: "фінальна безпека, моніторинг, документація та передача “ключів”.", icon: <Lock className="w-5 h-5" /> },
  ];

  return (
    <section id="process" className="py-24 bg-surface/20 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionTitle title="Процес" subtitle="Від хаосу до порядку за 4 кроки." />
        </FadeIn>

        <div className="relative">
          {/* Vertical Line for Desktop */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.2}>
                <div className={`flex flex-col md:flex-row items-start md:items-center gap-8 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Step Content */}
                  <div className="ml-12 md:ml-0 md:w-1/2 flex flex-col md:items-end p-4">
                     <div className={`md:text-right ${idx % 2 === 1 ? 'md:text-left' : ''} md:px-8`}>
                       <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                       <p className="text-muted">{step.desc}</p>
                     </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-surface border border-primary/50 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)] z-10">
                    <span className="text-primary">{step.icon}</span>
                  </div>

                  {/* Empty space for opposite side */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Architecture = () => {
  const steps = [
    { label: "ВХІД", icon: <ArrowDownToLine className="w-5 h-5" />, micro: "подія / запит" },
    { label: "ОБРОБКА", icon: <Cpu className="w-5 h-5" />, micro: "логіка + AI" },
    { label: "ЗБЕРЕЖЕННЯ", icon: <Database className="w-5 h-5" />, micro: "постійна памʼять" },
    { label: "ДІЯ", icon: <ArrowRightCircle className="w-5 h-5" />, micro: "інтеграції / CRM" },
    { label: "КОНТРОЛЬ", icon: <ShieldCheck className="w-5 h-5" />, micro: "лог + алерт" }
  ];

  return (
    <section className="py-24 bg-background overflow-hidden relative">
      {/* Background Engineering Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left: Text & Code Block */}
          <FadeIn>
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Архітектура Рішення</h2>
              
              {/* Code Block - Terminal Style */}
              <div className="mb-8 w-full bg-[#0D1117] border border-white/10 rounded-lg overflow-hidden shadow-2xl group ring-1 ring-white/5">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                     <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                   </div>
                   <div className="text-[10px] font-mono text-muted opacity-50">pipeline_config.yaml</div>
                </div>
                <div className="p-6 overflow-x-auto hide-scrollbar bg-black/20">
                    <code className="font-mono text-sm text-secondary whitespace-nowrap block">
                        <span className="text-gray-500">[</span> <span className="text-white">ВХІД</span> <span className="text-gray-500">]</span> 
                        <span className="text-primary mx-2">→</span> 
                        <span className="text-gray-500">[</span> <span className="text-white">ОБРОБКА</span> <span className="text-gray-500">]</span> 
                        <span className="text-primary mx-2">→</span> 
                        <span className="text-gray-500">[</span> <span className="text-white">ЗБЕРЕЖЕННЯ</span> <span className="text-gray-500">]</span> 
                        <span className="text-primary mx-2">→</span> 
                        <span className="text-gray-500">[</span> <span className="text-white">ДІЯ</span> <span className="text-gray-500">]</span> 
                        <span className="text-primary mx-2">→</span> 
                        <span className="text-gray-500">[</span> <span className="text-white">КОНТРОЛЬ</span> <span className="text-gray-500">]</span>
                    </code>
                </div>
              </div>

              <div className="pl-6 border-l-2 border-primary/20">
                <p className="text-muted text-lg leading-relaxed">
                  Ми не будуємо "чорні скриньки". Кожна система прозора, документована та побудована за принципом конвеєра даних. Ви завжди знаєте, що відбувається на кожному етапі.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Right: Improved Pipeline Diagram */}
          <FadeIn delay={0.2} className="w-full">
            <div className="relative p-8 md:p-10 border border-white/5 rounded-3xl bg-surface/40 backdrop-blur-md shadow-2xl">
                
                {/* Background Line Container */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                     <div className="absolute top-0 right-0 p-8 opacity-20">
                         <Activity className="w-24 h-24 text-primary blur-3xl" />
                     </div>
                </div>

                {/* Desktop Layout (Horizontal) */}
                <div className="hidden md:flex flex-col w-full relative">
                    {/* Connecting Line (Absolute) */}
                    <div className="absolute top-[2.5rem] left-8 right-8 h-0.5 bg-white/5 z-0">
                        <motion.div 
                           className="h-full bg-gradient-to-r from-transparent via-primary to-transparent w-1/3 blur-[1px]"
                           animate={{ x: ["-100%", "400%"] }}
                           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    <div className="flex justify-between items-start w-full gap-2 relative z-10">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center group w-24">
                                {/* Node Card */}
                                <motion.div 
                                    className="w-20 h-20 rounded-xl bg-[#0B0F17] border border-white/10 flex items-center justify-center relative shadow-lg transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_-3px_rgba(79,70,229,0.3)] bg-gradient-to-b from-surface to-background"
                                    whileHover={{ y: -5, scale: 1.05 }}
                                >
                                    <div className="text-gray-400 group-hover:text-primary transition-colors duration-300">
                                        {step.icon}
                                    </div>
                                    
                                    {/* Active State Indicator Dot */}
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                                </motion.div>

                                {/* Labels */}
                                <div className="mt-4 text-center w-full">
                                    <div className="text-[11px] font-bold text-white tracking-widest mb-1.5">{step.label}</div>
                                    <div className="flex justify-center">
                                      <span className="text-[9px] text-muted uppercase tracking-tight px-1.5 py-0.5 bg-white/5 rounded border border-white/5 truncate max-w-full">
                                        {step.micro}
                                      </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Layout (Vertical) */}
                <div className="md:hidden relative pl-6">
                     {/* Vertical Connecting Line */}
                     <div className="absolute left-[3.25rem] top-8 bottom-8 w-0.5 bg-white/5">
                        <motion.div 
                           className="w-full h-1/2 bg-gradient-to-b from-transparent via-primary to-transparent blur-[1px]"
                           animate={{ y: ["-100%", "300%"] }}
                           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                     </div>

                     <div className="space-y-8 relative z-10">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-xl bg-[#0B0F17] border border-white/10 flex-shrink-0 flex items-center justify-center z-10 shadow-lg group-hover:border-primary/50 transition-colors relative">
                                    <div className="text-gray-400 group-hover:text-primary transition-colors">
                                        {step.icon}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-white tracking-wider mb-1">{step.label}</div>
                                    <span className="text-[10px] text-muted bg-white/5 px-2 py-1 rounded border border-white/5">{step.micro}</span>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>

            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Чому ми?</h3>
            <div className="space-y-6">
              {[
                "Production-надійність: рішення розраховані на реальні бізнес-сценарії, а не демо.",
                "Швидкість без втрати якості: low-code там, де це ефективно, і чистий код там, де це необхідно.",
                "Конфіденційність: ми розуміємо ціну інформації. Дані й доступи — під вашим контролем."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 min-w-[20px] text-secondary">
                    <CheckCircle size={20} />
                  </div>
                  <p className="text-gray-300 text-lg">{text}</p>
                </div>
              ))}
            </div>
         </div>
      </div>
    </section>
  );
};

const Tech = () => {
  const categories = [
    {
      title: "Automation",
      icon: <Workflow className="w-6 h-6" />,
      chips: ["n8n", "Webhooks", "Cron / Schedulers", "Queues / Retries", "Error Handling / Fallback", "Idempotency", "Rate Limiting", "Observability"]
    },
    {
      title: "AI Layer",
      icon: <Cpu className="w-6 h-6" />,
      chips: ["LLM / AI-шар", "RAG", "Embeddings", "Prompting", "Guardrails", "Function Calling", "Classification"]
    },
    {
      title: "Data",
      icon: <Database className="w-6 h-6" />,
      chips: ["PostgreSQL", "NoSQL", "Vector DB", "BigQuery", "Data Validation", "ETL / Pipelines", "Backups", "Audit Logs"]
    },
    {
      title: "Infrastructure",
      icon: <Boxes className="w-6 h-6" />,
      chips: ["Docker", "Kubernetes", "CI/CD", "Reverse Proxy", "Tunnels / Access Control", "Secrets Management", "Monitoring / Alerts", "Cloud Functions"]
    },
    {
      title: "Security & Reliability",
      icon: <ShieldCheck className="w-6 h-6" />,
      chips: ["Least Privilege", "RBAC", "Encryption", "Failover", "Runbooks", "SLA-minded Ops", "Incident Response", "Change Control"]
    },
    {
      title: "Messaging & Integrations",
      icon: <MessagesSquare className="w-6 h-6" />,
      chips: ["Telegram / WhatsApp", "REST APIs", "Google Workspace", "CRM Integrations", "Notifications", "Google Analytics", "Google Tag Manager", "BI Dashboards"]
    }
  ];

  return (
    <section id="tech" className="py-24 bg-surface/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionTitle title="Технології" subtitle="Сучасний стек для стабільних рішень." />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <Card className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-primary">{cat.icon}</div>
                  <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {cat.chips.map((chip, cIdx) => (
                    <Chip key={cIdx} label={chip} />
                  ))}
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Standards = () => {
  const cards = [
    {
      title: "Бриф і рамка задачі",
      points: ["Короткий бриф (10–12 запитань) → чіткий scope.", "Фіксуємо ціль, ризики та критерії готовності."]
    },
    {
      title: "Продуктове мислення",
      points: ["Починаємо з процесу та метрик, а не з “інструментів”.", "Впроваджуємо так, щоб команда реально користувалась."]
    },
    {
      title: "Управління та комунікація",
      points: ["Stakeholder alignment: хто власник, хто виконавець, хто приймає.", "Статус, ризики, наступні кроки — прозоро і регулярно."]
    },
    {
      title: "Документація та передача",
      points: ["Blueprint, доступи, конфіги, інструкції, runbook.", "Передаємо систему так, щоб ви володіли нею повністю."]
    }
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionTitle 
            title="Стандарти роботи" 
            subtitle="Технології — це інструмент. Результат дає дисципліна виконання." 
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <Card className="h-full border-t-2 border-t-primary/50">
                <h4 className="text-lg font-bold text-white mb-4">{card.title}</h4>
                <ul className="space-y-3">
                  {card.points.map((p, pIdx) => (
                    <li key={pIdx} className="text-sm text-muted flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-24 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Готові прибрати хаос і отримати керовану систему?
          </h2>
          <p className="text-xl text-muted mb-10">
            Обговоримо вашу задачу. Без зобов’язань. Лише суть.
          </p>
          <div className="flex flex-col items-center gap-4">
            <PrimaryButton href="https://www.linkedin.com/in/serhii-mosiiash-a0608a167/">
              Написати в Linkedin
            </PrimaryButton>
            <p className="text-sm text-gray-500 mt-4">
              Опишіть 1 процес — ми скажемо, як зробити його стабільним і контрольованим.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="footer" className="py-12 bg-background border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-white font-bold mb-1">SM Agents Consulting</h3>
          <p className="text-sm text-muted">Production-grade automation & AI solutions.</p>
        </div>
        
        <div className="text-center md:text-right text-sm text-muted space-y-2">
          <p>WhatsApp / Телефон: 095 839 77 99</p>
          <p>Email: nmdaihub@gmail.com</p>
          <p className="text-xs text-gray-600 mt-4">© 2025 SM Agents Consulting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="bg-background min-h-screen text-text selection:bg-primary/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <TrustMarkers />
        <Services />
        <Process />
        <Architecture />
        <WhyUs />
        <Tech />
        <Standards />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;