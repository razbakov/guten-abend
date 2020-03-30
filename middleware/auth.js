import useAuth from '~/use/auth.js'

export default function({ route, redirect }) {
  const { uid } = useAuth()

  if (route.name === 'signup' && uid.value) {
    console.log('redirecting to profile')
    redirect('/profile')
  }

  if (route.name === 'profile' && !uid.value) {
    console.log('redirecting to homepage')
    redirect('/')
  }
}
