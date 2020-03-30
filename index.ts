import * as fs from 'fs';
import * as path from 'path';

import * as http from 'http';
import * as soap from 'soap';

/*
CONFIGURATION
*/

const SCHEMA = 'http';
const HOSTNAME = 'localhost';
const PORT = '8000';

const services = {
    PXPCommunication: {
        PXPCommunicationSoap: {
            ProcessWebServiceRequest: (args: any) => {
                console.log(args);
                return {
                    'test': 'test'
                };
            }
        }
    }
};


const wsdl = fs.readFileSync(path.join(__dirname, '..', 'PXPCommunication.wsdl.xml'), 'utf8')
    .replace('[ORIGIN]', SCHEMA + '://' + HOSTNAME + ':' + PORT);

const server = http.createServer((req, res) => {
    res.end('404: Not Found: ' + req.url);
});

server.listen(PORT);
const soapServer = soap.listen(server, '/Service/PXPCommunication.asmx', services, wsdl, () => {
    console.log('Server is listening on port ' + PORT);
});

soapServer.log = console.log;
