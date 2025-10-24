// components/GitHubLogin.jsx
import { signIn } from 'next-auth/react'

const GitHubLogin = () => {
  return (
    <button 
      onClick={() => signIn('github')}
      className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
    >
      Sign in with GitHub
    </button>
  )
}

export default GitHubLogin
