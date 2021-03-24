const ScholarshipFactory = artifacts.require("ScholarshipFactory");
const Scholarship = artifacts.require("Scholarship");

module.exports = async function (deployer) {
  deployer.deploy(ScholarshipFactory);
};
