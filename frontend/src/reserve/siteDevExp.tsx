import { isValidElement, type ReactNode } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './App.module.css'
import mdContent from './markdown/siteDevExp.md?raw'
import './index.css'
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

const articleDocument = parseDocument(mdContent)
const topLevelSections = articleDocument.toc.filter(({ level }) => level === 1)
const markdownComponents: Components = {
  // 传入 styles 对象中的类名
  h1: createHeading('h2', 'article-section-title'), 
  h2: createHeading('h3', 'article-subsection-title'),
  
  a({ href = '', children, ...props }) {
    return (
      <a {...props} className={styles['article-link']} href={href}>
        {children}
      </a>
    )
  },
  
  table({ children }) {
    return (
      <div className={styles['article-table']}>
        <table>{children}</table>
      </div>
    )
  },
};

// 辅助函数也要改：
function createHeading(tag: 'h2' | 'h3' | 'h4', classNameKey: string) {
  return function Heading({ children }: { children?: ReactNode }) {
    const text = flattenText(children).trim()
    const id = slugify(text)
    const Tag = tag

    return (
      <Tag className={styles[classNameKey]} id={id}> {/* 关键点 */}
        <a className={styles['heading-anchor']} href={`#${id}`}> {/* 关键点 */}
          {children}
        </a>
      </Tag>
    )
  }
}
function SiteDevExpPage() {
  return (
    /* 使用 styles['class-name'] 语法，因为你的类名包含中划线 */
    <div className={styles['app-shell']}>
      <main className={styles['reader-page']}>
        <header className={styles['article-hero']}>
          <div className={styles['hero-copy']}>
            <h1 className={styles['hero-title']}>{articleDocument.title}</h1>
          </div>

          <div className={styles['hero-footer']}>
            <div className={styles['hero-stats']} aria-label="文章概览">
              <span>{topLevelSections.length || 1} titles</span>
            </div>

            {topLevelSections.length > 0 && (
              <div className={styles['hero-tags']} aria-label="主题快速跳转">
                {topLevelSections.map((item) => (
                  <a className={styles['hero-tag']} href={`#${item.id}`} key={item.id}>
                    {item.text}
                  </a>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className={styles['article-layout']}>
          {articleDocument.toc.length > 0 && (
            <aside aria-label="文章目录" className={styles['article-sidebar']}>
              <div className={styles['toc-card']}>
                <p className={styles['toc-eyebrow']}>目录导航</p>
                <nav className={styles['toc-list']}>
                  {articleDocument.toc.map((item) => (
                    <a
                      /* 动态类名的处理方式：联合多个模块化类名 */
                      className={`${styles['toc-link']} ${styles[`toc-level-${item.level}`]}`}
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

          <article className={styles['article-card']}>
            <div className={styles['article-content']}>
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

export default SiteDevExpPage