
const feed = async (parent, args, context, info) => {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {};

  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });

  const count = await context.prisma
    .linksConnection({
      where,
    })
    .aggregate()
    .count();
  
  return {
    links,
    count,
  }
}

const users = async (parent, args, context, info) => {
  const users = await context.prisma.users();

  return users;
}

// TODO: Implement link
// link: (parent, args) => {
// 	const link = links.filter(link => link.id === args.id);
// 	return link[0];
// }

module.exports = {
  feed,
  users
}