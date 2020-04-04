import useAuth from '~/use/auth'
import useDoc from '~/use/doc'

export default async function({ route, redirect }) {
  const { uid } = useAuth()

  if (route.name === 'signup' && uid.value) {
    redirect('/account')
  }

  if (route.name === 'account' && !uid.value) {
    redirect('/')
  }

  if (route.name === 'mafia-game-id' || route.name === 'mafia-game') {
    if (!uid.value) {
      window.localStorage.setItem('target', route.fullPath)
      redirect('/signup')
    } else {
      const { exists, loadById } = useDoc('mafia_profiles')
      await loadById(uid.value)

      if (!exists.value) {
        window.localStorage.setItem('target', route.fullPath)
        redirect('/mafia/game/profile')
      }
    }
  }

  if (route.name === 'rsvp-id' && !uid.value) {
    window.localStorage.setItem('target', route.fullPath)
    redirect('/signup')
  }
}
