import React from "react";
import PersonalDetails from "../components/Employee/components/PersonalDetails";

function Details({user}) {

    return (
       <PersonalDetails user={user}/>
    );
}
export default Details;
