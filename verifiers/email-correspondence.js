import express from "express";
import "dotenv/config";
import { dkimVerify } from "mailauth/lib/dkim/verify.js";
import { parseHeaders } from "mailauth/lib/tools.js";
import { SignatureType, TrinsicService } from "@trinsic/trinsic";

const vEmailCorrespondenceRouter = express.Router();

vEmailCorrespondenceRouter.get("/", (req, res) => {
    res.send("route: vEmailCorrespondenceRouter");
});

vEmailCorrespondenceRouter.post("/", async (req, res) => {
    const email = req.body.email;
    if (!email)
        res.status(400).send({ error: "Raw email content is required" });

    // Verify DKIM first
    const result = await dkimVerify(email);

    var verifyFailed = true;
    var verifyFailedMessage;

    for (let { info } of result.results) {
        console.log("### verifying DKIM signature");
        console.log("info", info);

        //pass, temperror, fail
        if (info.startsWith("dkim=pass")) {
            verifyFailed = false;
        } else {
            verifyFailed = true;
            verifyFailedMessage = `DKIM failed: ${info.split(" header.")[0]}`;
            break;
        }
    }

    while (verifyFailed === false) {
        // get email metadata such as to, from, subject
        const headers = parseHeaders(email);

        let from, to, messageId, subject, date, email_matches;
        const email_regex =
            /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
        const messageId_regex = /\<(.*?)\@/i;

        for (let h of headers.parsed) {
            if (h.key === "from" || "to")
                email_matches = email_regex.exec(h.line.toString());
            if (h.key === "from") from = email_matches[0];
            if (h.key === "to") to = email_matches[0];

            if (h.key === "message-id")
                messageId = messageId_regex.exec(h.line.toString())[1];
            if (h.key === "subject")
                subject = h.line.toString().split("Subject: ")[1];
            if (h.key === "date") date = h.line.toString().split("Date: ")[1];
            //if(h.key === 'dkim-signature') console.log(h.line.toString());
        }

        console.log("Email metadata:", from, to, messageId, subject, date);

        // check FROM
        if (from !== "noreply@luma-mail.com") {
            verifyFailed = true;
            verifyFailedMessage = "Invalid FROM field";
            break;
        }

        // check subject - no need to check
        // if (!subject.startsWith("Thanks for joining ")) {
        //     verifyFailed = true;
        //     verifyFailedMessage = "Invalid Subject field";
        //     break;
        // }

        // all checks successful
        // now issue a VC via Trinsic
        const trinsic = new TrinsicService({
            authToken: process.env.TRINSIC_AUTH_TOKEN,
        });

        const values = {
            // following fields are defined in the schema,
            // but not all are required to be filled in
            proofType: "luma-participation",
            toEmail: to,
            fromEmail: from,
            date: date,

            // extra information we'd like to include in the credential
            subject: subject,
        };

        const issueResponse = await trinsic.credential().issueFromTemplate({
            // required
            templateId:
                "https://schema.trinsic.cloud/stupefied-haibt-zg8jgredzmdh/proof-by-email",
            valuesJson: JSON.stringify(values),
            // optional
            signatureType: SignatureType.EXPERIMENTAL, // STANDARD or EXPERIMENTAL
            includeGovernance: true,
            saveCopy: true,
        });

        console.dir(issueResponse, { depth: null });

        // send the VC to user
        const sendResponse = await trinsic.credential().send({
            documentJson: issueResponse.documentJson,
            email: to,
        });

        console.dir(sendResponse, { depth: null });

        res.send({
            status: "success",
            values: values,
        });
        break;
    }

    // verification failed
    if (verifyFailed === true) {
        res.send({
            status: "failed",
            message: verifyFailedMessage,
        });
    }
});

export default vEmailCorrespondenceRouter;
