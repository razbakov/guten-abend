import useAuth from '~/use/auth'

export default function({ route, redirect }) {
  const { uid } = useAuth()

  if (route.name === 'signup' && uid.value) {
    redirect('/account')
  }

  if (!uid.value) {
    redirect('/')
  }
}
