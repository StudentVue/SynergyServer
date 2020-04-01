import * as fs from 'fs';
import * as path from 'path';

import * as https from 'https';
import * as soap from 'soap';
import * as xml2json from 'xml2json';

import * as _ from 'lodash';

import StudentVue from './StudentVue';

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

const SCHEMA: string = 'https';
const HOSTNAME = process.env.HOSTNAME || 'localhost';
const PORT = Number(process.env.PORT) || 8000;

const ORIGIN = SCHEMA + '://' + HOSTNAME + (
    (SCHEMA == 'https' && PORT != 443 || SCHEMA == 'http' && PORT != 80) ? ':' + PORT : '');

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
    key: process.env.KEY ? fs.readFileSync(process.env.KEY) : undefined,
    cert: process.env.CERT ? fs.readFileSync(process.env.CERT) : undefined,
}, (req: any, res: any) => {
    res.end('404: Not Found: ' + req.url);
});

server.listen(PORT);
const soapServer = soap.listen(server, '/Service/PXPCommunication.asmx', services, wsdl, () => {
    console.log('Server is listening on port ' + PORT);
});

soapServer.log = console.log;
soapServer.on('request', request => {
    for (let key of Object.keys(request.Body.ProcessWebServiceRequest)) {
        const value: any = request.Body.ProcessWebServiceRequest[key];
        if (typeof value === 'object') {
            request.Body.ProcessWebServiceRequest[key] = value['$value'] || '';
        }
    }
});
soapServer.on('response', response => {
    response.result = response.result.replace(/&quot;/g, '"');
});
