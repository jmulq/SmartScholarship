// require the necessary libraries
const faker = require("faker");
const MongoClient = require("mongodb").MongoClient;
require("dotenv/config");

async function seedDB() {
  const uri = process.env.DB_CONNECTION;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
  });
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const collection = client
      .db("smartScholarshipDb")
      .collection("scholarships");

    collection.drop();

    const scholarshipData = [
      {
        scholarshipId: "SCHOL1",
        name: "Scholarship 1",
        applicants: [
          {
            publicKey: "0x66833dCC2C5bC9f652c42F29B7c9AE13D297e6EE",
            examRecords: [
              { examId: "Exam 1", score: 100, complete: true },
              { examId: "Exam 2", score: 100, complete: true },
              { examId: "Exam 3", score: 100, complete: true },
            ],
            totalMark: 300,
          },
          {
            publicKey: "0x612333asCC2C5bs9f652a42F29B7c9AE13D2t7e6X",
            examRecords: [
              { examId: "Exam 1", score: 90, complete: true },
              { examId: "Exam 2", score: 90, complete: true },
              { examId: "Exam 3", score: 90, complete: true },
            ],
            totalMark: 270,
          },
          {
            publicKey: "0xCC83C9f5b24e61652C32F29B7663cAED297EEdc9",
            examRecords: [
              { examId: "Exam 1", score: 80, complete: true },
              { examId: "Exam 2", score: 80, complete: true },
              { examId: "Exam 3", score: 80, complete: true },
            ],
            totalMark: 240,
          },
        ],
      },
      {
        scholarshipId: "SCHOL2",
        name: "Scholarship 2",
        applicants: [
          {
            publicKey: "0x101249Q9FKDFSKVADFLSVAKV932C9",
            examRecords: [
              { examId: "Exam 1", score: 100, complete: true },
              { examId: "Exam 2", score: 100, complete: true },
              { examId: "Exam 3", score: 100, complete: true },
            ],
            totalMark: 300,
          },
          {
            publicKey: "0x612333asCC2C5bs9f652a42F29B7c9AE13D2t7e6X",
            examRecords: [
              { examId: "Exam 1", score: 90, complete: true },
              { examId: "Exam 2", score: 90, complete: true },
              { examId: "Exam 3", score: 90, complete: true },
            ],
            totalMark: 270,
          },
          {
            publicKey: "0xCC83C9f5b24e61652C32F29B7663cAED297EEdc9",
            examRecords: [
              { examId: "Exam 1", score: 80, complete: true },
              { examId: "Exam 2", score: 80, complete: true },
              { examId: "Exam 3", score: 80, complete: true },
            ],
            totalMark: 240,
          },
        ],
      },
    ];
    collection.insertMany(scholarshipData);
    console.log("Database seeded! :)");
    client.close();
  } catch (err) {
    console.log(err.stack);
  }
}
seedDB();
