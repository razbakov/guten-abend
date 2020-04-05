import useAuth from '~/use/auth'

export default async ({ route, redirect }) => {
  const { getAccount, confirmedAccount } = useAuth()

  await getAccount()

  if (!confirmedAccount.value) {
    window.localStorage.setItem('target', route.fullPath)
    redirect('/account')
  }
}
