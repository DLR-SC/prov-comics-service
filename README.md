# prov-comics-service
## Description
Provenance Comics Service is an aws lambda based microservice that converts Provenance Documents from the API User to comic stripes.

Documents can be send via a REST-Interface or they can be used from the open source provstore website.

## Folder structure
- **/** - Top level files, configuration for serverless, linter, git and one manual testing file for service parts (main.js)
- **doc/** - REST-Interface Documentation, Architecure Overview and AWS-Service Overview
- **config/** - Configuration file
- **controller/** - REST Controller and ProvDocument Controller
- **model/** - Classes and functions for the representation of Provenance data in this application
- **services/** - Services for Image Generation, File Conversion, File Parsing and other stuff that can be done in JS
- **test/** and **resources** - Resources and Integrationchecks that can be used to validate the function of the AWS services (You can read more about this in the Testing part)
- **node_modules/** - Folder for all node.js dependencies (see package.json)

## Installation
### Prerequisites
- node.js Installation (version >= 8.11)
- maven + Java SDK (version >= 1.8)
- AWS Account

### Setup
0. check, that the services is not already installed and that there exists no S3 bucket with the name **prov-comics-storage** 
1. install serverless
    - **npm install -g serverless**
    - Longer version: https://serverless.com/framework/docs/providers/aws/guide/installation/
2. Setup AWS 
    - Create Admin account on AWS for the serverless application: https://serverless.com/framework/docs/providers/aws/guide/credentials/
    - Create **credentials** file in your *~/.aws/* folder, so serverless can use the **AWS_ACCESS_KEY_ID** and the **AWS_SECRET_ACCESS_KEY** for authentication in the AWS console
3. Deploy application
    - Download the current version of this service from github: git clone https://github.com/DLR-SC/prov-comics-service.git
    - Run **serverless deploy** from this folder
    - Wait for serverless to upload the application
4. Deploy image conversion service
    - the main prov-comics-service needs a second java based lamabda function to convert the image formats from SVG to other file types. You get it from: git clone https://github.com/DLR-SC/prov-svg-transcoder.git
    - Switch to the downloaded folder and run **serverless deploy** here, too
5. Your service should now be able to be contacted from the address that serverless printed you prompt in step 3)

## Unistall Service
- Go to your AWS Console and delete the s3 bucket **prov-comic-storage**
- Run **serverless remove** in this folder
- Run **serverless remove** in the root directory of the *prov-svg-transcoder* service

## Testing 
- Get the deploy id
    - If you deployed the service, you also got a nice API-ID that looks like this: https://skwfstpnek.execute-api.eu-central-1.amazonaws.com/dev/
    - The deploy id is the string between the **http://** and the **.execute...**
    - This would be in this case: ***skwfstpnek***
- Change the deploy id in the test file **test/transformationApi.test.js**
- Run the tests with **npm test** in the root folder (leave the test folder again)


