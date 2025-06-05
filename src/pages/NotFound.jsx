import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h2>
      <p className="mt-2 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
      <Link to="/" className="mt-6 btn btn-primary">
        Go back home
      </Link>
    </div>
  )
}
