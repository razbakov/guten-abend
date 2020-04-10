import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import sendEmail from './lib/sendEmail'
admin.initializeApp()
const db = admin.firestore()

export const taskRunner = functions
  .runWith({ memory: '2GB' })
  .pubsub.schedule('* * * * *')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now()

    const query = db
      .collection('campaigns')
      .where('scheduledAt', '<=', now)
      .where('status', '==', 'scheduled')

    const tasks = await query.get()

    const jobs: Promise<any>[] = []

    tasks.forEach((snapshot) => {
      const data = snapshot.data()
      const job = sendEmail(data)
        .then(() => snapshot.ref.update({ status: 'sent' }))
        .catch((err) => snapshot.ref.update({ status: 'error' }))

      jobs.push(job)
    })

    return await Promise.all(jobs)
  })
