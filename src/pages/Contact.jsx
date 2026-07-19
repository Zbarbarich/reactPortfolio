import { useState } from 'react'
import andyReclining from '../assets/andy/andy-reclining.svg'

const encode = (data) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', botField: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email'
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      next.message = 'Message should be at least 10 characters'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.botField) return
    if (!validate()) return

    setStatus('loading')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'contact',
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      })
      if (!res.ok) throw new Error('Submit failed')
      setStatus('success')
      setForm({ name: '', email: '', message: '', botField: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative flex flex-col items-center min-h-[80vh] pt-8 px-4">
      <h1 className="text-5xl font-bold mb-6 relative font-display">
        <div className="absolute bottom-0 left-8 h-[14px] w-[55%] gradient-underline" />
        <span className="relative z-[2]">Contact Me</span>
      </h1>

      <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl text-center">
        Let&apos;s connect — send a message below for collaborations, roles, or a friendly chat.
      </p>

      <div className="w-full max-w-xl glass-card p-6 sm:p-8 mb-10">
        {status === 'success' ? (
          <div className="text-center space-y-4 py-6">
            <p className="text-lg text-primary-light font-semibold">Message sent — thanks for reaching out!</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              I&apos;ll get back to you as soon as I can.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-primary hover:text-secondary transition text-sm"
            >
              Send another →
            </button>
          </div>
        ) : (
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="space-y-5 text-left"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Don&apos;t fill this out:{' '}
                <input name="bot-field" value={form.botField} onChange={(e) => setForm((p) => ({ ...p, botField: e.target.value }))} />
              </label>
            </p>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-light/50"
                autoComplete="name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-light/50"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                Message
              </label>
              <div className="relative overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus-within:ring-2 focus-within:ring-primary-light/50">
                <img
                  src={andyReclining}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 m-auto w-[90%] max-h-[90%] h-auto
                             object-contain opacity-[0.16] dark:opacity-[0.2] select-none"
                  draggable={false}
                />
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="relative z-[1] w-full bg-transparent px-4 py-2.5 focus:outline-none resize-y"
                />
              </div>
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm">
                Something went wrong. Please try again or email me directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-glow w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>

      <div className="text-center space-y-3 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Or reach me directly</p>
        <a href="mailto:zachery.barbarich@gmail.com" className="block hover:text-primary transition">
          zachery.barbarich@gmail.com
        </a>
        <a
          href="/ZachBarbarichResume2026.pdf"
          download="ZachBarbarichResume2026.pdf"
          className="inline-block text-secondary hover:text-primary transition text-sm font-medium"
        >
          Download Resume →
        </a>
        <div className="flex flex-wrap justify-center gap-6 pt-2">
          <a
            href="https://linkedin.com/in/zach-barbarich-193611333"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Zbarbarich/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            GitHub
          </a>
          <a
            href="https://gitlab.com/zachery.barbarich"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            GitLab
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact
