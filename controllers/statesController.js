const State = require('../model/State');
const fsPromises = require('fs').promises;

const getAllStates = async (req, res) => {
    const data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const states = JSON.parse(data);
    const statesFromDb = await State.find();
    for (let state of states) {
        const stateFromDb = statesFromDb.find((element) => element.stateCode === state.code);
        state.funFacts = stateFromDb['funFacts'];
    }
    return res.status(200).json(states);
}

const getState = async (req, res) => {
    const data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const state = JSON.parse(data).find((element) => element.code === req.params.state);
    const stateFromDb = await State.findOne({ stateCode: req.params.state }).exec();
    state.funfacts = stateFromDb['funFacts'];
    return res.status(200).json(state);
}

const createFunFact = async (req, res) => {
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required'});
    }

    if (!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array'});
    }

    try {
        await State.updateOne(
            { stateCode: req.params.state },
            { $addToSet: { funFacts: req.body.funfacts } }
        );
        const state = await State.findOne({ stateCode: req.params.state }).exec();
        return res.status(201).json(state);
    } catch (err) {
        console.error(err);
    }
}

const updateFunFact = async (req, res) => {
    if (!req?.body?.index || req.body.index < 1) {
        return res.status(400).json({ 'message': 'State fun fact index value required'});
    }
    if (!req?.body?.funfact) {
        return res.status(400).json({ 'message': 'State fun fact value required'});
    }

    const trueIndex = req.body.index - 1;
    const stateObject = await State.findOne({ stateCode: req.params.state });
    if (!stateObject.funFacts[trueIndex]) {
        return res.status(404).json({ 'message': 'No Fun Fact found at that index for STATE'});
    }

    try {
        await State.updateOne(
            { stateCode: req.params.state },
            { $set: { [`funFacts.${trueIndex}`]: req.body.funfact } }
        );
        const state = await State.findOne({ stateCode: req.params.state }).exec();
        return res.status(201).json(state);
    } catch (err) {
        console.error(err);
    }
}

const deleteFunFact = async (req, res) => {
    if (!req?.body?.index || req.body.index < 1) {
        return res.status(400).json({'message': 'State fun fact index value required'});
    } 

    const trueIndex = req.body.index - 1;
    const stateObject = await State.findOne({ stateCode: req.params.state });
    if (!stateObject.funFacts[trueIndex]) {
        return res.status(404).json({ 'message': 'No Fun Fact found at that index for STATE'});
    }

    try {
        await State.updateOne(
            { stateCode: req.params.state },
            { $pull: { "funFacts": stateObject.funFacts[trueIndex] } }
        );
        const state = await State.findOne({ stateCode: req.params.state }).exec();
        return res.status(201).json(state);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getAllStates,
    createFunFact,
    updateFunFact,
    deleteFunFact,
    getState
}