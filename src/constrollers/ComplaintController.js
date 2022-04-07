const Complaint = require('../models/ComplaintModel');
// import Complaint = from '../models/ComplaintModel';

module.exports = {

  async index(request, response){
    try {
      // const getDateToday = new Date().toLocaleDateString();
      // console.log(getDateToday.toLocaleDateString());
      // const newDateToday = getDateToday.toLocaleDateString();
      // const getDateComplaintsDate = await Complaint.find();

      // const [dateComplaint] = getDateComplaintsDate.map(c => c.date);
      // const refinedDateComplaint = dateComplaint?.toLocaleDateString();
      // console.log(refinedDateComplaint);

      const count = await Complaint.countDocuments().where({ validation: false });
      // const countToday = await Complaint.countDocuments().where({ date:  });
      response.header('X-Total-Count', count);
      
      // const totalComplaints = count;
      const complaints = await Complaint.find().sort({ _id: -1 });

      // console.log(complaint);

      return response.send({ complaints });
    } catch (error) {
      // console.log("Failed load Complaint: ", error);
      return response.status(400).json({ error: 'Failed load Complaints!' });
    }
  },

  async dashboard(request, response){
    try {
      const getDateToday = new Date().toLocaleDateString();

      const totalComplaints = await Complaint.countDocuments().where({ validation: false });

      const getDateComplaintsDate = await Complaint.find();

      const [dateComplaint] = getDateComplaintsDate.map(c => c.date);
      // const refinedDateComplaint = dateComplaint?.toLocaleDateString();
      // console.log(refinedDateComplaint);

      response.header('X-Total-Count', totalComplaints);

      return response.send({ totalComplaints });
    } catch (error) {
      return response.status(400).json({ error: 'Failed Count Complaints!' });
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