import { isValidElement, type ReactNode } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'
import mdContent from './markdown/siteDevExp.md?raw'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

type TocItem = {
  id: string
  text: string
  level: 1 | 2 | 3
}

type ParsedDocument = {
  title: string
  intro: string
  content: string
  toc: TocItem[]
}

const headingPattern = /^(#{1,3})\s+(.+)$/
const dividerPattern = /^-{3,}\s*$/

function flattenText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(flattenText).join('')
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return flattenText(node.props.children)
  }

  return ''
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') || 'section'
  )
}

function extractHeadings(content: string): TocItem[] {
  return content.split('\n').flatMap((line) => {
    const match = line.trim().match(headingPattern)

    if (!match) {
      return []
    }

    const level = match[1].length as TocItem['level']
    const text = match[2].trim().replace(/\s+#+$/, '')

    return [{ id: slugify(text), text, level }]
  })
}

function parseDocument(markdown: string): ParsedDocument {
  const lines = markdown.trim().split('\n')
  const firstContentIndex = lines.findIndex((line) => line.trim() !== '')

  if (firstContentIndex === -1) {
    return {
      title: '文档',
      intro: '',
      content: '',
      toc: [],
    }
  }

  const firstLine = lines[firstContentIndex].trim()
  const title = firstLine.startsWith('# ')
    ? firstLine.replace(/^#\s+/, '').trim()
    : '文档'
  const remainingLines = lines.slice(firstContentIndex + 1)

  const introLines: string[] = []
  let bodyStartIndex = 0

  for (; bodyStartIndex < remainingLines.length; bodyStartIndex += 1) {
    const currentLine = remainingLines[bodyStartIndex]
    const trimmedLine = currentLine.trim()

    if (!trimmedLine) {
      if (introLines.length > 0) {
        bodyStartIndex += 1
        break
      }

      continue
    }

    if (dividerPattern.test(trimmedLine) || trimmedLine.startsWith('#')) {
      break
    }

    introLines.push(trimmedLine)
  }

  let bodyLines = remainingLines.slice(bodyStartIndex)

  while (
    bodyLines[0] &&
    (!bodyLines[0].trim() || dividerPattern.test(bodyLines[0].trim()))
  ) {
    bodyLines = bodyLines.slice(1)
  }

  const content =
    bodyLines.join('\n').trim() ||
    remainingLines.join('\n').trim() ||
    markdown.trim()

  const intro =
    introLines.join(' ').trim() ||
    '整理网站部署过程中的关键步骤、备案要求与可替代方案。'

  return {
    title,
    intro,
    content,
    toc: extractHeadings(content),
  }
}

function createHeading(tag: 'h2' | 'h3' | 'h4', className: string) {
  return function Heading({ children }: { children?: ReactNode }) {
    const text = flattenText(children).trim()
    const id = slugify(text)
    const Tag = tag

    return (
      <Tag className={className} id={id}>
        <a className="heading-anchor" href={`#${id}`}>
          {children}
        </a>
      </Tag>
    )
  }
}

const articleDocument = parseDocument(mdContent)
const topLevelSections = articleDocument.toc.filter(({ level }) => level === 1)

const markdownComponents: Components = {
  h1: createHeading('h2', 'article-section-title'),
  h2: createHeading('h3', 'article-subsection-title'),
  h3: createHeading('h4', 'article-minor-title'),
  a({ href = '', children, ...props }) {
    const isExternalLink = /^https?:\/\//.test(href)

    return (
      <a
        {...props}
        className="article-link"
        href={href}
        rel={isExternalLink ? 'noreferrer' : undefined}
        target={isExternalLink ? '_blank' : undefined}
      >
        {children}
      </a>
    )
  },
  table({ children }) {
    return (
      <div className="article-table">
        <table>{children}</table>
      </div>
    )
  },
}
function SiteDevExpPage() {
  return (
    <div className="app-shell">
      <main className="reader-page">
        <header className="article-hero">
          <div className="hero-copy">
            <h1 className="hero-title">{articleDocument.title}</h1>
          </div>

          <div className="hero-footer">
            <div className="hero-stats" aria-label="文章概览">
              <span>{topLevelSections.length || 1} titles</span>
            </div>

            {topLevelSections.length > 0 && (
              <div className="hero-tags" aria-label="主题快速跳转">
                {topLevelSections.map((item) => (
                  <a className="hero-tag" href={`#${item.id}`} key={item.id}>
                    {item.text}
                  </a>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="article-layout">
          {articleDocument.toc.length > 0 && (
            <aside aria-label="文章目录" className="article-sidebar">
              <div className="toc-card">
                <p className="toc-eyebrow">目录导航</p>
                <nav className="toc-list">
                  {articleDocument.toc.map((item) => (
                    <a
                      className={`toc-link toc-level-${item.level}`}
                      href={`#${item.id}`}
                      key={item.id}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          <article className="article-card">
            <div className="article-content">
              <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkGfm]}
              >
                {articleDocument.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/siteDevExp" />} />
        <Route path="/siteDevExp" element={<SiteDevExpPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
