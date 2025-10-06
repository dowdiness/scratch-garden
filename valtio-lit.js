import { subscribe } from './valtio.js'

class StateController {
  // LitElement
  host
  // () => void
  unsubscribe
  //  valtio proxy
  state

  constructor(host, state) {
    this.host = host
    this.state = state

    this.unsubscribe = subscribe(state, () => this.host.requestUpdate())
    this.host.addController(this)
  }

  hostConnected() {
    this.host.requestUpdate()
  }

  hostDisconnected() {
    this.unsubscribe()
  }
}

function useState(host, state) {
  return new StateController(host, state).state
}

export { StateController, useState }
