const request = require("supertest")
const app = require("../src/server")


describe("Teste para start_container", () => {
  let containerIds = [];
  test("Deve criar um novo container com uma porta disponível", async () => {
    const res = await request(app).post("/api/start_container").send({
      url: "https://www.google.com",
    });
    containerIds.push(res.body.id)
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("port");

  });
  test("Deve remover os containers criados anteriormente", async () => {
    // espera os contêineres serem criados antes de removê-los
    for (let containerId of containerIds) {
      const res = await request(app).post("/api/remove_container").send({
        id: containerId,
      });
      expect(res.statusCode).toEqual(200);
      expect(containerId).toBeDefined();
    }
  }, 30000); //30seg
});
