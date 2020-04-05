import useAuth from '~/use/auth'
import useDoc from '~/use/doc'

export default async function({ route, redirect }) {
  const { uid } = useAuth()

  const { exists, loadById } = useDoc('mafia_profiles')
  await loadById(uid.value)

  if (!exists.value) {
    window.localStorage.setItem('target', route.fullPath)
    redirect('/mafia/game/profile')
  }
}
