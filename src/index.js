const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client')

const resolvers = {
	Query: {
		info: () => 'A hackernews website',
		feed: (root, args, context, info) => {
      return context.prisma.links()
    }
		// link: (parent, args) => {
		// 	const link = links.filter(link => link.id === args.id);
		// 	return link[0];
		// }
	},
	Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
      })
    },
		// updateLink: (parent, args) => {
		// 	links = links.filter(link => link.id !== args.id);
		// 	const link = {
		// 		id: args.id,
		// 		description: args.description,
		// 		url: args.url
		// 	};
		// 	links.push(link);
		// 	return link;
		// },
		// deleteLink: (parent, args) => {
		// 	const linkToDelete = links.filter(link => link.id === args.id);
		// 	links = links.filter(link => link.id !== args.id);
		// 	return linkToDelete[0];
		// }
  },  
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma }
});

server.start(() => console.log('Server is running on http://localhost:4000'));