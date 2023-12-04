
# You've got mail and VC!

Email is the most versatile UI/UX and the OG of identity. 

With tons of data sitting in inboxes, this app verifies e-mails into VCs to proof literally anything.

## What it does?

This app showcases how email can be used as a trusted and credible source to generate verified credentials (without involvement of issuers). This is possible because integrity of email is ensured via DKIM (DomainKeys Identified Mail).

A user can present his/her email in _raw format_ or _.eml_ file to proof something. Verifier/attestor can then check for authenticity of email with reference to DKIM signature, verifies that authenticated email has certain information via regexes. If everything checks out, the verifier/attestor will issue the VC to user through _Trinsic SDK_.

***Permissionless*** there is no need for 3rd party, APIs, etc.... this is the beauty of using email as VCs. Users can use the emails in their inboxes which they have received from relevant sources. And then get VCs issued through Trinsic.

***Proof anything*** literally anything using emails in the inboxes. Emails received in the past as well as in the future.

## Use-cases

***Examples*** use-cases for this are endless.

Below I have listed out ideas I could think of. Also I have implemented a few use-cases. Please refer to Github repo for details. Verifiers can be founder in `./verifiers` folder.

- proof of download of Trinsic ebook (code: `./verifiers/trinsic-ebook.js`)
  - by verifying email received from Riley Hughes about the ebook
- proof of participation in webinar (code: `./verifiers/luma-participation.js`)
  - by verifying email received from Luma event
- proof of correspondence (code: `./verifiers/email-correspondence.js`)
  - by checking email between 2 people, and noting the date
- proof of submission on Devpost (code: `./verifiers/devpost-submission.js`)
  - by verifying email received from Devpost
- proof of contribution to a Github repo
  - by verifying successful PR merge email from Github
- proof of friendship length
  - by verifying email communication between 2 people and noting the date
- proof of bank transfer
  - by verifying email received from Venmo/Zelle
- proof of belonging (university, student group etc)
  - by verifying welcome email received
- proof of newsletter subscription
  - by verifying email newsletter received (the first one, and the recent one)
- many more...

## How to run

This app is a simple ExpressJS app.

```
cp .env.example .env
```

Copy provided `.env` example and set `TRINSIC_AUTH_TOKEN`
Then run the server.

```
npm install
node index.js
```

Then head over to http://localhost:3000
Choose a proof verifer. 
You can load the sample email by clicking `Load Sample Email` on the right bottom of the form.
Click `Verify` button which makes `POST` request to verifier API and issue a verified credential via _Trinsic SDK_

## Code structure
`./index.js` is the entry point to the app

`./verifiers` the folder has `.js` files which verify emails and issue credentials. `.txt` files contains sample raw emails.

_Schema for VC_: https://schema.trinsic.cloud/stupefied-haibt-zg8jgredzmdh/proof-by-email
