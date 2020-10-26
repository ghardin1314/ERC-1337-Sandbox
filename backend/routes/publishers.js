var express = require("express");
var Publisher = require("../models/publisher");
var router = express.Router();

router
  .route("/")

  .post(function (req, res) {
      console.log(res.body)
    var publisher = new Publisher();
    publisher._id = req.body.address;
    publisher.username = req.body.username;

    publisher.save(function (err) {
      if (err) {
        console.log(err);
        res.send(err);
        return;
      }
      res.json({ message: "Publisher Saved!" });
    });
  })

  .get(function (req, res) {
    Publisher.find(function (err, publishers) {
      if (err) res.send(err);

      res.json(publishers);
    });
  });

router
  .route("/:publisher_address")

  .get(function (req, res) {
    Contract.findById(req.params.publisher_address, function (err, publisher) {
      if (err) res.send(err);
      res.json(publisher);
    });
  })

  .delete(function (req, res) {
    Publisher.deleteOne(
      {
        _id: req.params.publisher_address,
      },
      function (err, publisher) {
        if (err) res.send(err);

        res.json({ message: "Deleted Successfully" });
      }
    );
  });

module.exports = router;