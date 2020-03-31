import * as fs from 'fs';
import * as path from 'path';

import * as moment from 'moment';
import * as _ from 'lodash';

const CONFIG = require('../config.json');

const TEMPLATES_PATH = path.join(__dirname, '..', 'templates');

const TestWebServiceURL = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'TestWebServiceURL.xml'), 'utf8'));
const ChildList = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'ChildList.xml'), 'utf8'));
const SoundFileData = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'SoundFileData.xml'), 'utf8'));
const LanguageLists = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'LanguageLists.xml'), 'utf8'));
const AllModuleRecordData = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'AllModuleRecordData.xml'), 'utf8'));

const PXPMessagesData = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'PXPMessages.xml'), 'utf8'));

const StudentVue: { [key: string]: (params: object) => any } = {
    // MISC METHODS
    TestWebServiceURL: () => {
        return TestWebServiceURL({
            organizationName: CONFIG.organizationName
        });
    },
    SHOW_GET_FORGOT_PASSWORD_BUTTON_STATUS: () => true,
    GETSECURITYSTATUS: () => false,
    ChildList: () => {
        return ChildList({
            districtEvents: [{DstEventGU: '', EventDate: moment().format('MM/DD/YYYY'), EventTime: '', ShortTitle: 'Test', ShortDesc: 'This is a mock StudentVue server, behavior may be unpredictable.'}],
            childName: 'Test User',
            childID: 12345678,
            organizationName: CONFIG.organizationName,
            childGrade: 12
        });
    },
    GetSoundFileData: () => {
        return SoundFileData();
    },
    GetSupportedLanguages: () => {
        return LanguageLists();
    },
    GetContentUserDefinedModule: () => {
        return AllModuleRecordData();
    },

    // DATA METHODS

    GetPXPMessages: () => {
        return PXPMessagesData({
            messages: [
                {IconURL: 'images/PXP/TchComment_S.gif', ID: 'Test Message ID', BeginDate: moment().format('MM/DD/YYYY kk:mm:ss'), Type: 'StudentActivity', Subject: 'This is a Test Message', Content: 'This is a Test Message.'}
            ]
        });
    }
};

export default StudentVue;
