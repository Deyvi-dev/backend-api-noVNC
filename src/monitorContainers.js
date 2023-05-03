const Docker = require("dockerode")

const docker = new Docker({ socketPath: "/var/run/docker.sock" })

async function monitorContainers() {
  try {
    const containers = await docker.listContainers()
    containers.forEach((containerInfo) => {
      // console.log(`Container ID: ${containerInfo.Id}`)
      // console.log(`Nome(s) do container: ${containerInfo.Names}`)
      // console.log(`Imagem: ${containerInfo.Image}`)
      // console.log(`Status: ${containerInfo.Status}`)
      // console.log(`Estado: ${containerInfo.State}`)
      // console.log("------------------------------------")
    })
  } catch (err) {
    console.error("Erro ao listar containers:", err)
  }
}

module.exports = { monitorContainers }
