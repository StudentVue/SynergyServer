import * as fs from 'fs';
import * as path from 'path';

import * as moment from 'moment';
import * as _ from 'lodash';

const TEMPLATES_PATH = path.join(__dirname, '..', 'templates');

const PXPMessages = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'PXPMessages.xml'), 'utf8'));
const ChildList = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'ChildList.xml'), 'utf8'));
const SoundFileData = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'SoundFileData.xml'), 'utf8'));
const SupportedLanguages = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'SupportedLanguages.xml'), 'utf8'));
const ContentUserDefinedModule = _.template(fs.readFileSync(path.join(TEMPLATES_PATH, 'ContentUserDefinedModule.xml'), 'utf8'));

const StudentVue: { [key: string]: (params: object) => any } = {
    // MISC METHODS
    SHOW_GET_FORGOT_PASSWORD_BUTTON_STATUS: () => true,
    GETSECURITYSTATUS: () => false,
    ChildList: () => {
        return ChildList({
            date: moment().format('MM/DD/YYYY')
        });
    },
    GetSoundFileData: () => {
        return SoundFileData();
    },
    GetSupportedLanguages: () => {
        return SupportedLanguages();
    },
    GetContentUserDefinedModule: () => {
        return ContentUserDefinedModule();
    },

    // DATA METHODS

    GetPXPMessages: () => {
        return PXPMessages({
            messages: [
                {IconURL: 'images/PXP/TchComment_S.gif', ID: 'Test Message ID', BeginDate: moment().format('MM/DD/YYYY kk:mm:ss'), Type: 'StudentActivity', Subject: 'This is a Test Message', Content: 'This is a Test Message.'}
            ]
        });
    }
};

export default StudentVue;
