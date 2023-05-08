const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
app.use(express.json() )
app.use(cors())
// chat GPT config 
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);


app.get('/gpt', async (req, res)=>{
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: "Hello world"}],
  }); 
  console.log(completion.data.choices[0].message);

      res.json({
        "completion" : completion.data.choices[0].message,
      })
  console.log(completion.data);   
})


// send an message 

app.post('/gpt', async (req, res)=>{

  const {messagesChat} = req.body;
  console.log(messagesChat);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "You are a helpful assistant."},
      ...messagesChat
      // {role: "user", content: msg }
    ],
  });
  console.log(completion.data.choices[0].message);

      res.json({
        "completion" : completion.data.choices[0].message,
      })
  console.log(completion.data);   

})

app.get( "/davinci" ,async (req, res)=> {

  const completion = await openai.createCompletion({
    "model": "text-davinci-003",
    "prompt": "generer un article de 3000 mots sur les vaccances en afrique",
    "max_tokens": 2048,
    "temperature": 0.29

  }).then((completion) => {
    console.log(completion.data.choices[0])
    res.status(200).send(completion.data.choices[0].text);
  }).catch((err) => {
    res.status(400).send(err.message)
  })
  

})

// gtp react using
app.post('/gpt-react', async (req, res)=>{

  const {messagesChat} = req.body;
  console.log("req.body", req.body);

  const first_content = `Nous comprenons que la disponibilité des voitures est un élément important lors de la location. C'est pourquoi nous offrons des plages horaires flexibles pour répondre à vos besoins.
                              Nos plages horaires disponibles pour la location de voitures sont les suivantes :  
                              Plage horaire matinale : de 7h00 à 12h00
                              Plage horaire après-midi : de 12h00 à 18h00
                              Plage horaire de soirée : de 18h00 à 22h00
                              Veuillez noter que les plages horaires peuvent varier en fonction de la disponibilité des voitures et de la demande. Nous vous recommandons donc de réserver votre voiture à l'avance pour vous assurer d'avoir la plage horaire de votre choix.`
  
  const second_content = `Il y a de nombreux avantages à utiliser notre système de location de voitures en ligne. Voici quelques-uns des avantages clés que vous pourrez apprécier en utilisant notre service :

  Large sélection de voitures : Nous offrons une large sélection de voitures pour répondre à tous les besoins de location. Que vous ayez besoin d'une voiture économique pour un court trajet ou d'un SUV spacieux pour un voyage en famille, nous avons ce qu'il vous faut.
  
  Réservation en ligne facile : Notre système de réservation en ligne est facile à utiliser et pratique. Vous pouvez réserver votre voiture en quelques clics, choisir la plage horaire qui vous convient et effectuer le paiement en toute sécurité.
  
  Prix compétitifs : Nous proposons des prix compétitifs pour nos locations de voitures, avec des offres spéciales et des réductions disponibles tout au long de l'année. Vous pouvez ainsi économiser de l'argent tout en bénéficiant d'un service de qualité.
  
  Flexibilité de la location : Nous offrons des plages horaires flexibles pour la location de voitures, ce qui vous permet de choisir la plage horaire qui convient le mieux à votre emploi du temps. Vous pouvez également modifier ou annuler votre réservation en ligne à tout moment.
  
  Assurance et assistance routière : Toutes nos locations de voitures incluent une assurance et une assistance routière pour votre tranquillité d'esprit. Vous pouvez ainsi profiter de votre voyage en sachant que vous êtes couvert en cas de problème.
  
  En résumé, notre système de location de voitures en ligne offre un service pratique, flexible et économique pour répondre à tous vos besoins de location de voitures. Nous sommes là pour vous aider à trouver la voiture idéale pour votre prochain voyage et nous sommes impatients de vous offrir un excellent service.`
  
  
  const prompt = { "role": "system", "content":` considere les informations suivantes avant de repondre au question ${first_content} et ou ${second_content} `}
  console.log(prompt);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
        prompt,
        { "role": "user", "content":`${req.body.texte}`},
      // {role: "user", content: msg }
    ],
  });
  console.log(completion.data.choices[0].message);

      res.json({
        "completion" : completion.data.choices[0].message,
      })
  console.log(completion.data);   
})

app.post('/gpt-image', async (req, res)=>{

  console.log(req.body);

  const {messageValue_img} = req.body;
  console.log(messageValue_img);

  const response = await openai.createImage({
    prompt: `${messageValue_img}`,
    n: 2,
    size: "1000x1000",
  });
  console.log(response.data);

  res.json({
    "img_generate" : response.data,
  })
console.log(response.data.choices[0]);   

})

const port = process.env.PORT || 8090 
app.listen(port, ()=>{

    console.log(`Listening on port ${port}`)
})


