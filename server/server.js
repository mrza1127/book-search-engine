const express = require('express');
const path = require('path');

//apollo server
const { ApolloServer } = require('apollo-server-express');

// typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const {authMiddleware} = require('./utils/auth');


const db = require('./config/connection');
// const routes = require('./routes');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => 
    console.log(`API server running on port ${PORT}`));
    console.log(`Use GraphQL at https://localhost:${PORT}${server.graphqlPath}`);
});
