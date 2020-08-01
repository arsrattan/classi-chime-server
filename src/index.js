const express = require("express");
const AWS = require("aws-sdk");
const uuidv4 = require("uuid").v4;

const app = express();
const chime = new AWS.Chime({ region: "us-east-1" });
chime.endpoint = new AWS.Endpoint(
  "https://service.chime.aws.amazon.com/console"
);
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/meeting", async (req, res, next) => {
  const meetingResponse = await chime
    .createMeeting({
      ClientRequestToken: uuidv4(),
    })
    .promise()
    .catch((err) => console.log(err));
  res
    .json({
      meeting: meetingResponse,
    })
    .send();
});

app.post("/attendee/:meetingId", async (req, res, next) => {
  const { meetingId } = req.params;
  const { userId } = req.query;

  if (meetingId === undefined || userId === undefined) {
    res.json({
      error: "The request params are incorrect",
    });
    return;
  }

  const attendeeResponse = await chime
    .createAttendee({
      MeetingId: meetingId,
      ExternalUserId: userId,
    })
    .promise()
    .catch((err) => console.log(err));
  res
    .json({
      attendee: attendeeResponse,
    })
    .send();
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
