const State = require('../model/State');
const fsPromises = require('fs').promises;

const getAllStates = async (req, res) => {
    const data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const statesFromDb = await State.find();
    const nonContigStates = ['AK', 'HI'];
    const contigStates =
    ['AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
    'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', , 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
    'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    let tempStates;
    let states;

    if (typeof req.query.contig === 'undefined') {
        states = JSON.parse(data);
    } else if (req.query.contig.toLowerCase() === 'true') {
        tempStates = JSON.parse(data);
        states = tempStates.filter((state) => contigStates.includes(state.code));
    } else if (req.query.contig.toLowerCase() === 'false') {
        tempStates = JSON.parse(data)
        states = tempStates.filter((state) => nonContigStates.includes(state.code));
    }


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

const getFunFact = async (req, res) => {
    const data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const state = JSON.parse(data).find((element) => element.code === req.params.state);
    const stateFromDb = await State.findOne({ stateCode: req.params.state }).exec();
    const stateFunFacts = stateFromDb['funFacts'];
    if (stateFunFacts.length === 0) return res.status(404).json({ 'message': `No Fun Facts found for ${state['state']}` });
    const randomIndex = Math.floor(Math.random() * stateFunFacts.length);
    return res.status(200).json({ 'funfact': `${stateFunFacts[randomIndex]}` });
}

const getStateCapital = async (req, res) => {
    const data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const state = JSON.parse(data).find((element) => element.code === req.params.state);
    return res.status(200).json({ 'state': `${state.state}`, 'capital': `${state.capital_city}`});
}

const getStateNickname = async (req, res) => {
    const data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const state = JSON.parse(data).find((element) => element.code === req.params.state);
    return res.status(200).json({ 'state': `${state.state}`, 'nickname': `${state.nickname}`});
}

const getStatePopulation = async (req, res) => {
    const data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const state = JSON.parse(data).find((element) => element.code === req.params.state);
    return res.status(200).json({ 'state': `${state.state}`, 'population': `${state.population}`});
}

const getStateAdmissionDate = async (req, res) => {
    const data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const state = JSON.parse(data).find((element) => element.code === req.params.state);
    return res.status(200).json({ 'state': `${state.state}`, 'admitted': `${state.admission_date}`});
}

const createFunFact = async (req, res) => {
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    if (!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
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
    const data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const state = JSON.parse(data).find((element) => element.code === req.params.state);
    const trueIndex = req.body.index - 1;
    const stateObject = await State.findOne({ stateCode: req.params.state });
    if (!stateObject.funFacts[trueIndex]) {
        return res.status(404).json({ 'message': `No Fun Fact found at that index for ${state['state']}`});
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
    const data = await fsPromises.readFile('./model/statesData.json', { encoding: 'utf8' });
    const state = JSON.parse(data).find((element) => element.code === req.params.state);
    const trueIndex = req.body.index - 1;
    const stateObject = await State.findOne({ stateCode: req.params.state });
    if (!stateObject.funFacts[trueIndex]) {
        return res.status(404).json({ 'message': `No Fun Fact found at that index for ${state['state']}`});
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
    getFunFact,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmissionDate,
    createFunFact,
    updateFunFact,
    deleteFunFact,
    getState
}