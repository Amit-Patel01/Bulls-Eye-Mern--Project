import { useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import NavbarChat from './NavbarChat'

const navigation = [
  { name: 'Home', to: '/', current: true },
  { name: 'Upload Material', to: '/upload', current: false },
  { name: 'Generate Quiz', to: '/quiz', current: false },
  { name: 'Take Test', to: '/test', current: false },
  { name: 'Results', to: '/results', current: false },
  { name: 'Analytics', to: '/analytics', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar({ user, onSignOut }) {
  const [chatOpen, setChatOpen] = useState(false)
  
  return (
    <>
      <NavbarChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <Disclosure as="nav" className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {/* Mobile Menu Button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-black focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6 group-data-open:hidden" />
              <XMarkIcon className="hidden h-6 w-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo + Navigation */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Logo"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-black',
                      'rounded-md px-3 py-2 text-sm font-medium transition'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

            {/* Chat Button */}
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="relative rounded-full p-1 text-gray-600 hover:text-indigo-600 focus:outline-none transition"
              title="Ask AI Assistant"
            >
              <span className="sr-only">Chat with AI</span>
              <ChatBubbleLeftIcon className="h-6 w-6" />
            </button>

            {/* Notification Button */}
            <button
              type="button"
              className="relative rounded-full p-1 text-gray-600 hover:text-black focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
            </button>

            {/* Profile Dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="flex rounded-full focus-visible:outline-none">
                <span className="sr-only">Open user menu</span>
                <img
                  alt={user?.displayName}
                  src={
                    user?.photoURL ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  }
                  className="h-8 w-8 rounded-full"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.email}
                  </p>
                </div>

                <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      Your profile
                    </Link>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      Settings
                    </Link>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={onSignOut}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block w-full text-left px-4 py-2 text-sm text-red-600 font-semibold border-t border-gray-200 mt-1'
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3 bg-white border-t">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.to}
              className={classNames(
                item.current
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-black',
                'block rounded-md px-3 py-2 text-base font-medium'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
    </>
  )
}