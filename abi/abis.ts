export const IERC20 = [
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool) ",
    "function allowance(address owner, address spender) external view returns (uint256) ",
]
export const IERC1155 =[
    "function uri(uint256) external view returns (string memory)",
    "function balanceOf(address account, uint256 id) external view returns (uint256)",
    "function balanceOfBatch(address[] memory accounts, uint256[] memory ids) external view returns (uint256[] memory)"
]
//@dev add future support
export const IERC721ABI =[

]
//@dev use api to calculate total with ssr dot use directly in client side
export const IMintEngineABI=[
    "function calculateTotal(uint256[] memory ids, uint256[] memory amounts) public view returns(uint256)",
    "function price(uint256) external view returns(uint256)",
    "function buy(address account, uint256 id, uint256 amount, bytes memory data,address currency) external",
    "function buyBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data,address currency) external"
]