import * as fs from 'fs';
import * as path from 'path';

import * as http from 'http';
import * as soap from 'soap';
import * as xml2json from 'xml2json';

import StudentVue from './StudentVue';

type MethodName = 'GetPXPMessages'

interface IProcessWebServiceRequestArgs {
    userID: string
    password: string
    skipLoginLog: boolean
    parent: boolean
    webServiceHandleName: string
    methodName: MethodName
    paramStr: string
}

/*
CONFIGURATION
*/

const SCHEMA = 'http';
const HOSTNAME = 'localhost';
const PORT = '8000';

const services = {
    PXPCommunication: {
        PXPCommunicationSoap: {
            ProcessWebServiceRequest: (args: IProcessWebServiceRequestArgs) => {
                return StudentVue[args.methodName](JSON.parse(xml2json.toJson(args.paramStr))['Parms']);
            }
        }
    }
};

const wsdl = fs.readFileSync(path.join(__dirname, '..', 'PXPCommunication.wsdl.xml'), 'utf8')
    .replace(/\[ORIGIN]/g, SCHEMA + '://' + HOSTNAME + ':' + PORT);

const server = http.createServer((req, res) => {
    res.end('404: Not Found: ' + req.url);
});

server.listen(PORT);
const soapServer = soap.listen(server, '/Service/PXPCommunication.asmx', services, wsdl, () => {
    console.log('Server is listening on port ' + PORT);
});

soapServer.log = console.log;
