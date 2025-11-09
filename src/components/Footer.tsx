import Link from 'next/link'

/**
 * Footer component with links and copyright information
 */
export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <Link
              href="/about"
              className="hover:text-white transition-colors link-slide"
            >
              About
            </Link>
            {/* Temporarily hidden - will be activated later */}
            {/* <a
              href="#blog"
              className="hover:text-white transition-colors link-slide"
            >
              Blog
            </a> */}
            <Link
              href="/whitepaper"
              className="hover:text-white transition-colors link-slide"
            >
              Whitepaper
            </Link>
            {/* Temporarily hidden - will be activated later */}
            {/* <a
              href="#discord"
              className="hover:text-white transition-colors link-slide"
            >
              Discord
            </a> */}
            {/* Temporarily hidden - will be activated later */}
            {/* <a
              href="#twitter"
              className="hover:text-white transition-colors link-slide"
            >
              Twitter/X
            </a> */}
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm">© 2025 CrowdStaking Foundation</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

