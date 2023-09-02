import '@ututrust/web-components';
import { ethers } from "ethers";

declare global {
  namespace JSX {
    // prevents typescript errors for the tags
    interface IntrinsicElements {
      "x-utt-balance": any;
      "x-utu-app-link": any;
      "x-utu-wallet-disconnect": any;
      "x-utu-root": any;
      "x-utu-recommendation": any;
      "x-utu-feedback-details-popup": any;
      "x-utu-feedback-form-popup": any;
    }
  }
}

let getId = (assetIdentifier: string) => {
  // The reason we are creating ether addresses is they are required for endorsements on the
  // chain.
  return ethers.utils
    .id(assetIdentifier)
    .slice(0, 40 + 2)
    .toLowerCase()
}

export default function Offers(props: any) {
  let offers = props.offers;
  let _window: any = window;
  let provider = _window.ethereum;
  let walletAddress = provider.selectedAddress;

  // @ts-ignore
  return (
    <div className="offers">
      <ul>
        {
          offers.map((offer: any) =>
            <li className="offer" key={offer.id}>
              <div style={{ fontWeight: 'bold' }}>{offer.name}</div>
              <x-utu-root
                source-uuid={walletAddress}
                target-type="provider"
                target-uuids={getId(offer.id)}>
                <x-utu-recommendation
                  target-uuid={getId(offer.id)}
                  style={{ marginTop: "-20px" }} />
              </x-utu-root>
              <br />
              <x-utu-feedback-details-popup
                target-uuid={getId(offer.id)}
                source-uuid={walletAddress}
              />
              <x-utu-feedback-form-popup
                source-uuid={walletAddress}
                target-uuid={getId(offer.id)}
                transaction-id={5} />
            </li>
          )
        }
      </ul>
    </div>
  );
}
