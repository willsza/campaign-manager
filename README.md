Este projeto utiliza **NestJS** como framework principal para a construção de uma aplicação eficiente e escalável do lado do servidor. **TypeORM** é empregado para o mapeamento objeto-relacional, facilitando a interação com o banco de dados e garantindo uma integração fluida com **NestJS**. O **Docker** é utilizado para prover o banco de dados, assegurando um ambiente consistente e fácil de configurar para desenvolvimento e produção. A utilização dessas tecnologias proporciona uma base sólida para o desenvolvimento rápido e eficiente de aplicações robustas. Além disso, a implementação de uma boa cobertura de testes é essencial para garantir a confiabilidade e a estabilidade da aplicação, permitindo identificar e corrigir erros antes que eles afetem o ambiente de produção.


## Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)**: Um framework Node.js progressivo para a construção de aplicações eficientes e escaláveis do lado do servidor.
- **[TypeORM](https://typeorm.io/)**: Um ORM (Object Relational Mapper) para TypeScript e JavaScript (ES7, ES6, ES5) que pode ser executado em plataformas Node.js, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo e Electron.
- **[Docker](https://www.docker.com/)**: Plataforma para desenvolvimento, envio e execução de aplicações em containers, utilizada para prover o banco de dados.

## Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão mais recente do `Node.js`.
- Você tem um gerenciador de pacotes como `npm` ou `yarn` instalado.
- Você tem o `Docker` instalado e configurado.

## Instalação

1. Clone o repositório

    ```bash
    git clone git@github.com:willsza/campaign-manager.git
    ```

2. Navegue até o diretório do projeto

    ```bash
    cd nome-do-repositorio
    ```

3. Instale as dependências

    ```bash
    pnpm install
    ```

## Configuração

Certifique-se de configurar suas variáveis de ambiente no arquivo `.env`, conforme o exemplo abaixo:

```
# Exemplo de variáveis de ambiente
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=usuario
DB_PASSWORD=senha
DB_DATABASE=nome-do-banco
```

## Configuração do Docker

Utilize o arquivo `docker-compose.yml` incluído no projeto para configurar e iniciar o banco de dados com Docker. O arquivo pode se parecer com o exemplo abaixo:

```yaml
version: '3.8'

services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_DB: nome-do-banco
      POSTGRES_USER: usuario
      POSTGRES_PASSWORD: senha
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## Uso

Para iniciar o projeto, execute:

```
# Sobe container para o banco de dados
docker-compose up -d

# Adiciona dados iniciais ao banco de dados
npm run seed 

# Inicia a aplicação
npm run start:dev
```
Abra http://localhost:3001 com seu navegador para ver o resultado.

## Estrutura do Projeto
Aqui está a estrutura básica do projeto:

```
/nome-do-repositorio
├── src
│   ├── modules
│   │   └── ...
│   ├── entities
│   │   └── ...
│   ├── controllers
│   │   └── ...
│   ├── services
│   │   └── ...
│   ├── main.ts
│   └── ...
├── .env
├── docker-compose.yml
├── ormconfig.json
├── package.json
└── tsconfig.json
```

## Rodando os Testes

Para rodar os testes, utilize o seguinte comando:

```
npm run test
# ou
yarn test
```

Para rodar os testes com cobertura, utilize:

```
npm run test:cov
# ou
yarn test:cov
```
