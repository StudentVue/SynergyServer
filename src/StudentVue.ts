const StudentVue: { [key: string]: (params: object) => object } = {
    'GetPXPMessages': () => {
        return require('../data/GetPXPMessages.json');
    }
};

export default StudentVue;
