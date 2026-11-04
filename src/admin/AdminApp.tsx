import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, ShieldAlert } from 'lucide-react';
import './admin.css';
import { MotionConfig } from 'framer-motion';
import { attachPressFeedback } from './components/interactions';
import { AdminLayout } from './layouts/AdminLayout';
import { Btn, EmptyState, FeedbackProvider, Select, Skeleton } from './components/ui';
import { FieldShell, TextInput } from './editors/FormRenderer';
import { SectionBuilder } from './editors/SectionBuilder';
import { BlogEditor } from './pages/BlogEditor';
import { DashboardPage } from './pages/DashboardPage';
import { GalleryEditor } from './pages/GalleryEditor';
import { MediaLibrary } from './pages/MediaLibrary';
import { PagesManagement, SectionsOverview } from './pages/PagesManagement';
import { AdminSettings, ContactEditor, GlobalSettingsPage, SocialMediaEditor } from './pages/SiteSettingsPages';
import { HomePageEditor } from './pages/HomePageEditor';
import { AboutPageEditor } from './pages/AboutPageEditor';
import { devSignIn, isDevAuthAvailable, restoreSession, signIn, useSession, type AdminRole } from '../cms/services/auth';
import { bootCms, useCmsState } from '../cms/services/cmsStore';
import type { PageId } from '../cms/types';

const FONT_HREFS = [
  'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap',
  'https://fonts.googleapis.com/css2?family=Urbanist:wght@500;600;700&display=swap',
];

const SIGNIN_PHOTO = 'https://res.cloudinary.com/mg4ku51f/image/upload/f_auto,q_auto,w_1200,c_limit/v1793760156/knowza/images/hero/hero-sanctuary.jpg';
const SIGNIN_LOGO = 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760157/knowza/images/logo/knowza-logo-dark.png';

const SignInFrame: React.FC<{ subtitle: string; onSubmit: React.FormEventHandler<HTMLFormElement>; children: React.ReactNode }> = ({ subtitle, onSubmit, children }) => (
  <div className="admin-root adm-shell-signin min-h-[100dvh] flex items-center justify-center p-4 sm:p-6">
    <div className="adm-signin-card w-full max-w-[1140px] grid md:grid-cols-[minmax(0,47fr)_minmax(0,53fr)] p-3 sm:p-4">
      <aside className="adm-signin-panel hidden md:flex flex-col p-8 lg:p-11">
        <img src={SIGNIN_PHOTO} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-[27%_center]" />
        <div className="adm-signin-scrim absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <p className="adm-signin-eyebrow">KNOWZA · Admin</p>
          <p className="adm-signin-headline mt-4">
            Tend the sanctuary from <span className="relative inline-block whitespace-nowrap">one place.
              <svg className="absolute left-0 -bottom-2 w-full h-2" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 5.5C48 2.5 132 1.8 198 4.2" fill="none" stroke="#EEE9BF" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            </span>
          </p>
          <p className="adm-signin-lede mt-6 max-w-[38ch]">Pages, journal, gallery and media, kept together for the KNOWZA team.</p>
        </div>
      </aside>

      <form onSubmit={onSubmit} className="flex flex-col justify-center px-3 py-8 sm:px-8 md:px-10 lg:px-16 md:min-h-[600px]">
        <div className="w-full max-w-[400px] mx-auto">
          <img src={SIGNIN_LOGO} alt="KNOWZA" className="h-[84px] w-auto mx-auto mb-5" />
          <h1 className="text-[30px] leading-tight text-center">Sign in to the admin</h1>
          <p className="text-[14px] text-adm-mute text-center mt-1.5 mb-7">{subtitle}</p>
          {children}
        </div>
      </form>
    </div>
  </div>
);

const PasswordInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const id = React.useId();
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;
  return (
    <FieldShell label="Password" htmlFor={id}>
      <div className="relative">
        <input id={id} type={visible ? 'text' : 'password'} autoComplete="current-password" className="adm-input !pr-12" value={value} onChange={(e) => onChange(e.target.value)} />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-1.5 inset-y-0 my-auto w-10 h-10 rounded-full inline-flex items-center justify-center text-adm-mute hover:text-adm-ink transition-colors"
        >
          <Icon className="w-[18px] h-[18px]" />
        </button>
      </div>
    </FieldShell>
  );
};

const ServerSignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <SignInFrame
      subtitle="Use your KNOWZA admin account."
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
          await signIn(email.trim(), password);
        } catch (err) {
          setError((err as Error).message);
          setPassword('');
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="space-y-4">
        <TextInput label="Email" type="email" autoComplete="username" value={email} onChange={setEmail} />
        <PasswordInput value={password} onChange={setPassword} />
      </div>
      {error && <p role="alert" className="flex items-start gap-2 text-[13px] text-[#9F3424] mt-3"><Lock className="w-4 h-4 mt-0.5 shrink-0" />{error}</p>}
      <Btn type="submit" variant="primary" className="w-full mt-6" busy={busy} disabled={!email || !password}>Sign in</Btn>
    </SignInFrame>
  );
};

const SignIn: React.FC = () => {
  const [name, setName] = useState('Knowza Admin');
  const [email, setEmail] = useState('admin@knowzagroup.com');
  const [role, setRole] = useState<AdminRole>('admin');

  if (!isDevAuthAvailable()) return <ServerSignIn />;

  return (
    <SignInFrame
      subtitle="Choose who to sign in as for this test."
      onSubmit={(e) => {
        e.preventDefault();
        devSignIn(name.trim() || 'Knowza Admin', email.trim(), role);
      }}
    >
      <p className="flex items-start gap-2 text-[13px] text-[#6A5513] bg-[#F5EDC6] border border-[#E8DCA6] rounded-[14px] px-3 py-2.5 mb-4">
        <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
        Local storage mode. There is no password, because this only reaches this browser's own storage.
      </p>
      <div className="space-y-3">
        <TextInput label="Name" value={name} onChange={setName} />
        <TextInput label="Email" type="email" value={email} onChange={setEmail} />
        <FieldShell label="Role to test">
          <Select className="adm-input" value={role} onChange={(e) => setRole(e.target.value as AdminRole)}>
            <option value="admin">Admin: edit and publish</option>
            <option value="editor">Editor: edit drafts only</option>
            <option value="viewer">Viewer: read only</option>
          </Select>
        </FieldShell>
      </div>
      <Btn type="submit" variant="primary" className="w-full mt-6">Enter admin</Btn>
    </SignInFrame>
  );
};

const PageEditorRoute: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const { draft } = useCmsState();
  if (!pageId || !(pageId in draft.pages)) return <EmptyState title="Page not found" text="Choose a page from Page Management." />;
  return <SectionBuilder key={pageId} pageId={pageId as PageId} />;
};

const Loading: React.FC = () => (
  <div className="admin-root h-[100dvh] adm-env">
    <div className="adm-shell h-full p-3 flex gap-3">
      <Skeleton className="hidden lg:block w-[232px] !rounded-[24px]" />
      <div className="flex-1 flex flex-col gap-3">
        <Skeleton className="h-12 !rounded-full" />
        <Skeleton className="flex-1 !rounded-[24px]" />
      </div>
    </div>
  </div>
);

export default function AdminApp() {
  const session = useSession();
  const { ready } = useCmsState();
  const [checkedSession, setCheckedSession] = useState(isDevAuthAvailable());

  useEffect(() => {
    // The draft can only load after sign-in, so the store boots once the session is known.
    if (session) void bootCms();
  }, [session]);

  useEffect(attachPressFeedback, []);

  useEffect(() => {
    restoreSession().catch(() => undefined).finally(() => setCheckedSession(true));
    const links = FONT_HREFS.map((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      return link;
    });
    const previousTitle = document.title;
    document.title = 'KNOWZA Admin';
    return () => {
      links.forEach((link) => link.remove());
      document.title = previousTitle;
    };
  }, []);

  if (!checkedSession) return <Loading />;
  if (!session) return <SignIn />;
  if (!ready) return <Loading />;

  return (
    <MotionConfig reducedMotion="user">
    <FeedbackProvider>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pages" element={<PagesManagement />} />
          <Route path="pages/home" element={<HomePageEditor />} />
          <Route path="pages/about" element={<AboutPageEditor />} />
          <Route path="pages/:pageId" element={<PageEditorRoute />} />
          <Route path="sections" element={<SectionsOverview />} />
          <Route path="blog" element={<BlogEditor />} />
          <Route path="blog/:postId" element={<BlogEditor />} />
          <Route path="gallery" element={<GalleryEditor />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="social" element={<SocialMediaEditor />} />
          <Route path="brand" element={<GlobalSettingsPage />} />
          <Route path="contact" element={<ContactEditor />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </FeedbackProvider>
    </MotionConfig>
  );
}
