const State = require('../model/State');

const getAllStates = async (req, res) => {
    const states = await State.find();
    if (!states) return res.status(204).json({ 'message': 'No states found.' });
    res.json(states);
}

const createNewState = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required'})
    }

    try {
        const result = await State.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateState = async (req, res) => {
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

const deleteState = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({'message': 'State ID required.'})
    const state = await State.findOne({ _id: req.body.id }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches ID ${req.body.id}.` });
    }
    const result = await state.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getState = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({'message': `State provided was ${req.params.state}`})
    const state = await State.findOne({ stateCode: req.params.state }).exec();
    if (!state) {
        return res.status(204).json({ "message": "Invalid state abbreviation parameter" });
    }
    res.json(state);
}

module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteState,
    getState
}