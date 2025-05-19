const mongoose = require('mongoose');
const GuestHouse = require('../models/GuestHouse'); 
const Room = require('../models/GuestRoom');
const {guesthouses,rooms}= require("../config/roomData")

//  ObjectIds for each guest house
const guestHouseIds = {
  JCBose: new mongoose.Types.ObjectId(),
  VikramSarabhai: new mongoose.Types.ObjectId(),
  HomiJBhaba: new mongoose.Types.ObjectId(),
  AcademicBlock: new mongoose.Types.ObjectId(),
  Lakeview: new mongoose.Types.ObjectId(),
  International: new mongoose.Types.ObjectId()
};

// JC Bose Guest House
guesthouses[0].rooms = rooms.filter(room => room.guestHouse.equals(guestHouseIds.JCBose)).map(room => room._id);

// Vikram Sarabhai Guest House
guesthouses[1].rooms = rooms.filter(room => room.guestHouse.equals(guestHouseIds.VikramSarabhai)).map(room => room._id);

// Homi J Bhaba Guest House
guesthouses[2].rooms = rooms.filter(room => room.guestHouse.equals(guestHouseIds.HomiJBhaba)).map(room => room._id);

// Academic Block Residency
guesthouses[3].rooms = rooms.filter(room => room.guestHouse.equals(guestHouseIds.AcademicBlock)).map(room => room._id);

// Lakeview Guest House
guesthouses[4].rooms = rooms.filter(room => room.guestHouse.equals(guestHouseIds.Lakeview)).map(room => room._id);

// International Guest House
guesthouses[5].rooms = rooms.filter(room => room.guestHouse.equals(guestHouseIds.International)).map(room => room._id);

mongoose.connect('mongodb://localhost:27017/stayswap')
  .then(async () => {
    await GuestHouse.insertMany(guesthouses);
    await Room.insertMany(rooms);
    console.log('Data inserted successfully!');
    mongoose.disconnect();
  })
  .catch(console.error);
