# API NoVNC 

API NoVNC - Abre um container com noVNC e exibe uma desktop virtual da URL fornecida

## Descrição

Este projeto é uma API que, a partir do envio de uma request, abre um container com noVNC e exibe uma desktop virtual da URL fornecida. O objetivo é permitir que os usuários acessem sites e aplicativos de forma segura e isolada em um ambiente virtual.

## Pré-requisitos

Antes de começar, certifique-se de ter o Docker instalado em sua máquina. Você pode baixá-lo em: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

## Instalação

Para iniciar projeto e fazer build do container, execute o seguinte comando no terminal:

```bash
sudo docker build --build-arg STARTUP_FILE=startup.sh -t chrome_novnc .
```

Em seguida, instale as dependências do projeto executando o seguinte comando:

```
npm install
```

## Como executar

Para executar o projeto, utilize o seguinte comando:

```
npm start
```

comando de teste:

```
npm test
```

Acesse o projeto no seu navegador em: [http://localhost:3000] para as request e [http://localhost:8440] para os containers no range de portas 8440 em diante

## Request na api

criando container

rota: http://localhost:3000/api/start_container
exemplo de schema:

```
{
    "url":"https://www.youtube.com/live/NXAQzLS_UGY?feature=share"

}
```

remover container

rota: http://localhost:3000/api/remove_container
exemplo de schema:

```
{
    "id":"id do container"
}
```

## Contribuição

Para contribuir com o projeto, siga as etapas abaixo:

1. Faça um fork do projeto
2. Crie uma nova branch ( `git checkout -b feature/nome-da-nova-feature` )
3. Faça suas alterações e commit ( `git commit -m 'Adiciona nova feature'` )
4. Faça um push para a branch ( `git push origin feature/nome-da-nova-feature` )
5. Abra um pull request
