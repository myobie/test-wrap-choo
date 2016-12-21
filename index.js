const choo = require('choo')
const html = require('choo/html')
const promisifyPlugin = require('barracks-promisify-plugin')
const logPlugin = require('choo-log')

const app = choo()
app.use(promisifyPlugin())
app.use(logPlugin())

app.model({
  state: { where: '/' },
  reducers: {
    updateWhere: (state, data) => ({ where: data })
  },
  effects: {
    go: (state, data, send) => {
      send('location:set', data)
      .then(() => send('updateWhere', data))
      .then(() => { console.log('ok, updated where and location') })
    }
  }
})

app.router({ default: '/' }, [
  ['/', mainView]
])

const tree = app.start()
document.body.appendChild(tree)

function mainView (state, prev, send) {
  return html`
    <div>
      <h1>Go anywhere!</h1>
      <h2>Current location: ${state.location.pathname}</h2>
      <p>
        <label for="loc">Go:</label><br>
        <input id="loc" oninput=${e => send('go', e.target.value)} />
      </p>
      <hr>
      <h2>Full state:</h2>
      <pre>${JSON.stringify(state)}</pre>
    </div>
  `
}
