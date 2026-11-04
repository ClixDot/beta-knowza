import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Reorder, useDragControls } from 'framer-motion';
import { ArrowLeft, Bold, Calendar, Copy, Eye, EyeOff, GripVertical, Heading2, Image as ImageIcon, Italic, Link2, Newspaper, Plus, Quote, Save, Search, Star, Trash2, Type, Upload } from 'lucide-react';
import { Btn, Card, Chip, EmptyState, IconBtn, Modal, PageHeader, Select, Tabs, Toggle, useFeedback, type ChipTone } from '../components/ui';
import { FieldShell, FormRenderer, ImageInput, TextInput } from '../editors/FormRenderer';
import { PreviewModal } from '../editors/PreviewModal';
import { SaveIndicator } from '../components/PublishBar';
import { isPostLive } from '../../cms/hooks/useSiteContent';
import { canEdit, canPublish, useSession } from '../../cms/services/auth';
import { logActivity } from '../../cms/services/activity';
import { flushDraft, publishBlogCategories, publishPost, removeLivePost, resolveThumb, saveDraft, updateDraft, useCmsState } from '../../cms/services/cmsStore';
import type { ArticleBlock, BlogCategoryDoc, BlogPostDoc } from '../../cms/types';
import { clone, slugify, uid } from '../../cms/utils';
import { f } from '../../cms/schemas/fields';

const statusChip = (post: BlogPostDoc): { tone: ChipTone; label: string } => {
  if (post.status === 'published') return { tone: 'green', label: 'Published' };
  if (post.status === 'scheduled') return isPostLive(post) ? { tone: 'green', label: 'Published (scheduled)' } : { tone: 'amber', label: 'Scheduled' };
  return { tone: 'neutral', label: 'Draft' };
};

const updatePost = (id: string, patch: Partial<BlogPostDoc>, title?: string) =>
  updateDraft(
    (d) => ({ ...d, blog: { ...d.blog, posts: d.blog.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)) } }),
    title ?? 'Article'
  );

const createPost = (categories: BlogCategoryDoc[], author: string): BlogPostDoc => {
  const id = uid('post');
  const now = new Date();
  return {
    id,
    slug: `new-article-${id.slice(-5)}`,
    title: 'Untitled article',
    category: categories[0]?.name ?? 'Nature',
    author,
    date: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase(),
    readTime: '5 MIN READ',
    coverImage: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760150/knowza/images/gallery/courtyard.jpg',
    coverAlt: '',
    excerpt: '',
    introduction: '',
    body: [{ id: uid('b'), type: 'paragraph', text: '' }],
    relatedSlugs: [],
    status: 'draft',
    publishAt: '',
    featured: false,
    seo: { title: '', description: '', image: '' },
  };
};

const BlogList: React.FC = () => {
  const { draft, published } = useCmsState();
  const session = useSession();
  const editable = canEdit(session?.role);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { confirm, run, toast } = useFeedback();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('articles');
  const [filter, setFilter] = useState('all');
  const { posts, categories } = draft.blog;

  const newPost = () => {
    const post = createPost(categories, 'Knowza Curators');
    updateDraft((d) => ({ ...d, blog: { ...d.blog, posts: [post, ...d.blog.posts] } }), 'New article');
    navigate(`/admin/blog/${post.id}`);
  };

  useEffect(() => {
    if (params.get('new') === '1' && editable) {
      params.delete('new');
      setParams(params, { replace: true });
      newPost();
    }
  }, []);

  const shown = posts.filter((post) => {
    if (filter !== 'all' && post.status !== filter) return false;
    const needle = query.trim().toLowerCase();
    return !needle || post.title.toLowerCase().includes(needle) || post.category.toLowerCase().includes(needle);
  });

  const duplicate = (post: BlogPostDoc) => {
    const copyId = uid('post');
    const copy: BlogPostDoc = { ...clone(post), id: copyId, slug: `${post.slug}-copy-${copyId.slice(-4)}`, title: `${post.title} (copy)`, status: 'draft', featured: false, publishAt: '' };
    updateDraft((d) => {
      const list = [...d.blog.posts];
      list.splice(list.findIndex((p) => p.id === post.id) + 1, 0, copy);
      return { ...d, blog: { ...d.blog, posts: list } };
    }, `Duplicated ${post.title}`);
  };

  const remove = async (post: BlogPostDoc) => {
    const live = published.blog.posts.some((p) => p.id === post.id);
    if (live && !canPublish(session?.role)) {
      toast('This article is live, so only an admin can delete it.', 'error');
      return;
    }
    const ok = await confirm({ title: `Delete "${post.title}"?`, text: live ? 'It will also be removed from the live website straight away.' : 'This article has not been published.', confirmLabel: 'Delete article', danger: true });
    if (!ok) return;
    await run(async () => {
      updateDraft((d) => ({ ...d, blog: { ...d.blog, posts: d.blog.posts.filter((p) => p.id !== post.id) } }), `Deleted ${post.title}`);
      if (live && canPublish(session?.role)) await removeLivePost(post.id);
      await logActivity('deleted', post.title);
    }, 'Article deleted.');
  };

  const setFeatured = (post: BlogPostDoc) =>
    updateDraft(
      (d) => ({ ...d, blog: { ...d.blog, posts: d.blog.posts.map((p) => ({ ...p, featured: p.id === post.id ? !post.featured : false })) } }),
      `Featured ${post.title}`
    );

  return (
    <div>
      <PageHeader
        title="Blog & Journal"
        subtitle="Write, schedule and publish articles. Listing text and the newsletter are edited on the Blog page."
        actions={
          <>
            <Link to="/admin/pages/blog" className="inline-flex items-center min-h-[42px] px-4 rounded-full border border-adm-deep/10 bg-white text-sm hover:bg-adm-deep/[0.05] transition-colors">Edit listing page</Link>
            <Btn variant="primary" disabled={!editable} icon={<Plus className="w-4 h-4" />} onClick={newPost}>New article</Btn>
          </>
        }
      />
      <Tabs active={tab} onChange={setTab} tabs={[{ id: 'articles', label: 'Articles', count: posts.length }, { id: 'categories', label: 'Categories', count: categories.length }]} />

      {tab === 'categories' ? (
        <Card className="p-4 sm:p-5 max-w-3xl">
          <FormRenderer
            fields={[
              f.list('categories', 'Categories', 'category', (c) => c.name || 'Category', [f.text('name', 'Name'), f.area('description', 'Description', { help: 'Shown above the articles when this category is selected.' }), f.toggle('enabled', 'Show as a filter')], {
                newItem: () => ({ id: uid('bcat'), name: 'New Category', description: '', enabled: true }),
              }),
            ]}
            value={{ categories }}
            onChange={(next) => updateDraft((d) => ({ ...d, blog: { ...d.blog, categories: next.categories } }), 'Blog categories')}
          />
          <Btn className="mt-4" variant="primary" disabled={!canPublish(session?.role)} onClick={() => run(publishBlogCategories, 'Categories published.')}>Publish categories</Btn>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-adm-mute" />
              <input className="adm-input pl-9" placeholder="Search articles" aria-label="Search articles" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Select className="adm-input sm:w-44" aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
          <Card>
            {shown.length === 0 ? (
              <EmptyState icon={<Newspaper className="w-5 h-5" />} title="No articles found" text="Change the filter or write a new article." />
            ) : (
              <ul className="divide-y divide-adm-line">
                {shown.map((post) => {
                  const chip = statusChip(post);
                  const changed = post.status !== 'draft' && JSON.stringify(post) !== JSON.stringify(published.blog.posts.find((p) => p.id === post.id));
                  return (
                    <li key={post.id} className="flex items-center gap-3 p-3 sm:px-4 first:rounded-t-[24px] last:rounded-b-[24px] hover:bg-adm-deep/[0.05] transition-colors">
                      <img src={resolveThumb(post.coverImage, 160)} alt="" loading="lazy" className="hidden xs:block w-16 h-12 rounded-[12px] object-cover bg-adm-panel shrink-0" />
                      <Link to={`/admin/blog/${post.id}`} className="flex-1 min-w-0 group">
                        <span className="block text-[14px] truncate group-hover:underline underline-offset-2">{post.title}</span>
                        <span className="flex flex-wrap items-center gap-1.5 mt-1 text-[12px] text-adm-mute">
                          <Chip tone={chip.tone}>{chip.label}</Chip>
                          {changed && <Chip tone="amber">Unpublished edits</Chip>}
                          {post.category} · {post.date}
                        </span>
                      </Link>
                      <IconBtn label={post.featured ? 'Remove from featured' : 'Feature this article'} tone={post.featured ? 'active' : 'default'} disabled={!editable} onClick={() => setFeatured(post)}>
                        <Star className="w-4 h-4" fill={post.featured ? 'currentColor' : 'none'} />
                      </IconBtn>
                      <IconBtn label={`Duplicate ${post.title}`} disabled={!editable} onClick={() => duplicate(post)}><Copy className="w-4 h-4" /></IconBtn>
                      <IconBtn label={`Delete ${post.title}`} tone="danger" disabled={!editable} onClick={() => remove(post)}><Trash2 className="w-4 h-4" /></IconBtn>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

const ParagraphEditor: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const wrap = (before: string, after = before, fallback = 'text') => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e) || fallback;
    onChange(`${value.slice(0, s)}${before}${selected}${after}${value.slice(e)}`);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  };
  return (
    <div>
      <div className="flex items-center gap-0.5 mb-1" role="toolbar" aria-label="Text formatting">
        <IconBtn label="Bold" onClick={() => wrap('**')}><Bold className="w-4 h-4" /></IconBtn>
        <IconBtn label="Italic" onClick={() => wrap('*')}><Italic className="w-4 h-4" /></IconBtn>
        <IconBtn label="Link" onClick={() => wrap('[', '](https://)', 'link text')}><Link2 className="w-4 h-4" /></IconBtn>
      </div>
      <textarea ref={ref} className="adm-input resize-y" aria-label="Paragraph text" placeholder="Write a paragraph…" rows={Math.min(10, Math.max(3, Math.ceil(value.length / 80)))} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

const BlockRow: React.FC<{ block: ArticleBlock; onChange: (b: ArticleBlock) => void; onDelete: () => void; onMove: (d: number) => void }> = ({ block, onChange, onDelete, onMove }) => {
  const controls = useDragControls();
  const names = { paragraph: 'Paragraph', heading: 'Heading', image: 'Image', quote: 'Pull quote' };
  return (
    <Reorder.Item value={block} dragListener={false} dragControls={controls} layout="position" className="adm-tile">
      <div className="flex items-center gap-1 px-1 pt-1">
        <button
          type="button"
          aria-label={`Reorder ${names[block.type]}. Use the arrow keys to move.`}
          className="w-8 h-8 flex items-center justify-center text-adm-mute cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={(e) => controls.start(e)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') { e.preventDefault(); onMove(-1); }
            if (e.key === 'ArrowDown') { e.preventDefault(); onMove(1); }
          }}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="flex-1 text-[12px] text-adm-mute">{names[block.type]}</span>
        <IconBtn label={`Delete ${names[block.type]}`} tone="danger" onClick={onDelete}><Trash2 className="w-4 h-4" /></IconBtn>
      </div>
      <div className="px-3 pb-3">
        {block.type === 'paragraph' && <ParagraphEditor value={block.text} onChange={(text) => onChange({ ...block, text })} />}
        {block.type === 'heading' && (
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input className="adm-input" aria-label="Heading text" value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
            <Select className="adm-input" aria-label="Heading level" value={block.level} onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 2 | 3 })}>
              <option value={2}>Large</option>
              <option value={3}>Small</option>
            </Select>
          </div>
        )}
        {block.type === 'image' && (
          <div className="space-y-2">
            <ImageInput label="Image" value={{ src: block.src, alt: block.alt }} onChange={(v) => onChange({ ...block, src: v.src, alt: v.alt })} />
            <TextInput label="Caption" value={block.caption} onChange={(caption) => onChange({ ...block, caption })} />
          </div>
        )}
        {block.type === 'quote' && (
          <div className="space-y-2">
            <TextInput multiline label="Quote" value={block.text} onChange={(text) => onChange({ ...block, text })} />
            <TextInput label="Attribution" value={block.author} onChange={(author) => onChange({ ...block, author })} />
          </div>
        )}
      </div>
    </Reorder.Item>
  );
};

const toLocalInput = (iso: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const PostEditor: React.FC<{ post: BlogPostDoc }> = ({ post }) => {
  const { draft, published } = useCmsState();
  const session = useSession();
  const editable = canEdit(session?.role);
  const publishable = canPublish(session?.role);
  const { run, confirm, toast } = useFeedback();
  const [previewing, setPreviewing] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [when, setWhen] = useState(toLocalInput(post.publishAt));
  const set = (patch: Partial<BlogPostDoc>) => updatePost(post.id, patch, post.title);

  const slugTaken = draft.blog.posts.some((p) => p.id !== post.id && p.slug === post.slug);
  const slugValid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug);
  const slugError = !slugValid ? 'Use lowercase letters, numbers and hyphens.' : slugTaken ? 'Another article already uses this slug.' : undefined;
  const live = published.blog.posts.find((p) => p.id === post.id);
  const changed = JSON.stringify(live) !== JSON.stringify(post);
  const chip = statusChip(post);

  const setBody = (body: ArticleBlock[]) => set({ body });
  const addBlock = (block: ArticleBlock) => setBody([...post.body, block]);

  const guard = () => {
    if (slugError) {
      toast(`Fix the slug first. ${slugError}`, 'error');
      return false;
    }
    if (!post.title.trim()) {
      toast('Add a title first.', 'error');
      return false;
    }
    return true;
  };

  const publish = async () => {
    if (!guard()) return;
    const ok = await confirm({ title: 'Publish this article?', text: 'It becomes visible on the public blog straight away.', confirmLabel: 'Publish' });
    if (!ok) return;
    await run(async () => {
      updatePost(post.id, { status: 'published', publishAt: '' }, post.title);
      await publishPost(post.id);
    }, 'Article published.');
  };

  const schedule = async () => {
    if (!guard()) return;
    const at = new Date(when);
    if (!when || Number.isNaN(at.getTime()) || at.getTime() <= Date.now()) {
      toast('Choose a date and time in the future.', 'error');
      return;
    }
    await run(async () => {
      updatePost(post.id, { status: 'scheduled', publishAt: at.toISOString() }, post.title);
      await publishPost(post.id);
    }, `Scheduled for ${at.toLocaleString()}.`);
    setScheduling(false);
  };

  const unpublish = async () => {
    const ok = await confirm({ title: 'Unpublish this article?', text: 'Visitors will no longer see it. It stays here as a draft.', confirmLabel: 'Unpublish', danger: true });
    if (!ok) return;
    await run(async () => {
      updatePost(post.id, { status: 'draft', publishAt: '' }, post.title);
      await publishPost(post.id);
      await logActivity('unpublished', post.title);
    }, 'Article unpublished.');
  };

  return (
    <div>
      <PageHeader
        title={post.title || 'Untitled article'}
        back={
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <Link to="/admin/blog" className="inline-flex items-center gap-1.5 text-[13px] text-adm-mute hover:text-adm-ink font-medium transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> All articles
            </Link>
            <span className="text-adm-deep/20 text-xs">•</span>
            <Chip tone={chip.tone}>{chip.label}</Chip>
            <span className="text-adm-deep/20 text-xs">•</span>
            <SaveIndicator />
            {post.status === 'scheduled' && (
              <>
                <span className="text-adm-deep/20 text-xs">•</span>
                <span className="text-[12px] text-adm-mute font-medium">{new Date(post.publishAt).toLocaleString()}</span>
              </>
            )}
          </div>
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Btn size="sm" icon={<Eye className="w-3.5 h-3.5" />} onClick={async () => { await flushDraft().catch(() => undefined); setPreviewing(true); }}>
              Preview
            </Btn>
            <Btn size="sm" icon={<Save className="w-3.5 h-3.5" />} disabled={!editable} onClick={() => run(() => saveDraft(`Saved article: ${post.title}`), 'Draft saved.')}>
              Save draft
            </Btn>
            {post.status !== 'draft' && (
              <Btn size="sm" variant="danger" icon={<EyeOff className="w-3.5 h-3.5" />} disabled={!publishable} onClick={unpublish}>
                Unpublish
              </Btn>
            )}
            <Btn size="sm" disabled={!publishable} icon={<Calendar className="w-3.5 h-3.5" />} onClick={() => setScheduling(true)}>
              Schedule
            </Btn>
            <Btn size="sm" variant="primary" disabled={!publishable || (post.status === 'published' && !changed)} icon={<Upload className="w-3.5 h-3.5" />} onClick={publish}>
              {post.status === 'published' ? 'Publish changes' : 'Publish'}
            </Btn>
          </div>
        }
      />

      <fieldset disabled={!editable} className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          <Card className="p-4 sm:p-5 space-y-3.5">
            <TextInput label="Article title" value={post.title} onChange={(title) => set({ title })} />
            <TextInput multiline label="Excerpt" value={post.excerpt} onChange={(excerpt) => set({ excerpt })} help="Shown on article cards." />
            <TextInput multiline label="Article introduction" value={post.introduction} onChange={(introduction) => set({ introduction })} help="The italic standfirst at the top of the article." />
          </Card>

          <Card className="p-4 sm:p-5">
            <h4 className="adm-title mb-1">Article body</h4>
            <p className="text-[12px] text-adm-mute mb-3">Select text and use the toolbar for bold, italic and links. Drag the handles to reorder.</p>
            {post.body.length === 0 && <EmptyState title="The article is empty" text="Add a paragraph to begin." />}
            <Reorder.Group axis="y" values={post.body} onReorder={setBody} className="space-y-2">
              {post.body.map((block, index) => (
                <BlockRow
                  key={block.id}
                  block={block}
                  onChange={(next) => setBody(post.body.map((b) => (b.id === block.id ? next : b)))}
                  onDelete={() => setBody(post.body.filter((b) => b.id !== block.id))}
                  onMove={(delta) => {
                    const target = index + delta;
                    if (target < 0 || target >= post.body.length) return;
                    const next = [...post.body];
                    next.splice(target, 0, next.splice(index, 1)[0]);
                    setBody(next);
                  }}
                />
              ))}
            </Reorder.Group>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <Btn size="sm" icon={<Type className="w-4 h-4" />} onClick={() => addBlock({ id: uid('b'), type: 'paragraph', text: '' })}>Paragraph</Btn>
              <Btn size="sm" icon={<Heading2 className="w-4 h-4" />} onClick={() => addBlock({ id: uid('b'), type: 'heading', text: 'New heading', level: 2 })}>Heading</Btn>
              <Btn size="sm" icon={<ImageIcon className="w-4 h-4" />} onClick={() => addBlock({ id: uid('b'), type: 'image', src: '', alt: '', caption: '' })}>Image</Btn>
              <Btn size="sm" icon={<Quote className="w-4 h-4" />} onClick={() => addBlock({ id: uid('b'), type: 'quote', text: 'A memorable line.', author: '' })}>Pull quote</Btn>
            </div>
          </Card>
        </div>

        <div className="space-y-3 min-w-0">
          <Card className="p-4 space-y-3.5">
            <ImageInput label="Cover image" value={{ src: post.coverImage, alt: post.coverAlt }} onChange={(v) => set({ coverImage: v.src, coverAlt: v.alt })} />
            <FieldShell label="Category">
              <Select className="adm-input" value={post.category} onChange={(e) => set({ category: e.target.value })}>
                {!draft.blog.categories.some((c) => c.name === post.category) && <option value={post.category}>{post.category}</option>}
                {draft.blog.categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </Select>
            </FieldShell>
            <TextInput label="Author" value={post.author} onChange={(author) => set({ author })} />
            <div className="grid grid-cols-2 gap-2">
              <TextInput label="Date label" value={post.date} onChange={(date) => set({ date })} />
              <TextInput label="Read time" value={post.readTime} onChange={(readTime) => set({ readTime })} />
            </div>
            <div>
              <TextInput label="Slug" value={post.slug} onChange={(slug) => set({ slug })} error={slugError} help={`/blog/${post.slug}`} />
              <Btn size="sm" variant="ghost" className="mt-1" onClick={() => set({ slug: slugify(post.title) })}>Generate from title</Btn>
            </div>
            <Toggle label="Featured on the blog page" checked={post.featured} onChange={(featured) => updateDraft((d) => ({ ...d, blog: { ...d.blog, posts: d.blog.posts.map((p) => ({ ...p, featured: p.id === post.id ? featured : featured ? false : p.featured })) } }), post.title)} />
          </Card>

          <Card className="p-4">
            <h4 className="adm-title mb-2">Related articles</h4>
            <ul className="space-y-1.5">
              {draft.blog.posts.filter((p) => p.id !== post.id).map((other) => (
                <li key={other.id}>
                  <label className="flex items-start gap-2 text-[13px] cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 accent-[#79864B]"
                      checked={post.relatedSlugs.includes(other.slug)}
                      onChange={(e) => set({ relatedSlugs: e.target.checked ? [...post.relatedSlugs, other.slug] : post.relatedSlugs.filter((s) => s !== other.slug) })}
                    />
                    <span>{other.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 space-y-3.5">
            <h4 className="adm-title">SEO &amp; sharing</h4>
            <TextInput label="SEO title" value={post.seo.title} onChange={(title) => set({ seo: { ...post.seo, title } })} help={`${post.seo.title.length}/60 characters. Empty uses the site default.`} />
            <TextInput multiline label="SEO description" value={post.seo.description} onChange={(description) => set({ seo: { ...post.seo, description } })} help={`${post.seo.description.length}/160 characters.`} />
            <ImageInput noAlt label="Social sharing image" value={{ src: post.seo.image, alt: '' }} onChange={(v) => set({ seo: { ...post.seo, image: v.src } })} />
          </Card>
        </div>
      </fieldset>

      <PreviewModal open={previewing} onClose={() => setPreviewing(false)} path={post.status === 'draft' ? `/blog/${post.slug}` : `/blog/${post.slug}`} />
      <Modal
        open={scheduling}
        onClose={() => setScheduling(false)}
        title="Schedule publishing"
        size="sm"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setScheduling(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={schedule}>Schedule</Btn>
          </>
        }
      >
        <TextInput type="datetime-local" label="Go live at" value={when} onChange={setWhen} help="The article appears to visitors from this time onward." />
      </Modal>
    </div>
  );
};

export const BlogEditor: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { draft } = useCmsState();
  if (!postId) return <BlogList />;
  const post = draft.blog.posts.find((p) => p.id === postId);
  if (!post) {
    return (
      <EmptyState
        icon={<Newspaper className="w-5 h-5" />}
        title="Article not found"
        text="It may have been deleted."
        action={<Link to="/admin/blog" className="underline underline-offset-2 text-[13px]">Back to all articles</Link>}
      />
    );
  }
  return <PostEditor post={post} />;
};
