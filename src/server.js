const { v4: uuidv4 } = require("uuid")
const { monitorContainers } = require("./monitorContainers")

const express = require("express")
const Docker = require("dockerode")

const docker = new Docker({ socketPath: "/var/run/docker.sock" })
const app = express()
const cors = require("cors");


const host = 'http://localhost';

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json())

const reservedPorts = new Set()

app.post("/api/start_container", async (req, res) => {
  const { url } = req.body
  const imageName = "chrome_novnc"
  const minPort = 8440
  let portReserved = 0
  try {
    // Verifica as portas usadas pelos containers existentes
    const containers = await docker.listContainers()
    const usedPorts = new Set()
    containers.forEach((container) => {
      const containerPort = parseInt(container.Ports[0].PublicPort)
      usedPorts.add(containerPort)
    })

    // Encontra a menor porta disponível que não está reservada
    let newContainerPort = minPort
    while (
      usedPorts.has(newContainerPort) ||
      reservedPorts.has(newContainerPort)
    ) {
      newContainerPort++
    }
    reservedPorts.add(newContainerPort)
    portReserved = newContainerPort


    const newContainerName = `${imageName}_container_${uuidv4()}`
    const container = await docker.createContainer({
      Image: imageName,
      name: newContainerName,
      Env: [`START_URL=${url}`],
      ExposedPorts: { "8080/tcp": {} },
      HostConfig: {
        PortBindings: {
          "8080/tcp": [{ HostPort: newContainerPort.toString() }],
        },
      },
    })

    await container.start()
    console.log(`Container ${container.id} iniciado.`)
    let domain = `${host}:${newContainerPort}/?password=12345&autoconnect=true`
    res.status(200).json({
      id: container.id,
      port: newContainerPort,
      url: domain
    })
console.log("acesse essa url", domain)
    // Monitora os containers depois de criar um novo
    monitorContainers()
  } catch (err) {
    console.error("Erro ao criar container:", err)
    res.sendStatus(500)
  } finally {
    reservedPorts.delete(portReserved)
  }
})

// remove o container A partir do id
app.post("/api/remove_container", async (req, res) => {
  const { id } = req.body
  // validando o json recebido
  if (!Object.keys(req.body).includes("id")) {
    console.error("JSON inválido:", req.body)
    res.status(400).send("JSON inválido")
    return
  }
  const container = docker.getContainer(id)

  try {
    const data = await container.inspect()
    if (data.State.Status === "running") {
      await container.stop()
    }
    await container.remove()
    console.log(`Container ${id} removido.`)
    res.sendStatus(200)
  } catch (err) {
    if (err.statusCode === 404) {
      console.error("Container não encontrado:", err)
      res.sendStatus(404)
    } else {
      console.error("Erro ao remover container:", err)
      res.sendStatus(500)
    }
  }
})



module.exports = app
