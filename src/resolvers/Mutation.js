const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

const login = async (parent, args, context, info) => {  
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

const post = (root, args, context, info) => {
  const userId = getUserId(context);
  
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  })
}

const vote = async (root, args, context, info) => {
  const userId = getUserId(context);

  const voteExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  });
  if (voteExists) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  })
}

// TODO: Implement updateLink & deleteLink
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

module.exports = {
  signup,
  login,
  post,
  vote
}