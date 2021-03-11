import { ApolloServer } from 'apollo-server'
import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv';
import 'graphql-import-node';

import * as typeDefs from './schema.graphql'
import resolvers from "./resolvers";
import {Projects, Galleries} from './datasource';

import { DataSourceContainer } from './types/index'

dotenv.config();

const client = new MongoClient(process.env.MONGO_DB_URI, {
   useUnifiedTopology: true,
   useNewUrlParser: true
})
client.connect()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: (): DataSourceContainer<Projects | Galleries> => ({
    projects: new Projects(),
    galleries: new Galleries(),
  }),
  context: (context) => {
    return {
    API_KEY: context.req.headers['x-api_key'],
    projects: client.db().collection('projects'),
    galleries: client.db().collection('galleries'),
  }},
});

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
