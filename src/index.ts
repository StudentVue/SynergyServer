import * as fs from 'fs';
import * as path from 'path';

import * as https from 'https';
import * as http from 'http';
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

const ORIGIN = process.env.ORIGIN;

if (typeof ORIGIN === 'undefined') {
    throw new Error('provide an origin');
}

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

const requestHandler = (req: any, res: any) => {
    res.end('404: Not Found: ' + req.url);
};

function soapifyServer(server: http.Server) {
    const soapServer = soap.listen(server, '/Service/PXPCommunication.asmx', services, wsdl, () => {
        const address: any = server.address();
        console.log('Listening on port ' + address.port);
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
}

const httpServer = http.createServer(requestHandler);
httpServer.listen(80);
soapifyServer(httpServer);

const httpsServer = https.createServer({
    key: process.env.KEY ? fs.readFileSync(process.env.KEY) : undefined,
    cert: process.env.CERT ? fs.readFileSync(process.env.CERT) : undefined,
}, requestHandler);
httpsServer.listen(443);
soapifyServer(httpsServer);
