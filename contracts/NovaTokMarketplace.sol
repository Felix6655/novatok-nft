// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC721 {
  function ownerOf(uint256 tokenId) external view returns (address);
  function safeTransferFrom(address from, address to, uint256 tokenId) external;
  function getApproved(uint256 tokenId) external view returns (address);
  function isApprovedForAll(address owner, address operator) external view returns (bool);
}

contract NovaTokMarketplace {
  struct Listing {
    address seller;
    address nft;
    uint256 tokenId;
    uint256 price; // in wei
    bool active;
  }

  uint256 public listingCount;
  mapping(uint256 => Listing) public listings;

  address public feeRecipient;
  uint256 public feeBps; // 250 = 2.5%

  event Listed(uint256 indexed listingId, address indexed seller, address indexed nft, uint256 tokenId, uint256 price);
  event Purchased(uint256 indexed listingId, address indexed buyer);
  event Cancelled(uint256 indexed listingId);

  constructor(address _feeRecipient, uint256 _feeBps) {
    feeRecipient = _feeRecipient;
    feeBps = _feeBps;
  }

  function list(address nft, uint256 tokenId, uint256 price) external returns (uint256) {
    require(price > 0, "price=0");

    IERC721 token = IERC721(nft);
    require(token.ownerOf(tokenId) == msg.sender, "not owner");
    require(
      token.getApproved(tokenId) == address(this) || token.isApprovedForAll(msg.sender, address(this)),
      "not approved"
    );

    listingCount += 1;
    listings[listingCount] = Listing({
      seller: msg.sender,
      nft: nft,
      tokenId: tokenId,
      price: price,
      active: true
    });

    emit Listed(listingCount, msg.sender, nft, tokenId, price);
    return listingCount;
  }

  function cancel(uint256 listingId) external {
    Listing storage l = listings[listingId];
    require(l.active, "inactive");
    require(l.seller == msg.sender, "not seller");
    l.active = false;
    emit Cancelled(listingId);
  }

  function buy(uint256 listingId) external payable {
    Listing storage l = listings[listingId];
    require(l.active, "inactive");
    require(msg.value == l.price, "wrong value");

    l.active = false;

    // fee
    uint256 fee = (msg.value * feeBps) / 10_000;
    uint256 payout = msg.value - fee;

    // transfer NFT
    IERC721(l.nft).safeTransferFrom(l.seller, msg.sender, l.tokenId);

    // pay seller
    (bool ok1, ) = payable(l.seller).call{value: payout}("");
    require(ok1, "seller payout failed");

    // pay fee recipient
    if (fee > 0) {
      (bool ok2, ) = payable(feeRecipient).call{value: fee}("");
      require(ok2, "fee payout failed");
    }

    emit Purchased(listingId, msg.sender);
  }
}
