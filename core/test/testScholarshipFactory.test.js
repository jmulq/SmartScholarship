const ScholarshipFactory = artifacts.require("ScholarshipFactory");

contract("ScholarshipFactory", (accounts) => {
  let scholarshipFactory;

  before(async () => {
    scholarshipFactory = await ScholarshipFactory.deployed();
  });

  describe("creating a scholarship and getting all scholarships", async () => {
    before("create a scholarship using accounts[0]", async () => {
      await scholarshipFactory.createScholarship("Scholarship #1", 100, 10000, {
        from: accounts[0],
      });
      //   const expectedCreator = accounts[0];
    });

    // it increments count
    it("increments the scholarship count", async () => {
      const count = await scholarshipFactory.scholarshipCount();
      assert.equal(count, 1, "The scholarship count should be 1.");
    });
    // it gets the correct scholarships
    it("can get the array of all scholarships", async () => {
      const scholarships = await scholarshipFactory.getScholarships();

      assert.equal(
        scholarships.length,
        1,
        "Scholarships should contain 1 scholarship."
      );
      // Todo Change test and/or functionality of what is stored in array of scholarships
      assert.equal(
        scholarships[0],
        accounts[0],
        "Scholarship should have address of accounts[0]"
      );
    });
    // it emits an event
  });
});
