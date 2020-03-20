import baseUrl from "../../utils/baseUrl";
import axios from "axios";

export default class Data {
    api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
        const url = baseUrl + "/v2.api" + path;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'type': 'formData'
            },
        };

        if (body !== null) {
            options.body = JSON.stringify(body);
        }

        if (requiresAuth) {
            const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
            // options.body = JSON.stringify({role: credentials.role});

        }
        return fetch(url, options);
    }

    async getUser(username, password, role) {
        console.log("pk: ", username, password, role)

        const response = await this.api(`/getusers`, 'POST', {username, password, role}, true, {
            username,
            password,
            role
        });
        if (response.status === 200) {
            return response.json().then(data => data);
        } else if (response.status === 401) {
            return null;
        } else {
            throw new Error();
        }
    }
    async getConsumer(cnic, password) {
        console.log("pk: ", cnic, password)

        const response = await this.api(`/getConsumer`, 'POST', {cnic, password}, false);
        console.log("response: ", response)

        if (response.status === 200) {
            return response.json().then(data => data);
        } else if (response.status === 401) {
            return null;
        } else {
            throw new Error();
        }
    }

    async createUser(user) {
        console.log(user);

        const fd = new FormData();
        fd.append('account_number', user.account_number);
        fd.append('user_cnic', user.user_cnic);
        fd.append('user_name', user.user_name);
        fd.append('user_email', user.user_email);
        fd.append('user_password', user.user_password);
        fd.append('user_address', user.user_address);
        fd.append('user_contact', user.user_contact);
        fd.append('user_cnic_front_image', user.user_cnic_front_image, user.user_cnic_front_image);
        fd.append('user_cnic_back_image', user.user_cnic_back_image, user.user_cnic_back_image);
        fd.append('user_wasa_bill_image', user.user_wasa_bill_image, user.user_wasa_bill_image);


        axios.post(baseUrl + '/api/create_consumer', fd)
            .then(response => {
                console.log("hi htere", response.data.status);
                if (response.data.status === 201) {
                    return [] ;
                } else if (response.data.status === 400) {
                    return response.data.json().then(data => {
                        return data.errors;
                    });
                }else {
                    throw new Error();
                }
            });
    }
}
