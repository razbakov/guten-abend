import useAuth from '~/use/auth'

export default function({ route, redirect }) {
  const { uid } = useAuth()

  if (!uid.value) {
    window.localStorage.setItem('target', route.fullPath)
    redirect('/signup')
  }
}
