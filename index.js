import express from "express";
import path from "path";

// verifiers
import vTrinsicEmailRouter from "./verifiers/trinsic-ebook.js";
import vEmailCorrespondenceRouter from "./verifiers/email-correspondence.js";
import vLumaParticipationRouter from "./verifiers/luma-participation.js";
import vDevpostSubmissionRouter from "./verifiers/devpost-submission.js";

const app = express();
app.use(express.json());
//app.use(cors());

app.use("/verifiers/trinsic-ebook", vTrinsicEmailRouter);
app.use("/verifiers/email-correspondence", vEmailCorrespondenceRouter);
app.use("/verifiers/luma-participation", vLumaParticipationRouter);
app.use("/verifiers/devpost-submission", vDevpostSubmissionRouter);

// Serve static files from the 'public' folder
app.use(express.static(process.cwd()));

app.get("/samples/:filename", (req, res) => {
  console.log(req.params)
  res.sendFile(path.join(process.cwd(), "/verifiers/"+ req.params.filename));
});

// Catch-all to return index.html for any other request
// index.html has the form to present email, choose a proof verifier, then button to verify
// which call relevant verfier in the ./verifiers folder
app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the demo page at http://localhost:${PORT}`);
});
