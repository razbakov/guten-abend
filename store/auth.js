export const state = () => ({
  uid: null,
  profile: null
})

export const mutations = {
  SET_UID(state, uid) {
    state.uid = uid
  },
  SET_PROFILE(state, profile) {
    state.profile = profile
  }
}

export const actions = {
  async init({ dispatch, commit }, payload) {
    commit('SET_UID', payload?.authUser?.uid)

    await dispatch('loadProfile')
  },

  async saveProfile({ state, dispatch }, profile) {
    if (!state.uid) {
      return
    }

    await this.$fireStore
      .collection('profiles')
      .doc(state.uid)
      .set(profile)

    await dispatch('loadProfile')
  },

  async loadProfile({ state, commit }) {
    if (!state.uid) {
      return
    }

    const profileDoc = await this.$fireStore
      .collection('profiles')
      .doc(state.uid)
      .get()

    commit('SET_PROFILE', profileDoc.data())
  }
}
