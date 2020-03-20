import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import ComplaintDetails from "../../components/Complaints/ComplaintDetails";
import React from "react";
import N_ComplaintDetails from "../../components/Complaints/N_ComplaintDetails";

function Complaint_id({complain_data, data, complainDetails, user }) {

    return (

        <div style={{minHeight: '100vh'}}>

            {/*<ComplaintDetails p_complain_data={complain_data} p_data={data} p_complainDetails={complainDetails } user={user}/>*/}
            <N_ComplaintDetails p_complain_data={complain_data} p_data={data} p_complainDetails={complainDetails } user={user}/>
        </div>
    );
}

Complaint_id.getInitialProps = async ({query: {complaint_id} , ctx}) => {
    const url1 = `${baseUrl}/api/complain/${complaint_id}`;
    const url2 = `${baseUrl}/api/sc/${complaint_id}`;
    const response1 = await axios.get(url1);
    const response2 = await axios.get(url2);

    return {
        complain_data: response1.data.row,
        data: response2.data.rows,
        complainDetails: response2.data.rows[response2.data.rows.length - 1],
    };
};

export default Complaint_id;
