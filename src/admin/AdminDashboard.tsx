import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { portfolioDataToFirestoreSeed, defaultSiteTheme } from '../lib/dataTransform'
import { serviceIconOptions } from '../lib/iconMap'
import {
  fetchAbout,
  fetchAnalytics,
  fetchChatSummaries,
  fetchContactSubmissions,
  fetchHeroContent,
  fetchProjects,
  fetchServices,
  fetchSiteTheme,
  fetchSkills,
  markContactAsRead,
  saveAbout,
  saveHeroContent,
  saveProjects,
  saveServices,
  saveSiteTheme,
  saveSkills,
  seedDefaultContent,
  uploadFile,
} from '../services/firestore'
import type {
  AnalyticsData,
  ChatSummary,
  ContactSubmission,
  FirestoreAbout,
  FirestoreHeroContent,
  FirestoreProjectItem,
  FirestoreServiceItem,
  FirestoreSiteTheme,
  FirestoreSkillItem,
} from '../types/firestore'

type TabId =
  | 'overview'
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'services'
  | 'theme'
  | 'contacts'
  | 'chats'

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'theme', label: 'Theme' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'chats', label: 'Chat Logs' },
]

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function AdminDashboard() {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const [hero, setHero] = useState<FirestoreHeroContent | null>(null)
  const [about, setAbout] = useState<FirestoreAbout | null>(null)
  const [skills, setSkills] = useState<FirestoreSkillItem[]>([])
  const [projects, setProjects] = useState<FirestoreProjectItem[]>([])
  const [services, setServices] = useState<FirestoreServiceItem[]>([])
  const [theme, setTheme] = useState<FirestoreSiteTheme | null>(null)
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [chats, setChats] = useState<ChatSummary[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData>({ visitorCount: 0, lastUpdated: null })
  const [selectedChat, setSelectedChat] = useState<ChatSummary | null>(null)

  const featuredCount = useMemo(
    () => projects.filter((project) => project.featured && !project.comingSoon).length,
    [projects],
  )

  const loadAll = async () => {
    const [
      heroData,
      aboutData,
      skillsData,
      projectsData,
      servicesData,
      themeData,
      contactsData,
      chatsData,
      analyticsData,
    ] = await Promise.all([
      fetchHeroContent(),
      fetchAbout(),
      fetchSkills(),
      fetchProjects(),
      fetchServices(),
      fetchSiteTheme(),
      fetchContactSubmissions(),
      fetchChatSummaries(),
      fetchAnalytics(),
    ])

    setHero(heroData)
    setAbout(aboutData)
    setSkills(skillsData)
    setProjects(projectsData)
    setServices(servicesData)
    setTheme(themeData ?? defaultSiteTheme)
    setContacts(contactsData)
    setChats(chatsData)
    setAnalytics(analyticsData)
  }

  useEffect(() => {
    void loadAll()
  }, [])

  const showStatus = (message: string) => {
    setStatus(message)
    window.setTimeout(() => setStatus(''), 3000)
  }

  const handleSeed = async () => {
    setSaving(true)
    try {
      const seed = portfolioDataToFirestoreSeed()
      await seedDefaultContent(seed)
      await loadAll()
      showStatus('Default portfolio content seeded successfully.')
    } catch (error) {
      showStatus(error instanceof Error ? error.message : 'Seed failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (file: File) => {
    if (!hero) return
    setSaving(true)
    try {
      const url = await uploadFile(`resume/${file.name}`, file)
      const updated = { ...hero, resumeUrl: url }
      await saveHeroContent(updated)
      setHero(updated)
      showStatus('Resume uploaded.')
    } catch (error) {
      showStatus(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleProfileUpload = async (file: File) => {
    if (!hero) return
    setSaving(true)
    try {
      const url = await uploadFile(`profile/${file.name}`, file)
      const updated = { ...hero, profileImageUrl: url }
      await saveHeroContent(updated)
      setHero(updated)
      showStatus('Profile image uploaded.')
    } catch (error) {
      showStatus(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setSaving(false)
    }
  }

  const toggleFeatured = (id: string) => {
    setProjects((current) => {
      const target = current.find((p) => p.id === id)
      if (!target) return current

      const currentlyFeatured = current.filter((p) => p.featured && !p.comingSoon).length
      if (!target.featured && currentlyFeatured >= 4) {
        showStatus('Maximum 4 featured projects allowed.')
        return current
      }

      return current.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">Portfolio CMS</p>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-slate-400 hover:text-emerald-400">
              View Site
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-emerald-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
          <nav className="grid gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-3 text-left text-sm transition ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          {status ? (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {status}
            </div>
          ) : null}

          {activeTab === 'overview' ? (
            <section className="grid gap-4 md:grid-cols-3">
              <StatCard label="Visitor Count" value={String(analytics.visitorCount)} />
              <StatCard label="Contact Submissions" value={String(contacts.length)} />
              <StatCard label="Chat Summaries" value={String(chats.length)} />
              <div className="md:col-span-3 rounded-xl border border-slate-800 bg-slate-950 p-5">
                <h2 className="text-lg font-semibold">Quick Actions</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Initialize Firestore with default portfolio content if this is your first setup.
                </p>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSeed()}
                  className="mt-4 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
                >
                  Seed Default Content
                </button>
              </div>
            </section>
          ) : null}

          {activeTab === 'hero' ? (
            hero ? (
            <section className="grid gap-4">
              <Field label="Name" value={hero.name} onChange={(v) => setHero({ ...hero, name: v })} />
              <Field label="Tagline" value={hero.tagline} onChange={(v) => setHero({ ...hero, tagline: v })} />
              <TextArea
                label="Summary"
                value={hero.summary}
                onChange={(v) => setHero({ ...hero, summary: v })}
              />
              <Field
                label="Resume URL"
                value={hero.resumeUrl}
                onChange={(v) => setHero({ ...hero, resumeUrl: v })}
              />
              <Field
                label="Profile Image URL"
                value={hero.profileImageUrl ?? ''}
                onChange={(v) => setHero({ ...hero, profileImageUrl: v })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <FileUpload label="Upload Resume PDF" accept=".pdf" onUpload={handleResumeUpload} />
                <FileUpload label="Upload Profile Image" accept="image/*" onUpload={handleProfileUpload} />
              </div>
              <SaveButton
                saving={saving}
                onClick={async () => {
                  setSaving(true)
                  try {
                    await saveHeroContent(hero)
                    showStatus('Hero content saved.')
                  } finally {
                    setSaving(false)
                  }
                }}
              />
            </section>
            ) : (
              <EmptyState message="No hero content yet. Seed default content from Overview." />
            )
          ) : null}

          {activeTab === 'about' ? (
            about ? (
            <section className="grid gap-4">
              <TextArea label="Bio" value={about.bio} onChange={(v) => setAbout({ ...about, bio: v })} />
              <div>
                <p className="mb-2 text-sm text-slate-300">Highlights (comma-separated)</p>
                <input
                  value={about.highlights.map((h) => h.label).join(', ')}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      highlights: e.target.value
                        .split(',')
                        .map((label) => label.trim())
                        .filter(Boolean)
                        .map((label) => ({ label })),
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                />
              </div>
              <SaveButton
                saving={saving}
                onClick={async () => {
                  setSaving(true)
                  try {
                    await saveAbout(about)
                    showStatus('About section saved.')
                  } finally {
                    setSaving(false)
                  }
                }}
              />
            </section>
            ) : (
              <EmptyState message="No about content yet. Seed default content from Overview." />
            )
          ) : null}

          {activeTab === 'skills' ? (
            <section className="grid gap-4">
              {skills.map((skill, index) => (
                <div key={skill.id} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 md:grid-cols-4">
                  <Field
                    label="Category"
                    value={skill.category}
                    onChange={(v) =>
                      setSkills((current) =>
                        current.map((s, i) => (i === index ? { ...s, category: v } : s)),
                      )
                    }
                  />
                  <Field
                    label="Name"
                    value={skill.name}
                    onChange={(v) =>
                      setSkills((current) =>
                        current.map((s, i) => (i === index ? { ...s, name: v } : s)),
                      )
                    }
                  />
                  <Field
                    label="Percentage"
                    value={String(skill.percentage)}
                    onChange={(v) =>
                      setSkills((current) =>
                        current.map((s, i) =>
                          i === index ? { ...s, percentage: Number(v) || 0 } : s,
                        ),
                      )
                    }
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => setSkills((current) => current.filter((s) => s.id !== skill.id))}
                      className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setSkills((current) => [
                    ...current,
                    {
                      id: createId('skill'),
                      category: 'New Category',
                      name: 'New Skill',
                      percentage: 50,
                      order: current.length,
                    },
                  ])
                }
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm"
              >
                Add Skill
              </button>
              <SaveButton
                saving={saving}
                onClick={async () => {
                  setSaving(true)
                  try {
                    const normalized = skills.map((skill, index) => ({ ...skill, order: index }))
                    await saveSkills(normalized)
                    setSkills(normalized)
                    showStatus('Skills saved.')
                  } finally {
                    setSaving(false)
                  }
                }}
              />
            </section>
          ) : null}

          {activeTab === 'projects' ? (
            <section className="grid gap-4">
              <p className="text-sm text-slate-400">
                Featured projects: {featuredCount}/4 (non-coming-soon)
              </p>
              {projects.map((project, index) => (
                <div key={project.id} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field
                      label="Title"
                      value={project.title}
                      onChange={(v) =>
                        setProjects((current) =>
                          current.map((p, i) => (i === index ? { ...p, title: v } : p)),
                        )
                      }
                    />
                    <Field
                      label="Tech Stack (comma-separated)"
                      value={project.techStack.join(', ')}
                      onChange={(v) =>
                        setProjects((current) =>
                          current.map((p, i) =>
                            i === index
                              ? { ...p, techStack: v.split(',').map((t) => t.trim()).filter(Boolean) }
                              : p,
                          ),
                        )
                      }
                    />
                  </div>
                  <TextArea
                    label="Description"
                    value={project.description}
                    onChange={(v) =>
                      setProjects((current) =>
                        current.map((p, i) => (i === index ? { ...p, description: v } : p)),
                      )
                    }
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field
                      label="GitHub URL"
                      value={project.githubUrl ?? ''}
                      onChange={(v) =>
                        setProjects((current) =>
                          current.map((p, i) => (i === index ? { ...p, githubUrl: v } : p)),
                        )
                      }
                    />
                    <Field
                      label="Live URL"
                      value={project.liveUrl ?? ''}
                      onChange={(v) =>
                        setProjects((current) =>
                          current.map((p, i) => (i === index ? { ...p, liveUrl: v } : p)),
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={() => toggleFeatured(project.id)}
                      />
                      Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={project.comingSoon ?? false}
                        onChange={() =>
                          setProjects((current) =>
                            current.map((p, i) =>
                              i === index ? { ...p, comingSoon: !p.comingSoon } : p,
                            ),
                          )
                        }
                      />
                      Coming Soon
                    </label>
                    <button
                      type="button"
                      onClick={() => setProjects((current) => current.filter((p) => p.id !== project.id))}
                      className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setProjects((current) => [
                    ...current,
                    {
                      id: createId('project'),
                      title: 'New Project',
                      description: 'Project description',
                      techStack: [],
                      featured: false,
                      order: current.length,
                    },
                  ])
                }
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm"
              >
                Add Project
              </button>
              <SaveButton
                saving={saving}
                onClick={async () => {
                  setSaving(true)
                  try {
                    const normalized = projects.map((project, index) => ({ ...project, order: index }))
                    await saveProjects(normalized)
                    setProjects(normalized)
                    showStatus('Projects saved.')
                  } finally {
                    setSaving(false)
                  }
                }}
              />
            </section>
          ) : null}

          {activeTab === 'services' ? (
            <section className="grid gap-4">
              {services.map((service, index) => (
                <div key={service.id} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 md:grid-cols-2">
                  <Field
                    label="Title"
                    value={service.title}
                    onChange={(v) =>
                      setServices((current) =>
                        current.map((s, i) => (i === index ? { ...s, title: v } : s)),
                      )
                    }
                  />
                  <Field
                    label="Category"
                    value={service.category}
                    onChange={(v) =>
                      setServices((current) =>
                        current.map((s, i) => (i === index ? { ...s, category: v } : s)),
                      )
                    }
                  />
                  <TextArea
                    label="Description"
                    value={service.description}
                    onChange={(v) =>
                      setServices((current) =>
                        current.map((s, i) => (i === index ? { ...s, description: v } : s)),
                      )
                    }
                  />
                  <div className="grid gap-3">
                    <label className="text-sm text-slate-300">
                      Icon
                      <select
                        value={service.iconName ?? 'Globe'}
                        onChange={(e) =>
                          setServices((current) =>
                            current.map((s, i) =>
                              i === index ? { ...s, iconName: e.target.value } : s,
                            ),
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                      >
                        {serviceIconOptions.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Field
                      label="Badge (optional)"
                      value={service.badge ?? ''}
                      onChange={(v) =>
                        setServices((current) =>
                          current.map((s, i) => (i === index ? { ...s, badge: v || undefined } : s)),
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setServices((current) => current.filter((s) => s.id !== service.id))}
                      className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setServices((current) => [
                    ...current,
                    {
                      id: createId('service'),
                      title: 'New Service',
                      description: 'Service description',
                      category: 'Freelance',
                      iconName: 'Globe',
                      order: current.length,
                    },
                  ])
                }
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm"
              >
                Add Service
              </button>
              <SaveButton
                saving={saving}
                onClick={async () => {
                  setSaving(true)
                  try {
                    const normalized = services.map((service, index) => ({ ...service, order: index }))
                    await saveServices(normalized)
                    setServices(normalized)
                    showStatus('Services saved.')
                  } finally {
                    setSaving(false)
                  }
                }}
              />
            </section>
          ) : null}

          {activeTab === 'theme' && theme ? (
            <section className="grid gap-4 md:grid-cols-2">
              {(['primary', 'secondary', 'accent', 'bg', 'surface', 'text'] as const).map((key) => (
                <Field
                  key={key}
                  label={key}
                  value={theme[key]}
                  onChange={(v) => setTheme({ ...theme, [key]: v })}
                />
              ))}
              <div className="md:col-span-2">
                <SaveButton
                  saving={saving}
                  onClick={async () => {
                    setSaving(true)
                    try {
                      await saveSiteTheme(theme)
                      showStatus('Theme colors saved.')
                    } finally {
                      setSaving(false)
                    }
                  }}
                />
              </div>
            </section>
          ) : null}

          {activeTab === 'contacts' ? (
            <section className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Message</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-slate-800/70">
                      <td className="px-3 py-3">{contact.name}</td>
                      <td className="px-3 py-3">{contact.email}</td>
                      <td className="max-w-xs px-3 py-3 text-slate-300">{contact.message}</td>
                      <td className="px-3 py-3">
                        {contact.timestamp?.toLocaleString() ?? 'Pending'}
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={async () => {
                            await markContactAsRead(contact.id, !contact.read)
                            setContacts((current) =>
                              current.map((c) =>
                                c.id === contact.id ? { ...c, read: !c.read } : c,
                              ),
                            )
                          }}
                          className={`rounded-lg px-3 py-1 text-xs ${
                            contact.read
                              ? 'bg-slate-800 text-slate-300'
                              : 'bg-emerald-500/15 text-emerald-300'
                          }`}
                        >
                          {contact.read ? 'Read' : 'Unread'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}

          {activeTab === 'chats' ? (
            <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <div className="grid max-h-[70vh] gap-2 overflow-y-auto">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setSelectedChat(chat)}
                    className={`rounded-xl border px-4 py-3 text-left ${
                      selectedChat?.id === chat.id
                        ? 'border-emerald-400/40 bg-emerald-500/10'
                        : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    <p className="font-medium">{chat.autoGeneratedTitle}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">{chat.summaryText}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {chat.timestamp?.toLocaleString() ?? 'Pending'}
                    </p>
                  </button>
                ))}
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                {selectedChat ? (
                  <>
                    <h3 className="text-lg font-semibold">{selectedChat.autoGeneratedTitle}</h3>
                    <p className="mt-2 text-sm text-slate-300">{selectedChat.summaryText}</p>
                    {selectedChat.visitorInfo ? (
                      <p className="mt-3 text-sm text-slate-400">
                        Visitor: {selectedChat.visitorInfo.name ?? 'Unknown'} (
                        {selectedChat.visitorInfo.email ?? 'no email'})
                      </p>
                    ) : null}
                    <div className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto text-sm">
                      {selectedChat.fullTranscript.map((message, index) => (
                        <p key={index} className="rounded-lg bg-slate-900 px-3 py-2">
                          <strong>{message.role}:</strong> {message.content}
                        </p>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-400">Select a chat summary to view details.</p>
                )}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-emerald-300">{value}</p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      {label}
      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
      />
    </label>
  )
}

function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => Promise<void> }) {
  return (
    <button
      type="button"
      disabled={saving}
      onClick={() => void onClick()}
      className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
    >
      {saving ? 'Saving...' : 'Save Changes'}
    </button>
  )
}

function FileUpload({
  label,
  accept,
  onUpload,
}: {
  label: string
  accept: string
  onUpload: (file: File) => Promise<void>
}) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      {label}
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void onUpload(file)
        }}
        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
      />
    </label>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
      {message}
    </div>
  )
}
