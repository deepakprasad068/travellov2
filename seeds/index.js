const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {})
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price: 400,
      //YOUR USER ID
      auther: "65e017b5933fa228532e5384",
      description:
        "good for being with your better half as well as with family",
      Image: [
        {
          url: "https://res.cloudinary.com/dprskrdh0/image/upload/v1709466952/YAP%20CAMP/bmibamrxiuyjj0xut9yp.jpg",
          filename: "YAP CAMP/bmibamrxiuyjj0xut9yp",
        },
        {
          url: "https://res.cloudinary.com/dprskrdh0/image/upload/v1709466953/YAP%20CAMP/lqytvrkykhrcmmbdczia.jpg",
          filename: "YAP CAMP/lqytvrkykhrcmmbdczia",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
