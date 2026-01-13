import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, Variants, AnimatePresence } from 'framer-motion';
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
  Lock,
  Send,
  Bot,
  RefreshCw,
  Loader2
} from 'lucide-react';

// --- Components ---

interface FadeInProps {
  children?: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = "" }) => {
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

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
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

interface ChipProps {
  label: string;
}

const Chip: React.FC<ChipProps> = ({ label }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface border border-white/10 text-muted hover:text-white hover:border-primary/50 transition-colors">
    {label}
  </span>
);

interface PrimaryButtonProps {
  href: string;
  children?: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ href, children }) => (
  <a 
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] transition-all hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.7)] active:scale-95 cursor-pointer"
  >
    {children}
    <ExternalLink className="ml-2 w-4 h-4" />
  </a>
);

// --- Interactive HeroChat Component ---

interface Message {
  id: number;
  role: 'system' | 'user';
  text: string;
}

const HeroChat = () => {
  // Scripted conversation steps
  // 0: Init -> Ask Name
  // 1: Name provided -> Ask Sphere
  // 2: Sphere provided -> Ask Process
  // 3: Process provided -> Ask Contact
  // 4: Contact provided -> Final Thank You
  const [step, setStep] = useState(0);
  
  // Data collection state
  const [formData, setFormData] = useState({
    name: '',
    sphere: '',
    process: '',
    contact: ''
  });

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'system', text: 'Вітаю! Я — Архітектор SMAgents. Як я можу до вас звертатися?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false); // New state for API simulation
  const scrollRef = useRef<HTMLDivElement>(null);

  // Improved auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, isSending]);

  const sendDataToWebhook = async (data: typeof formData) => {
    // TODO: Insert your n8n Webhook URL here
    // Example:
    // try {
    //   await fetch('https://your-n8n-instance.com/webhook/...', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    //   });
    // } catch (e) { console.error('Webhook error', e); }
    
    console.log('--- DATA READY FOR WEBHOOK ---');
    console.log(data);
    console.log('------------------------------');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 1. Add User Message
    const userText = inputValue.trim();
    const newUserMsg: Message = { id: Date.now(), role: 'user', text: userText };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    
    // Update collected data based on current step
    const updatedData = { ...formData };
    if (step === 0) updatedData.name = userText;
    if (step === 1) updatedData.sphere = userText;
    if (step === 2) updatedData.process = userText;
    if (step === 3) updatedData.contact = userText;
    setFormData(updatedData);

    let nextStep = step + 1;
    let nextMessageText = '';

    // Handle Logic based on Step
    if (step === 3) {
      // Final step: Simulate submission
      setIsSending(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
      await sendDataToWebhook(updatedData);
      setIsSending(false);
      
      nextMessageText = 'Дякую! Дані передано інженерам. Ми зв\'яжемося з вами найближчим часом.';
      
      // Add final message immediately after "sending" is done
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        role: 'system', 
        text: nextMessageText 
      }]);
      setStep(nextStep);
      return;
    }

    // Normal steps: Show typing indicator then message
    setIsTyping(true);
    setStep(nextStep);

    // Select next question
    if (step === 0) nextMessageText = 'Дуже приємно. Яка сфера вашого бізнесу?';
    else if (step === 1) nextMessageText = 'Який процес ви хочете автоматизувати в першу чергу? (напр. обробка лідів, підтримка, звітність)';
    else if (step === 2) nextMessageText = 'Зафіксував. Останнє: залиште ваш контакт (Telegram або пошта) для детального розрахунку.';
    else {
      // Fallback
      nextMessageText = 'Ми вже обробляємо ваш запит.';
    }

    // Simulate Bot Delay
    setTimeout(() => {
      const responseMsg: Message = { 
        id: Date.now() + 1, 
        role: 'system', 
        text: nextMessageText 
      };
      setMessages((prev) => [...prev, responseMsg]);
      setIsTyping(false);
    }, 1000); 
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setStep(0);
    setMessages([{ id: 1, role: 'system', text: 'Вітаю! Я — Архітектор SMAgents. Як я можу до вас звертатися?' }]);
    setFormData({ name: '', sphere: '', process: '', contact: '' });
    setInputValue('');
    setIsTyping(false);
    setIsSending(false);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mt-12 perspective-1000 z-20">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 animate-pulse"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative bg-[#0F1115]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[380px]"
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-xs font-mono text-gray-400 tracking-wider">SM_AGENT_CORE</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={resetChat} 
              className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              title="Start Over"
            >
              <RefreshCw size={14} />
            </button>
            <div className="flex gap-1.5 ml-1">
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
            </div>
          </div>
        </div>

        {/* Chat Body */}
        <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar scroll-smooth">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-primary/20 text-white border border-primary/20 rounded-tr-none' 
                      : 'bg-white/5 text-gray-300 border border-white/5 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'system' && (
                    <div className="flex items-center gap-2 mb-1 text-[10px] text-primary font-mono uppercase opacity-70">
                      <Bot size={12} /> Agent
                    </div>
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 ml-2 p-2"
            >
               <span className="text-xs text-muted font-mono mr-1">Agent is typing</span>
               <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
            </motion.div>
          )}

          {/* Submission Indicator */}
          {isSending && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 ml-2 p-2 text-primary"
             >
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-mono">Syncing data to core...</span>
             </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 py-3 border-t border-white/5 bg-black/20 flex items-center gap-3 shrink-0">
          <span className="text-primary/70"><Terminal size={16} /></span>
          <div className="h-4 w-px bg-white/10"></div>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={step > 3 ? "Chat session completed" : "Type your answer..."}
            disabled={step > 3 || isTyping || isSending}
            autoComplete="off"
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-600 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            onClick={handleSendMessage}
            disabled={step > 3 || isTyping || isSending || !inputValue.trim()}
            className={`p-1.5 rounded-md transition-all ${inputValue.trim() && !isTyping && !isSending && step <= 3 ? 'text-primary hover:bg-primary/10' : 'text-gray-600 cursor-not-allowed'}`}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Sections ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    // Default to top if href is # or element not found (e.g. logo)
    if (href === '#' || !targetId) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (element) {
      const offset = 80; // Height of the fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    setIsOpen(false);
  };

  const links = [
    { name: 'Послуги', href: '#services' },
    { name: 'Процес', href: '#process' },
    { name: 'Технології', href: '#tech' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-white/5 py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a 
          href="#" 
          onClick={(e) => scrollToSection(e, '#')}
          className="text-xl font-bold text-white tracking-tight flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <span className="text-xs font-mono text-white">SM</span>
          </div>
          SM Agents Consulting
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#footer" 
            onClick={(e) => scrollToSection(e, '#footer')}
            className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/5 cursor-pointer hover:border-white/20"
          >
            Контакти
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2" aria-label="Toggle menu">
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
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-base font-medium text-gray-300 hover:text-white block px-2 py-1 cursor-pointer"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#footer" 
              onClick={(e) => scrollToSection(e, '#footer')}
              className="text-base font-medium text-primary block px-2 py-1 cursor-pointer"
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
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-secondary/5 rounded-full blur-[100px] opacity-20" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Automating Business Logic
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Хаос процесів перетворюємо на <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary">керовану систему.</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h2 className="text-xl md:text-2xl text-gray-300 mb-6 font-medium max-w-2xl mx-auto">
              AI-автоматизація бізнесу без зайвих слів.
            </h2>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              Надійна архітектура, яка працює 24/7, поки ви займаєтесь стратегією. Менше ручної рутини, більше контролю та прозорості.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col items-center gap-4">
              <PrimaryButton href="https://t.me/Agile_SM_Agent_bot">
                Написати в Telegram
              </PrimaryButton>
              <p className="text-sm text-gray-500">
                Або пройдіть короткий бриф прямо тут 👇
              </p>
            </div>
          </FadeIn>

          <HeroChat />

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
            <PrimaryButton href="https://t.me/Agile_SM_Agent_bot">
              Написати в Telegram
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