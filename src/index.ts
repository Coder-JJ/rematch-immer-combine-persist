import { ReducersMapObject } from 'redux'
import { Plugin, Action, Models } from '@rematch/core'
import produce from 'immer'
import { persistCombineReducers, persistStore, Persistor, PersistorOptions, PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

let persistor: Persistor

export const getPersistor = (): Persistor => persistor

const plugin = <S = any, RS = any, HSS = any, ESS = any>(
  persistConfig: Partial<PersistConfig<S, RS, HSS, ESS>> = {},
  persistStoreConfig?: PersistorOptions | null,
  callback?: () => any
): Plugin => {
  const persistMergedConfig: PersistConfig<S, RS, HSS, ESS> = {
    key: 'root',
    storage,
    ...persistConfig
  }
  return {
    config: {
      redux: {
        combineReducers (reducers) {
          const reducersWithImmer: ReducersMapObject<any, Action<any>> = {}
          for (const key of Object.keys(reducers)) {
            const reducer = reducers[key]
            reducersWithImmer[key] = (state, payload) => {
              if (typeof state === 'object') {
                return produce(state, (draft: Models) => {
                  const next = reducer(draft, payload)
                  if (typeof next === 'object') {
                    return next
                  }
                })
              }
              return reducer(state, payload)
            }
          }
          return persistCombineReducers(persistMergedConfig, reducersWithImmer)
        }
      }
    },
    onStoreCreated (store) {
      persistor = persistStore(store, persistStoreConfig, callback)
    }
  }
}

export default plugin
