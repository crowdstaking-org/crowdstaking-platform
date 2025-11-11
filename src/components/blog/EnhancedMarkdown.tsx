/**
 * EnhancedMarkdown Component
 * ReactMarkdown wrapper with custom component support
 * 
 * Supports custom syntax:
 * ::: callout-info / callout-warning / callout-success / callout-tip
 * ::: tldr
 * ::: pullquote
 * ::: key-takeaway
 */

'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { CalloutBox } from './markdown/CalloutBox'
import { PullQuote } from './markdown/PullQuote'
import { TldrBox } from './markdown/TldrBox'
import { KeyTakeaway } from './markdown/KeyTakeaway'

interface EnhancedMarkdownProps {
  content: string
  className?: string
}

/**
 * Pre-process markdown to convert custom syntax to HTML-like tags
 * that ReactMarkdown can handle
 */
function preprocessMarkdown(markdown: string): string {
  let processed = markdown

  // Process custom blocks: ::: type ... :::
  const blockRegex = /:::\s*(callout-info|callout-warning|callout-success|callout-tip|tldr|pullquote|key-takeaway)\s*\n([\s\S]*?)\n:::/g
  
  processed = processed.replace(blockRegex, (match, type, content) => {
    // Convert to HTML-style tags that we can intercept
    return `<custom-${type}>${content.trim()}</custom-${type}>`
  })

  return processed
}

/**
 * Custom component renderers for ReactMarkdown
 */
const components = {
  // Intercept our custom tags
  'custom-callout-info': ({ children }: any) => (
    <CalloutBox variant="info">{children}</CalloutBox>
  ),
  'custom-callout-warning': ({ children }: any) => (
    <CalloutBox variant="warning">{children}</CalloutBox>
  ),
  'custom-callout-success': ({ children }: any) => (
    <CalloutBox variant="success">{children}</CalloutBox>
  ),
  'custom-callout-tip': ({ children }: any) => (
    <CalloutBox variant="tip">{children}</CalloutBox>
  ),
  'custom-tldr': ({ children }: any) => (
    <TldrBox>{children}</TldrBox>
  ),
  'custom-pullquote': ({ children }: any) => (
    <PullQuote>{children}</PullQuote>
  ),
  'custom-key-takeaway': ({ children }: any) => (
    <KeyTakeaway>{children}</KeyTakeaway>
  ),
  
  // Add IDs to headings for TOC linking
  h2: ({ children, ...props }: any) => {
    const text = children?.toString() || ''
    const id = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    
    return <h2 id={id} {...props}>{children}</h2>
  },
  
  h3: ({ children, ...props }: any) => {
    const text = children?.toString() || ''
    const id = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    
    return <h3 id={id} {...props}>{children}</h3>
  },
}

export function EnhancedMarkdown({ content, className = '' }: EnhancedMarkdownProps) {
  const processedContent = preprocessMarkdown(content)

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

