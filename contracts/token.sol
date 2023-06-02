// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Token
/// @notice An ERC20 token contract for minting and managing tokens
contract Token is ERC20 {
    /// @notice Contract constructor
    /// @param name The name of the token
    /// @param symbol The symbol of the token
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    }

    /// @notice Mints new tokens and assigns them to the caller's address
    /// @param amount The amount of tokens to mint
    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    /// @notice Mints new tokens and assigns them to the specified address
    /// @param to The address to which the minted tokens will be assigned
    /// @param amount The amount of tokens to mint
    function mintFor(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
