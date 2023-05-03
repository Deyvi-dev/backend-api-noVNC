const app = require("./server")

const port = 3000;

app.get('/', (req, res) => {
  res.send('Servidor Ativo')
})
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})