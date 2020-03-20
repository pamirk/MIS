import moment from "moment";

export const period = (d1, d2) => {
    let now = moment(d1); //todays date
    let end = moment(d2); // another date
    let duration = moment.duration(now.diff(end));
    duration = duration.asDays();
    duration = Math.abs(duration);
    duration = Math.ceil(duration);
    if (duration === 0) duration++;
    if (duration > 1) {
        duration += " days"
    } else {
        duration += " day"
    }
    return duration;
};


export const Statuses = {
    registered: 'REGISTERED',
    initiated: 'INITIATED',
    inProcess: 'IN PROCESS',
    resolved: 'RESOLVED',
};
