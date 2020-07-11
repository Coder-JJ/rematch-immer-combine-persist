# rematch-immer-combine-persist

## Why `rematch-immer-combine-persist`?

- Combine `immer` and `persist`

- Can use with `@rematch/loading` (`@rematch/immer` can't)

## CHANGELOG

- [CHANGELOG.md](https://github.com/Coder-JJ/rematch-immer-combine-persist/blob/master/CHANGELOG.md)

## Docs

- [immer](https://github.com/immerjs/immer)

- [redux-persist](https://github.com/rt2zz/redux-persist)

- [@rematch/immer](https://rematch.github.io/rematch/#/plugins/immer?id=usage)

- [@rematch/persist](https://rematch.github.io/rematch/#/plugins/persist?id=setup)

## Install

```cmd
npm i rematch-immer-combine-persist -S
```

## Options

```ts
interface ImmerOptions {
  blacklist?: string[]
  whitelist?: string[]
}

interface PersistOptions<S, RS, HSS, ESS> {
  persistConfig?: Partial<PersistConfig<S, RS, HSS, ESS>>
  persistorOptions?: PersistorOptions | null
  callback?: () => any
}

interface PluginOptions<S, RS, HSS, ESS> {
  immerOptions?: ImmerOptions
  persistOptions?: PersistOptions<S, RS, HSS, ESS>
}
```

## Usage

- Basic usage

  ```js
  // store.js
  import { init } from '@rematch/core'
  import immerCombinePersist from 'rematch-immer-combine-persist'
  import * as models from './models'

  const store = init({
    models,
    plugins: [
      immerCombinePersist()
    ]
  })

  export default store
  ```

  ```jsx
  // index.js
  import React from 'react'
  import ReactDOM from 'react-dom'
  import { Provider } from 'react-redux'
  import { PersistGate } from 'redux-persist/integration/react'
  import { getPersistor } from 'rematch-immer-combine-persist'
  import store from './store'
  import App from './App'

  const persistor = getPersistor()

  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  )
  ```

- Use with `@rematch/loading`

  ```js
  // store.js
  import { init } from '@rematch/core'
  import loading '@rematch/loading'
  import immerCombinePersist from 'rematch-immer-combine-persist'
  import * as models from './models'

  const store = init({
    models,
    plugins: [
      loading(),
      immerCombinePersist({
        immerOptions: {
          blacklist: ['loading']
        }
      })
    ]
  })

  export default store
  ```
