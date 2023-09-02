import { useState } from "react";
import Offers from "./Offers";
import { ethers } from "ethers";

// @ts-ignore
import { addressSignatureVerification, AuthData } from "@ututrust/web-components";

import { ConnectKitButton } from "connectkit";

// A list of offers to be shown to the user, such as a list of products in an e-commerce app or a 
// list of service providers in a sharing economy app. This would typically be retrieved from the 
// app's backend. In this example provider_1 could be something like netflix.
const OFFERS = [
  {
    name: "Paul",
    id: "provider_1"
  },
  {
    name: "Jane",
    id: "provider_2"
  },
  {
    name: "Ali",
    id: "provider_3"
  }
];


function App() {
  const [hasToken, setHasToken] = useState(false);
  let overrideApiUrl = process.env.REACT_APP_API_URL;

  const triggerUtuIdentityDataSDKEvent = (
    identityData: AuthData
  ): void => {
    const event = new CustomEvent("utuIdentityDataReady", {
      detail: identityData,
    });
    window.dispatchEvent(event);
  };




  const initEntity = async (data: AuthData, offer: any) => {
    await fetch(overrideApiUrl + "/core-api-v2/entity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data.access_token}`,
      },
      body: JSON.stringify({
        name: offer.id,
        type: "provider",
        ids: {
          uuid: ethers.utils
            .id(offer.id)
            .slice(0, 40 + 2)
            .toLowerCase(),
        },
        // image:
        //  "https://i0.wp.com/utu.io/wp-content/uploads/job-manager-uploads/company_logo/2020/12/cropped-UTU-LG-FV.png?fit=192%2C192&ssl=1",
      }),
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  };


  let onConnectToUtuClick = async () => {
    // This passes the wallet provider to the SDK so it can do its magic
    // It effectively logs into the UTU Trust Network services and you get a response object back
    // which encapsulates the successful log in.  Among other things it contains the JWT Token.
    let authDataResponse = await addressSignatureVerification(
      // overrideApiUrl
    );

    // This instructs the GUI that it can show the Recommendations, show feedback and give feedback
    // screens.
    if (authDataResponse) {
      setHasToken(true);
    }

    // The initEntity call is necessary to map the offers in a remote neo4j db
    for (let i = 0; i < OFFERS.length; i++) {
      await initEntity(authDataResponse, OFFERS[i]);
    }

    // this passes the JWT token info to all parts of the SDK. Expect this SDK method to be 
    // refactored into the SDK addressSignatureVerification in later versions of the SDK.
    triggerUtuIdentityDataSDKEvent(authDataResponse);
  }

  return (
    <div
      style={{
        backgroundColor: 'antiquewhite',
        padding: '20px',
        border: '1px solid black',
      }}
    >
      <h2>Welcome to the UTU SDK Demo for React</h2>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        (1)
		 <ConnectKitButton />
      </div>
      <div style={{ paddingTop: '10px' }}>
        (2){' '}
        <button
          type='button'
          style={{ cursor: 'pointer' }}
          className={`x-utu-btn x-utu-btn-light border-radius`}
          onClick={onConnectToUtuClick}
        >
          Connect to UTU
        </button>
      </div>
      <div style={{ paddingTop: '10px' }}>(3) Give or Show Feedback</div>
      {hasToken ? (
        <Offers offers={OFFERS} />
      ) : (
        <div style={{ paddingTop: '10px' }}>
          Nothing to show until you perform Step 2
        </div>
      )}
    </div>
  );
}

export default App;

