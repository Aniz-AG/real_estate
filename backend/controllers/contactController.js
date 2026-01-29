import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Contact } from "../models/contactModel.js";
import { User } from "../models/userModel.js";


const newContactUs = TryCatch(async (req, res, next) => {

     const { name, email, phone, message } = req.body;

     if (!name, !email, !phone, !message) {
          return new ErrorHandler("Please provided all fields. ", 400);
     }

     await Contact.create({
          name,
          email,
          phone,
          message,
     })

     res.status(201).json({
          success: true,
          message: "your contact uploaded successfully. "
     })


});
const getFilteredContactUs = TryCatch(async (req, res, next) => {
     const { status } = req.query | "";
     const limit = Number(process.env.CONTACT_PER_PAGE) || 8;
     const page = req.query.page || 1;
     const skip = (page - 1) * limit;

     const baseQuery = {};
     if (status) {
          baseQuery.status = status;
     }
     const contactPromise = Contact.find(baseQuery).limit(limit).skip(skip);
     const filteredOnlyContact = Contact.find(baseQuery);

     const contacts = await contactPromise;
     const totalPage = Math.ceil((await filteredOnlyContact).length / limit) || 1;

     res.status(200).json({
          success: true,
          message: "contact fetched successfully",
          contacts,
          totalPage,
     })

});

const deleteContactUs = TryCatch(async (req, res, next) => {
     const contactId = req.params.id;

     const contact = await Contact.findById(contactId)
     if (!contact) {
          return new ErrorHandler("contact id not found. ", 400);
     }

     await Contact.deleteOne();

     res.status(200).json({
          success: true,
          message: "contact deleted successfully"
     })
});

const updateContact = TryCatch(async (req, res, next) => {
     const contactId = req.params.id;
     const { newStatus } = req.body;


     const contact = await Contact.findById(contactId)


     if (!contact) {
          return next(new ErrorHandler("Contact not found.", 400));
     }

     if (newStatus) {
          contact.status = newStatus;
          await contact.save();
     }


     res.status(200).json({
          success: true,
          message: "contact status update successfully"
     })
})

export {
     newContactUs,
     getFilteredContactUs,
     deleteContactUs,
     updateContact
};
