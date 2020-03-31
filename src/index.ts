import * as fs from 'fs';
import * as path from 'path';

import * as https from 'https';
import * as soap from 'soap';
import * as xml2json from 'xml2json';
import * as Entities from 'html-entities';

import * as _ from 'lodash';

import StudentVue from './StudentVue';

const XmlEntities = Entities.XmlEntities;
const entities = new XmlEntities();

interface IProcessWebServiceRequestArgs {
    userID: string
    password: string
    skipLoginLog: boolean
    parent: boolean
    webServiceHandleName: string
    methodName: string
    paramStr: string
}

/*
CONFIGURATION
*/

const SCHEMA = 'https';
const HOSTNAME = 'localhost';
const PORT = 8000;

const ORIGIN = SCHEMA + '://' + HOSTNAME + ':' + PORT;

const services = {
    PXPCommunication: {
        PXPCommunicationSoap: {
            ProcessWebServiceRequest: (args: IProcessWebServiceRequestArgs) => {
                return {
                    ProcessWebServiceRequestResult: StudentVue[args.methodName](JSON.parse(xml2json.toJson(args.paramStr))['Parms'])
                };
            }
        }
    }
};

const wsdlTemplate = _.template(fs.readFileSync(path.join(__dirname, '..', 'PXPCommunication.wsdl.xml'), 'utf8'));
const wsdl = wsdlTemplate({ origin: ORIGIN });

const server = https.createServer({
    key: process.env.KEY || fs.readFileSync(path.join(__dirname, '..', 'localhost-key.pem')),
    cert: process.env.CERT || fs.readFileSync(path.join(__dirname, '..', 'localhost.pem')),
}, (req: any, res: any) => {
    res.end('404: Not Found: ' + req.url);
});

server.listen(PORT);
const soapServer = soap.listen(server, '/Service/PXPCommunication.asmx', services, wsdl, () => {
    console.log('Server is listening on port ' + PORT);
});

soapServer.log = console.log;
soapServer.on('response', response => {
    response.result = response.result.replace(/&quot;/g, '"');
});
