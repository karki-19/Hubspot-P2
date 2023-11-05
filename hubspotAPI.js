import hubspot from "@hubspot/api-client";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_API_KEY,
});

export const addContactToHubspot = async (userData) => {
  const { firstname, lastname, email, phone } = userData;

  const properties = {
    email,
    phone,
    firstname,
    lastname,
  };

  const SimplePublicObjectInputForCreate = { associations: [], properties };

  try {
    const apiResponse = await hubspotClient.crm.contacts.basicApi.create(
      SimplePublicObjectInputForCreate
    );
    return apiResponse;
  } catch (e) {
    return e.message === "HTTP request failed" ? e.response : e;
  }
};

export const sendEmail = async (userEmail) => {
  try {
    const data = JSON.stringify({
      engagement: {
        type: "EMAIL",
      },
      metadata: {
        from: {
          email: "deepakbisht807@gmail.com",
          firstName: "Deepak",
          lastName: "Karki",
        },
        to: [
          {
            email: userEmail,
          },
        ],
        subject: "Welcome to HubSpot",
        html: `<!DOCTYPE html>
          <html>
          <head>
              <title>Welcome to HubSpot</title>
          </head>
          <body>
              <div class="email-container">
                  <h1>Welcome to HubSpot</h1>
                  <p>Hi there,</p>
                  <p>We are pleased to inform you that you have been invited to our team.</p>
                  <a href = "https://join.slack.com/t/contentninjatest/shared_invite/zt-25lnrpm8k-OC4Yw05eojxbbYu9~06TFw">Click on the Link to get to the Slack Channel"></a>
                  <p>Best regards,</p>
                  <p class="signature">- Deepak Karki</p>
              </div>
          </body>
          </html>`,
        text: "Hi there we are pleased to inform you that you have been invited to our slack team\n\n-Thanks and regards ",
      },
    });

    const config = {
      method: "post",
      url: "https://api.hubapi.com/engagements/v1/engagements",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      },
      data: data,
    };
    await axios.request(config);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const checkByEmail = async (email) => {
  try {
    const data = JSON.stringify({
      idProperty: "email",
      inputs: [
        {
          id: email,
        },
      ],
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.HUBSPOT_URL}/contacts/batch/read`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      },
      data,
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllContacts = async (limit = 10) => {
  try {
    const apiResponse = await hubspotClient.crm.contacts.basicApi.getPage(
      limit
    );
    return apiResponse;
  } catch (e) {
    return e.message === "HTTP request failed" ? e.response : e;
  }
};

export const deleteContact = async (contactId) => {
  try {
    const apiResponse = await hubspotClient.crm.contacts.basicApi.archive(
      contactId
    );
    return apiResponse
  } catch (e) {
    return e.message === "HTTP request failed" ? e.response : e;
  }
};

export const editContact = async (contactId, userObject) => {
  const { firstname, lastname, email, phone } = userObject;
  const properties = {
      firstname,
      lastname,
      email,
      phone
    };
    const SimplePublicObjectInput = { properties };
    try {
        const apiResponse = await hubspotClient.crm.contacts.basicApi.update(
            contactId,
            SimplePublicObjectInput
            );
            console.log(apiResponse)
    return apiResponse
  } catch (e) {
    return e.message === "HTTP request failed" ? e.response : e;
  }
};
