#!/usr/bin/env node

// Set environment variables
const dotenv = require("dotenv");
dotenv.config();


// MongoDB Connection
const mongoose = require("mongoose");

const IP = process.env.MONGODB_IP || "127.0.0.1";
const PORT = process.env.MONGODB_PORT || "27017";
const HOST = IP + ":" + PORT;

mongoose.connect("mongodb://" + HOST, {
  useNewUrlParser: true,
  dbName: 'utsav',
});

mongoose.Promise = global.Promise;
const DB = mongoose.connection;
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error: "));


// Models
const College = require("../src/models/College");
const Event = require("../src/models/Event");
const Judge = require("../src/models/Judge");
const Leaderboard = require("../src/models/Leaderboard");
const Participant = require("../src/models/Participant");
const Round = require("../src/models/Round");
const Score = require("../src/models/Score");
const Slot = require("../src/models/Slot");
const Team = require("../src/models/Team");
const User = require("../src/models/User");

let criteriaList = [
   {"name" : "Painting", "id": "5c894a34ba1190463e34ab99", "criteria" : ["Creativity", "Appropriate use of color", "Clarity of Theme", "Overall Appeal / Impact"]},
   {"name" : "Cartooning", "id": "5c894c53ba1190463e34ab9b", "criteria" : ["Creativity & Skill", "Satire / Humour", "Depiction of Theme", "Overall Appeal / Impact"]},
   {"name" : "Debate" , "id" : "5c894e1fba1190463e34ab9d", "criteria" : ["Content / Relevance to Topic", "Fluency & Confidence", "Planning & Presentation", "Judges Round"]},
   {"name" : "Extempore", "id" : "5c895029ba1190463e34aba0", "criteria"  : ["Content / Relevance to topic", "Fluency & Diction", "Confidence & Body Language", "Planning & Presentation"]},
   {"name" : "Instrumental Solo", "id" : "5c895282ba1190463e34aba2", "criteria"  : ["Tune", "Rhythm & Synchronization", "Clarity of Notes", "Modulation & Improvisation"]},
   {"name" : "Pot Pourri", "id" : "5c8953b6ba1190463e34aba5", "criteria"  : []},
   {"name" : "Cultural Parade", "id" : "5c895490ba1190463e34aba7", "criteria"  : ["Variety / Creativity", "Theme / Cultural Relevance", "Quality / Skill of item", "Overall Presentation"]},
   {"name" : "Indian Non Classical Light Vocal (Group)", "id" : "5c89572bba1190463e34abab", "criteria"  : ["Tune", "Rhythm", "Synchronization", "Modulation & Improvisation"]},
   {"name" : "Folk Dance", "id" : "5c8957e9ba1190463e34abad", "criteria"  : ["Authenticity of song and dance", "Coordination", "Costume and props", "Expression / Grace / Overall Presentation"]},

   {"name" : "Rangoli", "id" : "5c895087ba1190463e34aba1", "criteria"  : ["Depiction of idea", "Appropriate use of colours", "Design & Technique", "Neatness  & Presentation"]},
   {"name" : "Collage", "id" : "5c89577cba1190463e34abac", "criteria"  : ["Relevance to Topic", "Creativity", "Space Utilization","Neatness  & Presentation"]},
   {"name" : "Quiz (Prelims)", "id" : "5c896579ba1190463e34abbd", "criteria"  : []},
   {"name" : "Stand Up Comedy", "id" : "5c8960feba1190463e34abb8", "criteria"  : []},
   {"name" : "Antakshari (Prelims)", "id" : "5c896371ba1190463e34abbb", "criteria"  : []},
   {"name" : "Indian Classical Vocal (Solo)", "id" : "5c895a6bba1190463e34abaf", "criteria"  : ["Shruthi (sur)", "Taal (rhythm)", "Expression, Diction", "Modulation & Improvisation"]},
   {"name" : "Creative Jam", "id" : "5c895d09ba1190463e34abb4", "criteria"  : ["Creativity", "Tune &/or Rhythm", "Synchronization / Coordination", "Overall Presentation"]},
   {"name" : "Indian Classical Dance (Solo)", "id" : "5c895d37ba1190463e34abb6", "criteria"  : ["Technical Skill (Nritta)", "Expression (Abhinaya)", "Rhythm (Tala)", "Aharya (costume) & Stage utilization"]},
   {"name" : "Indian Non Classical Dance (Solo)", "id" : "5c895bccba1190463e34abb1", "criteria"  : ["Choreography", "Stage Utilization", "Facial Expression", "Costume & Overall Presenation"]},
   {"name" : "Indian Non Classical Dance (Group)", "id" : "5c895a20ba1190463e34abae", "criteria"  : ["Choreography", "Stage Utilization", "Synchronization / Coordination", "Costume & Overall Presenation"]},

   {"name" : "Spot Photography", "id" : "5c8964c1ba1190463e34abbc", "criteria"  : []},
   {"name" : "Installation", "id" : "5c8952b6ba1190463e34aba3", "criteria"  : ["Depiction of idea, Innovation, Choice of building units, Neatness and presentation"]},
   {"name" : "Poetry (English)", "id" : "5c894cfcba1190463e34ab9c", "criteria"  : ["Originality & Imagination", "Language / Vocabulary", "Recitation(rhyme & meter)", "Meaning & overall impact"]},
   {"name" : "Poetry(Hindi)", "id" : "5c8954c6ba1190463e34aba8", "criteria"  : ["Originality & Imagination", "Language / Vocabulary", "Recitation(rhyme & meter)", "Meaning & overall impact"]},
   {"name" : "Mimicry", "id" : "5c8956e5ba1190463e34abaa", "criteria"  : ["Relevance to Theme", "The flow of expression and ideal voice modulations", "Confidence in performace including gestures(Acting skills)", "overall impression"]},
   {"name" : "Western Vocal(Solo)", "id" : "5c895b48ba1190463e34abb0", "criteria"  : ["Tune", "Rhythm", "Expression & Diction", "Modulation & Improvisation"]},
   {"name" : "Western Vocal(Group)", "id" : "5c895d26ba1190463e34abb5", "criteria"  : ["Tune", "Rhythm", "Synchronization", "Modulation & Improvisation"]},
   {"name" : "Indian Non classical light vocal (Solo)", "id" : "5c895f82ba1190463e34abb7", "criteria"  : ["Tune", "Rhythm", "Synchronization", "Modulation & Improvisation"]},
   {"name" : "Western Dance(Solo)", "id" : "5c89624eba1190463e34abba", "criteria"  : ["Choreography", "Stage Utilization", "Facial Expression", "Costume & overall presentation"]},
   {"name" : "Western Dance(Group)", "id" : "5c896134ba1190463e34abb9", "criteria"  : ["Choreography", "Stage Utilization", "Synchronization / Cooridination", "Costume & overall presentation"]},

   {"name" : "Jam", "id" : "5c894996ba1190463e34ab98", "criteria": []},
   {"name" : "Clay Modeling", "id" : "5c894b90ba1190463e34ab9a", "criteria" : ["Theme", "Creativity", "Skill", "Overall Impact"]},
   {"name" : "Mime", "id" : "5c894fd3ba1190463e34ab9e", "criteria"  : ["Depiction of Topic", "Excellence in Synchrony", "Communication through action", "Overall Presentation"]},
   {"name" : "Street Play", "id" : "5c895305ba1190463e34aba4", "criteria"  : ["Relevance to Topic", "Coodination among the players", "Acting and Dialogue delivery", "Overall Presentation"]},
   {"name" : "Mad Ads", "id" : "5c8953fcba1190463e34aba6", "criteria"  : ["Correlation of Idea to Product", "Teamwork", "Narration & Acting", "Originality & Creativity"]},
   {"name" : "Fashion Show", "id" : "5c895538ba1190463e34aba9", "criteria"  : ["Theme & Relevance to Theme", "Creativity and Design of Costumes", "Formation and Ramp Walk", "Overall Presentation"]},

   {"name" : "Flower arrangement", "id" : "5c895be6ba1190463e34abb2", "criteria": ["Choice of Flowers", "Arrangement Tactics", "Choice of Accessories", "Presentation & Overall Appeal"]},
   {"name" : "Variety Entertainment", "id" : "5c895cffba1190463e34abb3", "criteria": ["Variety / Creativity", "Stage Presentation", "Quality / Skill of Item", "Overall Appeal"]}
];

const createRound = async (id, criteria) => {
  let event = await Event.findById(id);

  let round = await Round.create({
    event: event.id,
    teams: [],
    criteria: criteria,
    slottable: true,
    status: 1,
  });

  event.rounds.push(round.id);
  await event.save();
};

for (let criterion of criteriaList) {
  createRound(criterion.id, criterion.criteria);
}