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
  res.send({ meeting: meetingResponse });
});

app.post("/attendee/:meetingId", async (req, res, next) => {
  const { meetingId } = req.params;
  const { userId } = req.query;

  console.log(
    `Received request params: ${JSON.stringify(req.params, undefined, 2)}`
  );
  console.log(
    `Received request body: ${JSON.stringify(req.body, undefined, 2)}`
  );
  console.log(
    `Received request query: ${JSON.stringify(req.query, undefined, 2)}`
  );

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
  res.send({
    attendee: attendeeResponse,
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
