
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
## erc1155
 supports erc1155 with mint functionality for now
 @dev for erc1155 modify config to fetch nft data. to be synced with decentralised storage where nft is stored
## erc721 
 will add in future 

## metada fetching
 have local json data of all nfts to sell 
 and a sync api rout to write to {tokenid}.json file to sync if uri was updated

## price change monitoring
// send req to sync rout aftrevery price change /
    # automation
        // set up a open zeplindefender autotask on every prich change function call