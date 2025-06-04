import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex justify-center">
          <Link to="/" className="inline-flex">
            <span className="sr-only">Meducate.now</span>
            <h1 className="text-4xl font-bold text-primary-600">Meducate.now</h1>
          </Link>
        </div>
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">404 error</p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found.</h1>
            <p className="mt-2 text-base text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
            <div className="mt-6">
              <Link to="/" className="text-base font-medium text-primary-600 hover:text-primary-500">
                Go back home<span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-4">
          <Link to="/content" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Content
          </Link>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <Link to="/seo-optimizer" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            SEO Optimizer
          </Link>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <Link to="/analytics" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Analytics
          </Link>
        </nav>
      </footer>
    </div>
  )
}
