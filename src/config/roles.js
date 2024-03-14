const allRoles = {
  admin: ['getHospitals', 'manageHospitals'],
  hospital: ['createCheifDoctor', 'getCheifDoctors', 'manageCheifDoctors','createDoctors','getDoctors', 'manageDoctors'],
  doctor: ['createDoctors', 'getDoctors', 'manageDoctors'],
  cheifDoctor: ['createDoctors','getDoctors', 'manageDoctors'],
  nurse: ['getUsers', 'manageUsers'],
  patient:[],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
