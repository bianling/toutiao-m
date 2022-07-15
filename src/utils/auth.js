import storage from './storage'

const HEIMA_TOUTIAO = 'HEIMA_TOUTIAO_TOKEN'
export const setToken = (val) => storage.set(HEIMA_TOUTIAO, val)

export const getToken = () => storage.get(HEIMA_TOUTIAO)

export const removeToken = () => storage.remove(HEIMA_TOUTIAO)
