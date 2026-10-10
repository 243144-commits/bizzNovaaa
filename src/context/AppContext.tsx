import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Startup,
  Competitor,
  MarketValidationItem,
  CustomerPersona,
  Task,
  Milestone,
  MentorProfile,
  TeamMemberCandidate,
  Competition,
  RiskRadarItem,
  PitchDeckSlide,
  StartupStage,
} from '../types';
import {
  INITIAL_STARTUPS,
  INITIAL_COMPETITORS,
  INITIAL_VALIDATION_ITEMS,
  INITIAL_PERSONAS,
  INITIAL_TASKS,
  INITIAL_MILESTONES,
  INITIAL_MENTORS,
  INITIAL_TEAM_CANDIDATES,
  INITIAL_COMPETITIONS,
  INITIAL_RISKS,
  INITIAL_PITCH_DECK_SLIDES,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  startups: Startup[];
  activeStartupId: string;
  setActiveStartupId: (id: string) => void;
  activeStartup: Startup;
  addStartup: (startup: Omit<Startup, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStartup: (id: string, updates: Partial<Startup>) => void;
  deleteStartup: (id: string) => void;

  // Modals
  isStartupModalOpen: boolean;
  openStartupModal: (startupToEdit?: Startup) => void;
  closeStartupModal: () => void;
  editingStartup: Startup | null;

  // Validation
  validationItems: MarketValidationItem[];
  addValidationItem: (item: Omit<MarketValidationItem, 'id' | 'startupId' | 'updatedAt'>) => void;
  updateValidationItem: (id: string, updates: Partial<MarketValidationItem>) => void;
  deleteValidationItem: (id: string) => void;

  // Personas
  personas: CustomerPersona[];
  addPersona: (persona: Omit<CustomerPersona, 'id' | 'startupId'>) => void;
  updatePersona: (id: string, updates: Partial<CustomerPersona>) => void;
  deletePersona: (id: string) => void;

  // Competitors
  competitors: Competitor[];
  addCompetitor: (competitor: Omit<Competitor, 'id' | 'startupId'>) => void;
  deleteCompetitor: (id: string) => void;

  // Tasks & Milestones
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'startupId' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  milestones: Milestone[];
  toggleMilestone: (id: string) => void;

  // Mentors & Community
  mentors: MentorProfile[];
  sendMentorRequest: (mentorId: string) => void;
  teamCandidates: TeamMemberCandidate[];
  connectTeamCandidate: (candidateId: string) => void;
  competitions: Competition[];
  submitToCompetition: (competitionId: string) => void;

  // Risks
  risks: RiskRadarItem[];
  addRisk: (risk: Omit<RiskRadarItem, 'id' | 'startupId'>) => void;
  updateRisk: (id: string, updates: Partial<RiskRadarItem>) => void;

  // Pitch Deck
  pitchDeckSlides: PitchDeckSlide[];
  updatePitchDeckSlide: (slideNumber: number, updates: Partial<PitchDeckSlide>) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Demo Reset
  resetToDemoDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('FOUNDER');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Startups state
  const [startups, setStartups] = useState<Startup[]>(() => {
    try {
      const saved = localStorage.getItem('bizznova_startups');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading startups from storage', e);
    }
    return INITIAL_STARTUPS;
  });

  const [activeStartupId, setActiveStartupId] = useState<string>(() => {
    return startups[0]?.id || 'startup-novaflow';
  });

  const [isStartupModalOpen, setIsStartupModalOpen] = useState(false);
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);

  // Competitors state
  const [competitors, setCompetitors] = useState<Competitor[]>(() => {
    try {
      const saved = localStorage.getItem('bizznova_competitors');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COMPETITORS;
  });

  // Validation items state
  const [validationItems, setValidationItems] = useState<MarketValidationItem[]>(() => {
    try {
      const saved = localStorage.getItem('bizznova_validation_items');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_VALIDATION_ITEMS;
  });

  // Personas state
  const [personas, setPersonas] = useState<CustomerPersona[]>(() => {
    try {
      const saved = localStorage.getItem('bizznova_personas');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PERSONAS;
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('bizznova_tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TASKS;
  });

  // Milestones state
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem('bizznova_milestones');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MILESTONES;
  });

  // Mentors state
  const [mentors, setMentors] = useState<MentorProfile[]>(INITIAL_MENTORS);
  const [teamCandidates, setTeamCandidates] = useState<TeamMemberCandidate[]>(INITIAL_TEAM_CANDIDATES);
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  const [risks, setRisks] = useState<RiskRadarItem[]>(INITIAL_RISKS);
  const [pitchDeckSlides, setPitchDeckSlides] = useState<PitchDeckSlide[]>(INITIAL_PITCH_DECK_SLIDES);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bizznova_startups', JSON.stringify(startups));
    } catch {}
  }, [startups]);

  useEffect(() => {
    try {
      localStorage.setItem('bizznova_competitors', JSON.stringify(competitors));
    } catch {}
  }, [competitors]);

  useEffect(() => {
    try {
      localStorage.setItem('bizznova_validation_items', JSON.stringify(validationItems));
    } catch {}
  }, [validationItems]);

  useEffect(() => {
    try {
      localStorage.setItem('bizznova_personas', JSON.stringify(personas));
    } catch {}
  }, [personas]);

  useEffect(() => {
    try {
      localStorage.setItem('bizznova_tasks', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('bizznova_milestones', JSON.stringify(milestones));
    } catch {}
  }, [milestones]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeStartup = startups.find((s) => s.id === activeStartupId) || startups[0] || INITIAL_STARTUPS[0];

  const addStartup = (data: Omit<Startup, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `startup-${Date.now()}`;
    const newStartup: Startup = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStartups((prev) => [newStartup, ...prev]);
    setActiveStartupId(newId);
    addToast({
      type: 'success',
      title: 'Startup Profile Created',
      message: `${newStartup.name} is now loaded into the startup operating system.`,
    });
  };

  const updateStartup = (id: string, updates: Partial<Startup>) => {
    setStartups((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s))
    );
    addToast({
      type: 'success',
      title: 'Startup Updated',
      message: 'Changes have been safely persisted.',
    });
  };

  const deleteStartup = (id: string) => {
    if (startups.length <= 1) {
      addToast({
        type: 'warning',
        title: 'Action Restricted',
        message: 'At least one startup record must remain in the workspace.',
      });
      return;
    }
    const filtered = startups.filter((s) => s.id !== id);
    setStartups(filtered);
    setActiveStartupId(filtered[0].id);
    addToast({
      type: 'info',
      title: 'Startup Removed',
      message: 'Startup record was deleted.',
    });
  };

  const openStartupModal = (startupToEdit?: Startup) => {
    setEditingStartup(startupToEdit || null);
    setIsStartupModalOpen(true);
  };

  const closeStartupModal = () => {
    setIsStartupModalOpen(false);
    setEditingStartup(null);
  };

  // Validation items
  const addValidationItem = (item: Omit<MarketValidationItem, 'id' | 'startupId' | 'updatedAt'>) => {
    const newItem: MarketValidationItem = {
      ...item,
      id: `val-${Date.now()}`,
      startupId: activeStartupId,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setValidationItems((prev) => [newItem, ...prev]);
    addToast({
      type: 'success',
      title: 'Validation Finding Added',
      message: `Tagged as ${item.tag}.`,
    });
  };

  const updateValidationItem = (id: string, updates: Partial<MarketValidationItem>) => {
    setValidationItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : i))
    );
  };

  const deleteValidationItem = (id: string) => {
    setValidationItems((prev) => prev.filter((i) => i.id !== id));
    addToast({ type: 'info', title: 'Finding Deleted' });
  };

  // Personas
  const addPersona = (persona: Omit<CustomerPersona, 'id' | 'startupId'>) => {
    const newPersona: CustomerPersona = {
      ...persona,
      id: `persona-${Date.now()}`,
      startupId: activeStartupId,
    };
    setPersonas((prev) => [...prev, newPersona]);
    addToast({
      type: 'success',
      title: 'Customer Persona Saved',
      message: `Added ${newPersona.name}.`,
    });
  };

  const updatePersona = (id: string, updates: Partial<CustomerPersona>) => {
    setPersonas((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addToast({ type: 'success', title: 'Persona Updated' });
  };

  const deletePersona = (id: string) => {
    setPersonas((prev) => prev.filter((p) => p.id !== id));
    addToast({ type: 'info', title: 'Persona Deleted' });
  };

  // Competitors
  const addCompetitor = (competitor: Omit<Competitor, 'id' | 'startupId'>) => {
    const newComp: Competitor = {
      ...competitor,
      id: `comp-${Date.now()}`,
      startupId: activeStartupId,
    };
    setCompetitors((prev) => [...prev, newComp]);
    addToast({
      type: 'success',
      title: 'Competitor Added',
      message: `${newComp.name} added to benchmarking matrix.`,
    });
  };

  const deleteCompetitor = (id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    addToast({ type: 'info', title: 'Competitor Removed' });
  };

  // Tasks
  const addTask = (task: Omit<Task, 'id' | 'startupId' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      startupId: activeStartupId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast({
      type: 'success',
      title: 'Task Created',
      message: newTask.title,
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast({ type: 'info', title: 'Task Removed' });
  };

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = !m.achieved;
          return {
            ...m,
            achieved: next,
            achievedDate: next ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return m;
      })
    );
  };

  const sendMentorRequest = (mentorId: string) => {
    setMentors((prev) =>
      prev.map((m) => (m.id === mentorId ? { ...m, requestStatus: 'PENDING' } : m))
    );
    addToast({
      type: 'success',
      title: 'Advisory Request Sent',
      message: 'Mentor notified for discovery consultation.',
    });
  };

  const connectTeamCandidate = (candidateId: string) => {
    setTeamCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'CONNECTED' } : c))
    );
    addToast({
      type: 'success',
      title: 'Connection Requested',
      message: 'Direct introduction sent via BizzNova Network.',
    });
  };

  const submitToCompetition = (competitionId: string) => {
    setCompetitions((prev) =>
      prev.map((c) => {
        if (c.id === competitionId) {
          const newScore = Math.floor(82 + Math.random() * 10);
          return {
            ...c,
            hasSubmitted: true,
            submissionScore: newScore,
            participantsCount: c.participantsCount + 1,
            leaderboard: [
              ...c.leaderboard,
              { rank: c.leaderboard.length + 1, startupName: activeStartup.name, score: newScore, stage: activeStartup.stage },
            ].sort((a, b) => b.score - a.score).map((item, idx) => ({ ...item, rank: idx + 1 })),
          };
        }
        return c;
      })
    );
    addToast({
      type: 'success',
      title: 'Application Submitted',
      message: `${activeStartup.name} submitted for judging evaluation.`,
    });
  };

  const addRisk = (risk: Omit<RiskRadarItem, 'id' | 'startupId'>) => {
    const newRisk: RiskRadarItem = {
      ...risk,
      id: `risk-${Date.now()}`,
      startupId: activeStartupId,
    };
    setRisks((prev) => [...prev, newRisk]);
    addToast({
      type: 'success',
      title: 'Risk Factor Logged',
      message: `Assessed as ${risk.severity} severity.`,
    });
  };

  const updateRisk = (id: string, updates: Partial<RiskRadarItem>) => {
    setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const updatePitchDeckSlide = (slideNumber: number, updates: Partial<PitchDeckSlide>) => {
    setPitchDeckSlides((prev) =>
      prev.map((s) => (s.slideNumber === slideNumber ? { ...s, ...updates } : s))
    );
    addToast({ type: 'success', title: 'Slide Updated' });
  };

  const resetToDemoDefaults = () => {
    localStorage.removeItem('bizznova_startups');
    localStorage.removeItem('bizznova_competitors');
    localStorage.removeItem('bizznova_validation_items');
    localStorage.removeItem('bizznova_personas');
    localStorage.removeItem('bizznova_tasks');
    localStorage.removeItem('bizznova_milestones');
    setStartups(INITIAL_STARTUPS);
    setActiveStartupId(INITIAL_STARTUPS[0].id);
    setCompetitors(INITIAL_COMPETITORS);
    setValidationItems(INITIAL_VALIDATION_ITEMS);
    setPersonas(INITIAL_PERSONAS);
    setTasks(INITIAL_TASKS);
    setMilestones(INITIAL_MILESTONES);
    setMentors(INITIAL_MENTORS);
    setTeamCandidates(INITIAL_TEAM_CANDIDATES);
    setCompetitions(INITIAL_COMPETITIONS);
    setRisks(INITIAL_RISKS);
    setPitchDeckSlides(INITIAL_PITCH_DECK_SLIDES);
    addToast({
      type: 'info',
      title: 'Workspace Reset',
      message: 'Restored original demo dataset.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        startups,
        activeStartupId,
        setActiveStartupId,
        activeStartup,
        addStartup,
        updateStartup,
        deleteStartup,
        isStartupModalOpen,
        openStartupModal,
        closeStartupModal,
        editingStartup,
        validationItems: validationItems.filter((v) => v.startupId === activeStartupId),
        addValidationItem,
        updateValidationItem,
        deleteValidationItem,
        personas: personas.filter((p) => p.startupId === activeStartupId),
        addPersona,
        updatePersona,
        deletePersona,
        competitors: competitors.filter((c) => c.startupId === activeStartupId),
        addCompetitor,
        deleteCompetitor,
        tasks: tasks.filter((t) => t.startupId === activeStartupId),
        addTask,
        updateTask,
        deleteTask,
        milestones: milestones.filter((m) => m.startupId === activeStartupId),
        toggleMilestone,
        mentors,
        sendMentorRequest,
        teamCandidates,
        connectTeamCandidate,
        competitions,
        submitToCompetition,
        risks: risks.filter((r) => r.startupId === activeStartupId),
        addRisk,
        updateRisk,
        pitchDeckSlides,
        updatePitchDeckSlide,
        toasts,
        addToast,
        removeToast,
        resetToDemoDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
