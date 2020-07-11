import { ReducersMapObject } from 'redux'
import { Plugin, Action, Models } from '@rematch/core'
import produce from 'immer'
import { persistCombineReducers, persistStore, Persistor, PersistorOptions, PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

export interface ImmerOptions {
  blacklist?: string[]
  whitelist?: string[]
}

export interface PersistOptions<S, RS, HSS, ESS> {
  persistConfig?: Partial<PersistConfig<S, RS, HSS, ESS>>
  persistorOptions?: PersistorOptions | null
  callback?: () => any
}

export interface PluginOptions<S, RS, HSS, ESS> {
  immerOptions?: ImmerOptions
  persistOptions?: PersistOptions<S, RS, HSS, ESS>
}

let persistor: Persistor

export const getPersistor = (): Persistor => persistor

const shouldCombineImmer = (immerOptions: ImmerOptions, key: string): boolean => {
  const { whitelist, blacklist } = immerOptions
  if (whitelist && !whitelist.includes(key)) {
    return false
  }
  if (blacklist && blacklist.includes(key)) {
    return false
  }
  return true
}

const plugin = <S = any, RS = any, HSS = any, ESS = any>(options?: PluginOptions<S, RS, HSS, ESS>): Plugin => {
  const { immerOptions = {}, persistOptions = {} } = options || {}
  const persistConfig: PersistConfig<S, RS, HSS, ESS> = {
    key: 'root',
    storage,
    ...(persistOptions.persistConfig || {})
  }

  return {
    config: {
      redux: {
        combineReducers (reducers) {
          const handledReducers: ReducersMapObject<any, Action<any>> = {}
          for (const key of Object.keys(reducers)) {
            const reducer = reducers[key]
            handledReducers[key] = (state, payload) => {
              if (typeof state === 'object' && shouldCombineImmer(immerOptions, key)) {
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
          return persistCombineReducers(persistConfig, handledReducers)
        }
      }
    },
    onStoreCreated (store) {
      persistor = persistStore(store, persistOptions.persistorOptions, persistOptions.callback)
    }
  }
}

export default plugin
