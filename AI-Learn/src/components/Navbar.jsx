import { useState, Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import NavbarChat from './NavbarChat'

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Upload Material', to: '/upload' },
  { name: 'Generate Quiz', to: '/quiz' },
  { name: 'Results', to: '/results' },
  { name: 'Analytics', to: '/analytics' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar({ user, onSignOut }) {
  const [chatOpen, setChatOpen] = useState(false)
  const location = useLocation()
  
  return (
    <>
      <NavbarChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <Disclosure as="nav" className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex h-20 items-center justify-between">

                {/* Mobile Menu Button */}
                <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-xl p-2.5 text-slate-500 hover:bg-slate-100/80 hover:text-indigo-600 focus:outline-none transition-colors">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                {/* Logo + Navigation Spacer */}
                <div className="flex flex-1 items-center justify-center lg:items-stretch lg:justify-start">
                  <Link to="/" className="flex shrink-0 items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                    <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight hidden sm:block">AI-Learn</span>
                  </Link>
                  
                  {/* Desktop Navigation */}
                  <div className="hidden lg:ml-10 lg:block self-center">
                    <div className="flex space-x-2">
                      {navigation.map((item) => {
                        const isCurrent = location.pathname === item.to
                        return (
                          <Link
                            key={item.name}
                            to={item.to}
                            className={classNames(
                              isCurrent
                                ? 'bg-indigo-50/80 text-indigo-700 border border-indigo-100 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border border-transparent',
                              'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200'
                            )}
                          >
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Side Tools */}
                <div className="absolute inset-y-0 right-0 flex items-center gap-4 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  
                  {/* Profile Dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ring-offset-white shadow-sm hover:shadow-md transition-shadow">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-10 w-10 rounded-full border-2 border-indigo-100 object-cover"
                        src={user?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        alt={user?.displayName || "User"}
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-2xl bg-white/90 backdrop-blur-xl py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-100">
                        <div className="px-5 py-4 border-b border-slate-100/80 mb-1">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {user?.displayName || 'User Account'}
                          </p>
                          <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/settings"
                              className={classNames(
                                active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700',
                                'block px-5 py-2.5 text-sm font-semibold transition-colors mx-2 rounded-lg'
                              )}
                            >
                              Profile Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={onSignOut}
                              className={classNames(
                                active ? 'bg-rose-50 text-rose-700' : 'text-rose-600',
                                'block w-[calc(100%-1rem)] text-left px-5 py-2.5 text-sm font-semibold transition-colors mx-2 mt-1 rounded-lg'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <Disclosure.Panel className="lg:hidden">
              <div className="space-y-1 px-4 pb-4 pt-2 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-inner">
                {navigation.map((item) => {
                  const isCurrent = location.pathname === item.to
                  return (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.to}
                      className={classNames(
                        isCurrent
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border-transparent',
                        'block rounded-xl px-4 py-3 text-base font-semibold border transition-colors'
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  )
                })}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  )
}