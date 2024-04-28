const State = require('../model/State');

const getAllStates = async (req, res) => {
    const states = await State.find();
    if (!states) return res.status(204).json({ 'message': 'No states found.' });
    res.json(states);
}

const getState = async (req, res) => {
    const state = await State.findOne({ stateCode: req.params.state }).exec();
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
            { $push: { funFacts: req.body.funfacts } }
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

    //if (!Array.isArray(req.body.funfacts)) {
    //    return res.status(400).json({ 'message': 'State fun facts value must be an array'});
    //}

    try {
        const trueIndex = req.body.index - 1;
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
    try {
        const trueIndex = req.body.index - 1;
        console.log(await State.findOne({ stateCode: req.params.state }).funFacts)
        await State.updateOne(
            { stateCode: req.params.state },
            { $pull: {  } }
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