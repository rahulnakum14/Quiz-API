const { employee } = require('./employee');
const { timetracking } = require('./timetracking');

timetracking.belongsTo(employee, { foreignKey: 'empId' });
