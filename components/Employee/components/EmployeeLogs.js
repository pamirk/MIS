import * as React from 'react';
import {useState} from 'react';

function EmployeeLogs({id}) {
    const [loading, setLoading] = useState(false);

    return (
       <>
           {id}
       </>
    );
}
export default EmployeeLogs;