import React, { useState } from 'react';
import Select, { OnChangeValue, SingleValue } from 'react-select';
import { Company } from '../interfaces';

type selectOp = {
    label: string, 
    value: number
};
interface SelectProps {
    companyList: Company[];
    setCompany: React.Dispatch<React.SetStateAction<number>>;
    default?: selectOp
};

const CompanySelect: React.FC<SelectProps> = ({ companyList, setCompany }, props) => {
    const companyOptions = companyList.map((company) => {
        let container: selectOp = {label: "", value: 0}; 

        container.label = company.companyName;
        container.value = company.companyId;

        return container;
    });
    const start = (props.default) ? props.default : companyOptions[0];
    const [selectedOption, setSelectedOption ] = useState<OnChangeValue<selectOp, false>>(start);

    //if option is ever null Company should be set to 0
    const handleChange = (option: SingleValue<selectOp>) => {
        (option != null) ? setCompany(option.value) : setCompany(0);
        setSelectedOption(option);
    }

    console.log(props.default);

    // //reset the inputs as you switch between them
    // const handleToggle = () => {
    //     setCompany(0);
    //     setSelectedOption(companyOptions[0]);
    //     setCreateCompany(!createCompany);
    // }

    return (
        <div>
            <label>Company: (Optional)</label>
            <Select
                value={selectedOption} 
                onChange={option => handleChange(option)}
                options={companyOptions}
            />
        </div>
    );
}

export default CompanySelect;