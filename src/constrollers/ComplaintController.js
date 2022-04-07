const Complaint = require('../models/ComplaintModel');
// import Complaint = from '../models/ComplaintModel';

module.exports = {

  async index(request, response){
    try {
      const complaint = await Complaint.find();

      console.log(complaint);

      return response.send({ complaint });
    } catch (error) {
      console.log("Failed load Complaint: ", error);
      return response.status(400).json({ error: 'Failed load Complaints!' });
    }
  },

  async create(request, response){
    try {
      const { description } = request.body;

      await Complaint.create({ description });

      return response.status(201);
    } catch (error) {
      console.log("Failed create Complaint: ", error);
      return response.status(400).json({ error: 'Failed create Complaint!' }) 
    }
  }

}