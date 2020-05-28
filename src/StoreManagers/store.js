import {applyMiddleware, createStore} from 'redux'
// import {combineReducers} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {routerMiddleware} from 'react-router-redux'
import {createBrowserHistory} from 'history'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
// import {coreReducers} from './reducers'
import {authRootSaga} from './AuthManager'
// const history = createHashHistory()
const history = createBrowserHistory()
const routeMiddleware = routerMiddleware(history)
const sagaMiddleware = createSagaMiddleware()

const middleware = [sagaMiddleware, routeMiddleware]

export default function configureStore(initialState) {
    const store = createStore(reducers, initialState, composeWithDevTools(applyMiddleware(...middleware)))

    // // Add dictionaries to keep track of the registered async reducers & sagas
    // store.asyncReducers = {}
    // store.asyncSagas = {}

    // // Create an inject reducer function
    // store.injectReducer = (key, asyncReducer) => {
    //     store.asyncReducers[key] = asyncReducer
    //     store.replaceReducer(combineReducers({...coreReducers, ...store.asyncReducers}))

    //     return store
    // }

    // // Create inject saga function
    // // This function checks for existing sagas with the same key
    // // If the saga does not already exist it uses sagaMiddleware to run the saga
    // store.injectSaga = (key, asyncSaga) => {
    //     if(!store.asyncSagas[key]) {
    //         store.asyncSagas[key] = sagaMiddleware.run(asyncSaga)
    //     }
    //     return store
    // }

    // Add all sagas below
    sagaMiddleware.run(authRootSaga)

    if (module.hot) {
        console.log("module.hot")
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers')
            store.replaceReducer(nextRootReducer)
        })
        return store
    }
}

export {history}