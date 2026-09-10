function vendorScope(user, vendorField = 'vendorId') {
  if (user.role === 'ADMIN') return {};
  return { [vendorField]: user.vendorId };
}

module.exports = vendorScope;