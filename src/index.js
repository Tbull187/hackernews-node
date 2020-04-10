const { GraphQLServer } = require('graphql-yoga');

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]


let idCount = links.length

const resolvers = {
	Query: {
		info: () => 'A hackernews website',
		feed: () => links,
		link: (parent, args) => {
			const link = links.filter(link => link.id === args.id);
			return link[0];
		}
	},
	// GraphQL actually infers this!
	// Link: {
	// 	id: (parent) => parent.id,
	// 	description: (parent) => parent.description,
	// 	url: (parent) => parent.url,
	// },
	Mutation: {
    post: (parent, args) => {
			const link = {
				id: `link-${idCount++}`,
				description: args.description,
				url: args.url,
      };
      links.push(link);
      return link;
		},
		updateLink: (parent, args) => {
			// args.id, url, description;
			console.log('updateLink()');
			links = links.filter(link => link.id !== args.id);
			const link = {
				id: args.id,
				description: args.description,
				url: args.url
			};
			links.push(link);
			return link;
		},
		deleteLink: (parent, args) => {
			console.log('deleteLink()');
			const linkToDelete = links.filter(link => link.id === args.id);
			links = links.filter(link => link.id !== args.id);
			return linkToDelete[0];
		}
  },  
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers
});

server.start(() => console.log('Server is running on http://localhost:4000'));