const { Requester, Validator } = require('@chainlink/external-adapter')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  action: ['action'],
  scholarshipId: false,
  scholarshipName: false,
  scholarshipConfig: false,
  endpoint: false
}

const getSuccessfulApplicant = (applicants) => {
  const canComplete = applicants.every(applicant => applicant.records.filter(record => !record.complete).length === 0);
  if (canComplete) {
    return applicants.reduce((prev, curr) =>
      curr.totalMark > prev.totalMark ? curr : prev
    )
  } else {
    return '-'
  }
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams)
  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint || 'scholarships'

  let config
  let url

  const { action } = validator.validated.data

  switch (action) {
    case 'createScholarship':
      url = `http://localhost:3000/${endpoint}/`
      config = {
        url,
        method: 'post',
        data: {
          scholarshipId: validator.validated.data.scholarshipId,
          name: validator.validated.data.scholarshipName
        }
      }
      break
    case 'getScholar':
      url = `http://localhost:3000/${endpoint}/${validator.validated.data.scholarshipId}`
      config = {
        url
      }
      break
    default:
      break
  }

  // This is where you would add method and headers
  // you can add method like GET or POST and add it to the config
  // The default is GET requests
  // method = 'get'
  // headers = 'headers.....'

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then((response) => {
      const result = getResponseData(action, response)

      response.data.result = result

      callback(response.status, Requester.success(jobRunID, response))
    })
    .catch((error) => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

// Todo refactor inner logic into seperate functions
const getResponseData = (action, response) => {
  if (action === 'createScholarship') {
    return response.data.scholarshipId
  } else if (action === 'getScholar') {
    // Set the result to the public address of the applicant with the highest marks
    const successfulApplicant = getSuccessfulApplicant(
      response.data.applicants
    )
    return successfulApplicant.publicKey
  }
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
