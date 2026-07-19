import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const Modal = ({ isOpen, onClose, children }) => {
  const panelRef = useRef(null)
  const scrollHideTimer = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', onKeyDown)
      if (scrollHideTimer.current) window.clearTimeout(scrollHideTimer.current)
    }
  }, [isOpen, onClose])

  const onPanelScroll = () => {
    const panel = panelRef.current
    if (!panel) return
    panel.classList.add('is-scrolling')
    if (scrollHideTimer.current) window.clearTimeout(scrollHideTimer.current)
    scrollHideTimer.current = window.setTimeout(() => {
      panel.classList.remove('is-scrolling')
    }, 900)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          onScroll={onPanelScroll}
          className="modal-scroll glass-panel relative w-full max-w-4xl max-h-[90vh] overflow-y-auto
                     px-4 pb-5 pt-12 sm:px-8 sm:pb-8 sm:pt-14 shadow-2xl
                     shadow-primary-light/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20
                       w-9 h-9 flex items-center justify-center rounded-full
                       border border-gray-300/40 dark:border-gray-600/50
                       text-gray-400 hover:text-primary-light hover:border-primary-light/50
                       hover:bg-primary-light/10 transition-colors text-lg leading-none"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default Modal
