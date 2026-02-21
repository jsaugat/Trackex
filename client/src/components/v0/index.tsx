/**
 * v0 by Vercel.
 * @see https://v0.dev/t/v2KVlrlPFmJ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="flex">
        <nav className="w-64 h-screen px-4 py-8 border-r border-gray-800">
          <div className="flex items-center space-x-2 mb-10">
            <CloudLightningIcon className="text-purple-500 h-8 w-8" />
            <span className="text-2xl font-bold">SENXOR</span>
          </div>
          <ul className="space-y-2">
            <li>
              <a className="flex items-center space-x-2 p-2 rounded-md bg-[#1f1f1f]" href="#">
                <LayoutDashboardIcon className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#1f1f1f]" href="#">
                <WalletIcon className="h-5 w-5" />
                <span>Transactions</span>
              </a>
            </li>
            <li>
              <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#1f1f1f]" href="#">
                <SettingsIcon className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#1f1f1f]" href="#">
                <LogOutIcon className="h-5 w-5" />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-semibold mb-6">Good Morning, Saugat</h1>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#1f1f1f] rounded-lg p-4 h-40 col-span-1" />
            <div className="bg-[#1f1f1f] rounded-lg p-4 h-40 col-span-1" />
            <div className="bg-[#1f1f1f] rounded-lg p-4 h-40 col-span-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1f1f1f] rounded-lg p-4 h-80 col-span-1" />
            <div className="bg-[#1f1f1f] rounded-lg p-4 h-80 col-span-1" />
          </div>
        </main>
      </div>
    </div>
  )
}

function CloudLightningIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
      <path d="m13 12-3 5h4l-3 5" />
    </svg>
  )
}


function LayoutDashboardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}


function LogOutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}


function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function WalletIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  )
}
