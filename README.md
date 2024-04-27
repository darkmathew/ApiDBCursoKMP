# Documentação da API

## Descrição

Esta é uma API de exemplo que serve como um serviço web atrelado a um banco de dados. Ela foi projetada para ser consumida por uma aplicação KMP. A API permite a criação e autenticação de usuários, bem como a criação, atualização e exclusão de itens.

## Problemas de Segurança

Embora esta API seja apenas um exemplo, é importante destacar alguns problemas de segurança:

1. **Armazenamento de Senhas**: As senhas são armazenadas usando bcrypt, que é uma boa prática. No entanto, não há nenhuma menção sobre o uso de um "salt" para aumentar a segurança do hash. Isso pode tornar as senhas mais vulneráveis a ataques de força bruta.

2. **SSL/TLS**: A opção `rejectUnauthorized: false` está sendo usada, o que pode levar a problemas de segurança, pois isso desativa a verificação do certificado SSL/TLS. Isso pode permitir ataques man-in-the-middle.

3. **Dados Sensíveis no Código**: A string de conexão do banco de dados está codificada diretamente no código, o que é uma má prática. Isso deve ser armazenado em variáveis de ambiente ou em algum tipo de configuração segura.

4. **Forçar Sincronização do Banco de Dados**: A opção `force: true` está sendo usada ao sincronizar o banco de dados. Isso irá forçar a criação das tabelas, descartando/dropando as tabelas existentes, o que pode levar à perda de dados.

## Rotas

A tabela a seguir descreve as rotas disponíveis na API:

| Método | Rota | Descrição | Parâmetros | Resposta de Sucesso | Resposta de Erro |
|--------|------|-----------|------------|---------------------|------------------|
| POST | /register | Registra um novo usuário | username, password | Status 201, JSON com detalhes do usuário | Status 400, JSON com mensagem de erro |
| POST | /authenticate | Autentica um usuário existente | username, password | Status 200, JSON com sucesso: true e userId | Status 400, JSON com mensagem de erro |
| GET | /items/:userId | Obtém todos os itens de um usuário | userId (na rota) | Status 200, JSON com lista de itens | Status 404, JSON com mensagem de erro |
| POST | /item | Cria um novo item | name, quantity, userId | Status 201, JSON com sucesso: true e itemId | Status 400, JSON com mensagem de erro |
| PUT | /item/:itemId | Atualiza um item existente | name, quantity, userId, itemId (na rota) | Status 200, JSON com sucesso: true | Status 400 ou 404, JSON com mensagem de erro |
| DELETE | /item/:itemId | Exclui um item existente | itemId (na rota) | Status 200, JSON com sucesso: true | Status 404, JSON com mensagem de erro |

## Erros

Os erros são retornados como um objeto JSON com uma chave de mensagem. Por exemplo:

```json
{
  "message": "Username and password are required."
}
```

## Inicialização

A API é iniciada na porta definida pela variável de ambiente PORT, ou na porta 3000 se a variável de ambiente não estiver definida. A API também define tempos limite de keep-alive e de cabeçalho para 120 segundos.

## Sincronização do Banco de Dados

Na inicialização, a API sincroniza os modelos com o banco de dados usando `sequelize.sync({ force: true })`. Isso cria as tabelas se elas não existirem. No entanto, se as tabelas já existirem, a opção `force: true` fará com que elas sejam descartadas e recriadas, o que pode levar à perda de dados. Por favor, esteja ciente disso ao usar esta API.

## Hospedagem e Banco de Dados

Esta API está hospedada na plataforma [Render](https://render.com/), utilizando seu plano gratuito. A Render é uma plataforma de hospedagem em nuvem que oferece uma variedade de serviços, incluindo hospedagem de aplicativos web, como esta API.

Além disso, a API está utilizando uma instância do banco de dados PostgreSQL, também disponibilizada gratuitamente pela plataforma Render. O PostgreSQL é um sistema de gerenciamento de banco de dados relacional de código aberto, que é conhecido por sua robustez e recursos.

Por favor, note que embora a Render ofereça um plano gratuito, existem limitações associadas a ele, como limites de recursos e tempo de atividade. Para uso em produção ou para aplicações de alto tráfego, pode ser necessário considerar a atualização para um plano pago. Consulte a documentação da Render para obter mais detalhes.

Lembre-se de que, embora a Render e o PostgreSQL sejam seguros por si só, a segurança do seu aplicativo também depende de como ele é codificado e configurado. Certifique-se de seguir as melhores práticas de segurança ao desenvolver seu aplicativo, como mencionado na seção de Problemas de Segurança acima.
