const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//////////////////////////////// ID VALIDATION////////////////////////////////

function validId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ erro: "id inválido!" });
  }
}

//////////////////////////////// GET////////////////////////////////

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

//////////////////////////////// POST////////////////////////////////

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);
  return response.status(200).json(repository);
});

//////////////////////////////// UPDATE////////////////////////////////
app.put("/repositories/:id", validId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "repositóŕio não encontrado!" });
  }
  const repository = { id, title, url, techs, likes };

  repositories[repoIndex] = repository;
  console.log(repository);
  return response.status(200).json(repository);
});

//////////////////////////////// DELETE////////////////////////////////
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "repositóŕio não encontrado!" });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

//////////////////////////////// ADD LIKES////////////////////////////////

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "repositóŕio não encontrado!" });
  }

  repositories[repoIndex] = {...repositories[repoIndex], likes: repositories[repoIndex].likes + 1}
  

  return response.status(200).json(repositories[repoIndex]);
});

module.exports = app;
