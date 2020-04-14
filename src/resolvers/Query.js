
const feed = (parent, args, context, info) => { context.prisma.links() };

module.exports = {
  feed,
}