const Account = require('../models/Account');

const getAccounts = async (req, res) => {
    const { userName, sort, fields } = req.query;
    const queryObject = {};
    if (userName) {
        queryObject.userName = { $regex: userName, $options: 'i' };
    }
    let result = Account.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('userName')
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const accounts = await result;
    return res.status(200).json({ accounts, nbHits: accounts.length });
}

const createAccount = async (req, res) => {
    const account = await Account.create(req.body)
    return res.status(201).json({ account });
}

const getAccount = async (req, res) => {
    const { id: accountID } = req.params;
    const account = await Account.findOne({ _id: accountID });
    if (!account) {
        return res.status(404).json({ msg: `No account with ID: ${accountID}` });
    }
    return res.status(200).json({ account });

}

const updateAccount = async (req, res) => {
    const { id: accountID } = req.params;

    const account = await Account.findOneAndUpdate({ _id: accountID }, req.body, {
        new: true,
        runValidators: true
    })
    if (!account) {
        return res.status(404).json({ msg: `No account with ID: ${accountID}` });
    }
    return res.status(200).json({ account });
}


const deleteAccount = async (req, res) => {
    const { id: accountID } = req.params;
    const account = await Account.findOneAndDelete({ _id: accountID });
    if (!account) {
        return res.status(404).json({ msg: `No account with ID: ${accountID}` });
    }
    return res.status(200).json({ account });
}

module.exports = { getAccounts, getAccount, createAccount, updateAccount, deleteAccount };