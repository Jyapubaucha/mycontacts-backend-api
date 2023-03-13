const asyncHandler = require("express-async-handler");

const Contact = require("../models/contactModel");


//@description Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json({ contacts });
})


//@description Create new contact
//@route POST /api/contacts
//@access private
const createContacts = asyncHandler(async (req, res) => {
    console.log("The new contact is ", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        throw new Error("All the details must be added.");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });
    res.status(200).json({ contact });
})


//@description Get contact information
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json({ contact });
})


//@description Update contact information
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update others contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json({ updatedContact });
});

//@description Delete contact information
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update others contacts");
    }

    await contact.deleteOne({_id: req.params.id});
    res.status(200).json({ contact });
});

module.exports = { getContacts, createContacts, getContact, updateContact, deleteContact };