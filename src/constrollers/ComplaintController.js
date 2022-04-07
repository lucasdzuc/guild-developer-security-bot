const Complaint = require('../models/ComplaintModel');
// import Complaint = from '../models/ComplaintModel';

module.exports = {

  async index(request, response){
    try {
      const count = await Complaint.countDocuments().where({ validation: false });

      response.header('X-Total-Count', count);

      const complaints = await Complaint.find().sort({ _id: -1 });

      // console.log(complaint);

      return response.send({ complaints });
    } catch (error) {
      // console.log("Failed load Complaint: ", error);
      return response.status(400).json({ error: 'Failed load Complaints!' });
    }
  },

  async create(request, response){
    try {
      const { message_id, text, date } = request;
      // const text = data;
      // console.log(request);

      // console.log("ControllerComplaint:", text);

      await Complaint.create({ message_id, text, date });

      return response.status(201).send();
    } catch (error) {
      // console.log("Failed create Complaint:");
      return response.status(400).json({ error: 'Failed create Complaint!' }) 
    }
  }

}