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
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID paramater is required'});
    }

    const state = await State.findOne({ _id: req.body.id }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches ID ${req.body.id}.` });
    }
    if (req.body?.firstname) state.firstname = req.body.firstname;
    if (req.body?.lastname) state.lastname = req.body.lastname;
    const result = await state.save();
    res.json(result);
}

const deleteFunFact = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({'message': 'State ID required.'})
    const state = await State.findOne({ _id: req.body.id }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches ID ${req.body.id}.` });
    }
    const result = await state.deleteOne({ _id: req.body.id });
    res.json(result);
}



module.exports = {
    getAllStates,
    createFunFact,
    updateFunFact,
    deleteFunFact,
    getState
}