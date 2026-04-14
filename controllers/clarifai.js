const handleClarifai=(req, res) => {
  const { input } = req.body;

  const PAT = '6adc71380d8041bba62eb9632735fd79';
  const USER_ID = 'clarifai';       
  const APP_ID = 'main';
  const MODEL_ID = 'face-detection';

  fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID
      },
      inputs: [
        {
          data: {
            image: input.startsWith('data:')
            ? { base64: input.split(',')[1] }
            : { url: input }          }
        }
      ]
    })
  })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(err => res.status(400).json('error calling clarifai'));
}

export default handleClarifai;