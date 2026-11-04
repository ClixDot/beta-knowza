import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  Layers,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Plus,
  Search,
  Settings,
  Share2,
  ImageIcon,
  X,
} from 'lucide-react';
import { IconBtn, Btn, Chip } from '../components/ui';
import { useSmoothScroll } from '../components/interactions';
import { signOut, useSession } from '../../cms/services/auth';
import { pendingChanges, useCmsState } from '../../cms/services/cmsStore';
import { searchContent } from '../../cms/services/insights';
import { listEnquiries, subscribeSubmissions } from '../../cms/services/submissions';
import type { EnquiryRecord } from '../../cms/types';
import { timeAgo } from '../../cms/utils';

const NAV_GROUPS = [
  {
    label: 'Overview',
    home: '/admin',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin/pages', label: 'Page Management', icon: FileText },
      { to: '/admin/sections', label: 'Website Sections', icon: Layers },
    ],
  },
  {
    label: 'Content',
    home: '/admin/blog',
    items: [
      { to: '/admin/blog', label: 'Blog & Journal', icon: Newspaper },
      { to: '/admin/gallery', label: 'Gallery', icon: Images },
      { to: '/admin/media', label: 'Media Library', icon: ImageIcon },
    ],
  },
  {
    label: 'Website',
    home: '/admin/social',
    items: [
      { to: '/admin/social', label: 'Social Media', icon: Share2 },
      { to: '/admin/brand', label: 'Brand Settings', icon: Palette },
      { to: '/admin/contact', label: 'Contact Management', icon: Mail },
    ],
  },
  { label: 'Settings', home: '/admin/settings', items: [{ to: '/admin/settings', label: 'Admin Settings', icon: Settings }] },
];

const COLLAPSE_KEY = 'knowza.admin.sidebarCollapsed';

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
};

const Sidebar: React.FC<{ collapsed: boolean; onNavigate?: () => void; onToggle?: () => void }> = ({ collapsed, onNavigate, onToggle }) => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col">
      <div className={`flex items-center ${collapsed ? 'flex-col gap-1.5 px-2 pt-4 pb-2' : 'justify-between gap-2 pl-5 pr-3 pt-4 pb-4'}`}>
        <Link to="/admin" onClick={onNavigate} aria-label="KNOWZA admin home" className="shrink-0">
          <img src={collapsed ? 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760161/knowza/images/logo/knowza-mark-dark.png' : 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760157/knowza/images/logo/knowza-logo-horizontal-dark.png'} alt="KNOWZA" className={collapsed ? 'h-9 w-9 object-contain' : 'h-7 w-auto'} />
        </Link>
        {onToggle && (
          <IconBtn label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={onToggle}>
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </IconBtn>
        )}
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto adm-scroll px-2.5 space-y-4 [@media(max-height:850px)]:space-y-2 min-h-0">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && <p className="px-2.5 mb-1 text-[12px] text-adm-mute">{group.label}</p>}
            <ul className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, end }: any) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 min-h-[38px] rounded-full transition-all duration-200 text-[13.5px] ${collapsed ? 'justify-center px-0' : 'px-3'} ${
                        isActive ? 'adm-tab-active-pill text-white font-semibold' : 'text-adm-mute hover:text-adm-ink hover:bg-adm-deep/[0.05]'
                      }`
                    }
                  >
                    <Icon className="w-[17px] h-[17px] shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                    {collapsed && <span className="sr-only">{label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            void signOut();
            navigate('/admin');
          }}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-2.5 min-h-[38px] rounded-full transition-colors text-[13.5px] text-adm-mute hover:text-adm-ink hover:bg-adm-deep/[0.05] ${collapsed ? 'justify-center' : 'px-3'}`}
        >
          <LogOut className="w-[17px] h-[17px]" />
          {collapsed ? <span className="sr-only">Logout</span> : 'Logout'}
        </button>
      </nav>

      {!collapsed && (
        <div className="p-2.5">
          <div className="adm-swirl rounded-[18px] p-3.5 [@media(max-height:850px)]:p-2 text-white">
            <p className="adm-display text-[15px] leading-snug text-white [@media(max-height:850px)]:hidden">View the live website</p>
            <p className="text-[12px] text-white/75 mt-1 mb-3 [@media(max-height:850px)]:hidden">See what visitors see right now.</p>
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 min-h-[36px] rounded-full bg-white text-adm-deep text-[13px] hover:bg-adm-cream transition-colors">
              Open website <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

/** The top bar's pills jump between the sidebar's groups, which also shows where you are. */
const TopNav: React.FC = () => {
  const { pathname } = useLocation();
  const current = NAV_GROUPS.find((group) => group.items.some((item: any) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))) ?? NAV_GROUPS[0];
  return (
    <nav aria-label="Admin areas" className="adm-round !bg-white hidden xl:flex items-center gap-0.5 p-1 shrink-0">
      {NAV_GROUPS.map((group) => {
        const active = group === current;
        return (
          <Link key={group.label} to={group.home} aria-current={active ? 'true' : undefined} className={`relative min-h-[34px] px-4 inline-flex items-center rounded-full text-[13px] transition-colors ${active ? 'text-white' : 'text-adm-mute hover:text-adm-ink'}`}>
            {active && <motion.span layoutId="adm-topnav" className="absolute inset-0 rounded-full bg-adm-deep" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
            <span className="relative">{group.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const useOutsideClose = (ref: React.RefObject<HTMLElement | null>, onClose: () => void) => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', key);
    };
  }, [ref, onClose]);
};

const dropdownMotion = { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 }, transition: { duration: 0.14 } };

const SearchBox: React.FC = () => {
  const { draft } = useCmsState();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const hits = useMemo(() => searchContent(draft, query), [draft, query]);
  useOutsideClose(boxRef, () => setOpen(false));

  return (
    <div ref={boxRef} className="relative hidden min-[426px]:block flex-1 min-w-0 sm:max-w-[280px]">
      <Search className="w-4 h-4 absolute left-3.5 top-3 text-adm-mute pointer-events-none z-10" />
      <input
        className="adm-input adm-input-search !min-h-[40px] !rounded-full !border-adm-deep/10 pl-9"
        placeholder="Search content"
        aria-label="Search all content"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />
      <AnimatePresence>
        {open && query.trim().length >= 2 && (
          <motion.div {...dropdownMotion} className="adm-pop fixed sm:absolute z-40 top-16 sm:top-12 left-3 right-3 sm:left-auto sm:right-0 sm:w-[420px] max-h-[60vh] overflow-y-auto adm-scroll rounded-[20px] p-2">
            {hits.length === 0 ? (
              <p className="p-4 text-[13px] text-adm-mute text-center">Nothing found for "{query}".</p>
            ) : (
              hits.map((hit, index) => (
                <Link key={index} to={hit.link} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-[12px] hover:bg-adm-deep/[0.05] transition-colors">
                  <span className="block text-[13px] truncate">{hit.title}</span>
                  <span className="block text-[11.5px] text-adm-mute truncate">{hit.group} · {hit.detail}</span>
                </Link>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Where to go to finish an unpublished change. */
const pendingLink = ({ scope, label }: { scope: string; label: string }) => {
  if (scope.startsWith('page:')) return `/admin/pages/${scope.slice(5)}`;
  if (scope === 'global') return '/admin/brand';
  if (scope === 'gallery') return '/admin/gallery';
  if (scope.startsWith('post:') && !label.startsWith('Deleted:')) return `/admin/blog/${scope.slice(5)}`;
  return '/admin/blog';
};

const Notifications: React.FC = () => {
  const state = useCmsState();
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  useOutsideClose(boxRef, () => setOpen(false));

  useEffect(() => {
    const load = () => listEnquiries().then(setEnquiries).catch(() => undefined);
    void load();
    return subscribeSubmissions(() => void load());
  }, []);

  const pending = pendingChanges(state);
  const unread = enquiries.filter((e) => !e.read);
  const notes = [
    ...unread.slice(0, 5).map((e) => ({ id: e.id, text: `New enquiry from ${e.name}`, detail: timeAgo(e.createdAt), to: '/admin/contact' })),
    ...(pending.length ? [{ id: 'pending', text: `${pending.length} item${pending.length > 1 ? 's' : ''} with unpublished changes`, detail: pending.slice(0, 2).map((p) => p.label).join(', '), to: pendingLink(pending[0]) }] : []),
    ...(state.error ? [{ id: 'err', text: 'Storage problem', detail: state.error, to: '/admin/settings' }] : []),
  ];

  return (
    <div ref={boxRef} className="relative">
      <IconBtn label={`Notifications${notes.length ? `, ${notes.length} new` : ''}`} className="adm-round !w-10 !h-10 !text-adm-ink" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Bell className="w-4 h-4" />
        {notes.length > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#C8452F]" />}
      </IconBtn>
      <AnimatePresence>
        {open && (
          <motion.div {...dropdownMotion} className="adm-pop fixed sm:absolute z-40 top-16 sm:top-12 left-3 right-3 sm:left-auto sm:right-0 sm:w-[340px] rounded-[20px] p-2">
            <h4 className="adm-title px-2.5 pt-1.5 pb-2">Notifications</h4>
            {notes.length === 0 ? (
              <p className="p-4 text-[13px] text-adm-mute text-center">You are all caught up.</p>
            ) : (
              notes.map((note) => (
                <Link key={note.id} to={note.to} onClick={() => setOpen(false)} className="block px-2.5 py-2 rounded-[12px] hover:bg-adm-deep/[0.05] transition-colors">
                  <span className="block text-[13px]">{note.text}</span>
                  <span className="block text-[11.5px] text-adm-mute truncate">{note.detail}</span>
                </Link>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileMenu: React.FC = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  useOutsideClose(boxRef, () => setOpen(false));
  const initials = (session?.name ?? 'A').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div ref={boxRef} className="relative shrink-0">
      <button type="button" aria-expanded={open} aria-label="Account menu" onClick={() => setOpen(!open)} className="adm-round flex items-center gap-1.5 min-h-[40px] md:pr-2.5">
        <span className="w-10 h-10 rounded-full bg-adm-deep text-white flex items-center justify-center text-[13px]">{initials}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-adm-mute hidden md:block transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div {...dropdownMotion} className="adm-pop absolute z-40 top-12 right-0 w-64 rounded-[20px] p-1.5">
            <div className="px-2.5 py-2">
              <p className="text-[13.5px] truncate">{session?.name}</p>
              <p className="text-[12px] text-adm-mute truncate mb-2">{session?.email}</p>
              {session?.mode === 'development' ? <Chip tone="amber">Local mode</Chip> : <Chip tone="green">Signed in</Chip>}
              <p className="text-[12px] text-adm-mute mt-1.5 capitalize">Role: {session?.role}</p>
            </div>
            <Link to="/admin/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 px-2.5 min-h-[38px] rounded-[12px] text-[13px] hover:bg-adm-deep/[0.05] transition-colors">
              <Settings className="w-4 h-4" /> Admin settings
            </Link>
            <button
              type="button"
              onClick={() => {
                void signOut();
                navigate('/admin');
              }}
              className="w-full flex items-center gap-2 px-2.5 min-h-[38px] rounded-[12px] text-[13px] hover:bg-adm-deep/[0.05] transition-colors"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuickAction: React.FC = () => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  useOutsideClose(boxRef, () => setOpen(false));
  const links = [
    { to: '/admin/blog?new=1', label: 'New article' },
    { to: '/admin/gallery', label: 'Add gallery images' },
    { to: '/admin/media', label: 'Upload media' },
    { to: '/admin/pages/home', label: 'Edit home page' },
  ];
  return (
    <div ref={boxRef} className="relative mr-2 sm:mr-3.5 shrink-0 max-[425px]:hidden">
      <Btn
        variant="primary"
        className="!rounded-full !min-h-[40px] !px-5 sm:!px-6 min-w-[136px] sm:min-w-[148px]"
        aria-expanded={open}
        icon={<Plus className="w-4 h-4 shrink-0" />}
        onClick={() => setOpen(!open)}
      >
        <span className="hidden lg:inline whitespace-nowrap">Quick action</span>
        <span className="sr-only lg:hidden">Quick action</span>
      </Btn>
      <AnimatePresence>
        {open && (
          <motion.div {...dropdownMotion} className="adm-pop absolute z-40 top-12 right-0 w-52 rounded-[20px] p-1.5">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="block px-2.5 py-2 rounded-[12px] text-[13px] hover:bg-adm-deep/[0.05] transition-colors">
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLElement>(null);
  const lenisRef = useSmoothScroll(scrollRef);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    setDrawerOpen(false);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scrollRef.current?.firstElementChild?.animate([{ transform: 'translateY(8px)' }, { transform: 'none' }], { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    }
  }, [pathname]);

  const toggle = () => {
    setCollapsed((current) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, current ? '0' : '1');
      } catch {
        // The sidebar preference is optional.
      }
      return !current;
    });
  };

  return (
    <div className="admin-root h-[100dvh] adm-env overflow-hidden">
      <div className="adm-shell h-full flex lg:gap-5 lg:pl-5 lg:py-5">
        {/* Mobile drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-adm-deeper/45 backdrop-blur-[3px]" onClick={() => setDrawerOpen(false)} />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="adm-pop absolute left-0 top-0 bottom-0 w-[260px] max-w-[85vw] rounded-r-[28px]"
              >
                <IconBtn label="Close menu" className="absolute right-2 top-3 z-10" onClick={() => setDrawerOpen(false)}><X className="w-4 h-4" /></IconBtn>
                <Sidebar collapsed={false} onNavigate={() => setDrawerOpen(false)} />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <aside className={`adm-glass hidden lg:block shrink-0 transition-[width] duration-200 ${collapsed ? 'w-[68px]' : 'w-[232px]'}`}>
          <Sidebar collapsed={collapsed} onToggle={toggle} />
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="relative z-30 shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 lg:pl-0 lg:pr-6 pt-3 sm:pt-4 lg:pt-0 pb-3 lg:pb-4">
            <IconBtn label="Open menu" className="lg:hidden adm-round !w-10 !h-10 !text-adm-ink" onClick={() => setDrawerOpen(true)}><Menu className="w-5 h-5" /></IconBtn>
            <Link to="/admin" aria-label="KNOWZA admin home" className="shrink-0 lg:hidden">
              <img src="https://res.cloudinary.com/mg4ku51f/image/upload/v1793760161/knowza/images/logo/knowza-mark-dark.png" alt="KNOWZA" className="h-9 w-9 object-contain sm:hidden" />
              <img src="https://res.cloudinary.com/mg4ku51f/image/upload/v1793760157/knowza/images/logo/knowza-logo-horizontal-dark.png" alt="KNOWZA" className="h-7 w-auto hidden sm:block" />
            </Link>
            <div className="flex-1 min-w-0 flex justify-end xl:justify-center">
              <TopNav />
            </div>
            <SearchBox />
            <a href="/?cmsPreview=draft" target="_blank" rel="noreferrer" aria-label="Preview the draft website" title="Preview the draft website" className="adm-round hidden sm:inline-flex items-center justify-center w-10 h-10 text-adm-ink shrink-0">
              <ExternalLink className="w-4 h-4" />
            </a>
            <Notifications />
            <QuickAction />
            <ProfileMenu />
          </header>

          <div className="relative flex-1 min-h-0 flex px-2.5 sm:px-4 lg:pl-0 lg:pr-5 pb-3 sm:pb-4 lg:pb-0">
            <main ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden adm-scroll rounded-[24px] px-1 sm:px-1.5 pb-1">
              <div>
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
