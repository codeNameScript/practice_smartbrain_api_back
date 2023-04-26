const fetch = require('node-fetch');

const MODEL_ID = 'face-detection';
const returnClarifaiRequestOptions = (imageUrl) => {
  const PAT = '6a937bf6d44f4a9597af2fac9be9f8e5';
  const USER_ID = 'naoki';
  const APP_ID = 'test';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
}

const handleApiCall = (req, res) => {
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(req.body.input))
    .then(response => response.json())
    .then(data => {
        res.json(data)
        console.log(data)
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}