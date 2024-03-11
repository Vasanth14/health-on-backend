const allRoles = {
  admin: ['getUsers', 'manageUsers'],
  hospital: ['getUsers', 'manageUsers'],
  cheifDoctor: ['getUsers', 'manageUsers'],
  nurse: ['getUsers', 'manageUsers'],
  patient:[],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
